package com.dayzzpublic.neuraintegration;

import com.facebook.react.bridge.Arguments;
import com.facebook.react.bridge.Callback;
import com.facebook.react.bridge.ReactApplicationContext;
import com.facebook.react.bridge.ReactContext;
import com.facebook.react.bridge.ReactContextBaseJavaModule;
import com.facebook.react.bridge.ReactMethod;
import com.facebook.react.bridge.ReadableMap;
import com.facebook.react.bridge.Promise;
import com.facebook.react.bridge.WritableMap;
import com.facebook.react.modules.core.DeviceEventManagerModule;
import com.neura.resources.authentication.AnonymousAuthenticationStateListener;
import com.neura.resources.authentication.AuthenticateCallback;
import com.neura.resources.authentication.AuthenticationState;
import com.neura.sdk.object.AuthenticationRequest;
import com.neura.sdk.object.Permission;
import com.neura.sdk.service.SimulateEventCallBack;
import com.neura.standalonesdk.service.NeuraApiClient;
import com.neura.standalonesdk.util.SDKUtils;
import com.neura.standalonesdk.events.NeuraEventCallBack;
import com.neura.standalonesdk.events.NeuraEvent;
import com.neura.standalonesdk.events.NeuraPushCommandFactory;
import com.neura.resources.authentication.AnonymousAuthenticateCallBack;
import com.neura.resources.authentication.AnonymousAuthenticateData;
import com.neura.sdk.object.AnonymousAuthenticationRequest;
import com.neura.resources.authentication.AuthenticateData;
import com.neura.sdk.service.SubscriptionRequestCallbacks;
import com.google.firebase.iid.FirebaseInstanceId;
import com.neura.resources.user.UserDetailsCallbacks;
import com.neura.resources.user.UserDetails;
import java.util.Arrays;
import java.util.List;
import java.util.Map;
import android.content.Context;
import android.content.pm.PackageInstaller;
import android.content.res.Resources;
import android.util.Log;
import android.os.Bundle;

public class NeuraIntegrationModule extends ReactContextBaseJavaModule {
  private Callback success;
  private Callback error;
  private String appUid = "";
  private String appSecret = "";
  private ReactApplicationContext mReactApplicationContext;
  private String LoginSuccessMessage = "Successfully requested authentication with neura. ";

  public NeuraIntegrationModule(ReactApplicationContext reactContext) {
    super(reactContext);
    mReactApplicationContext = reactContext;
    NeuraIntegrationSingleton.getInstance().setreactContext(mReactApplicationContext);
  }

  @Override
  public String getName() {
    return "RNNeuraIntegration";
  }

  @ReactMethod
  private void authenticateWithPhone(String phone, final Promise promise) {
    AuthenticationRequest request = new AuthenticationRequest(Permission.list(new String[]{"presenceAtHome",  "sleepingHabits"}));
    request.setPhone(phone);
    NeuraIntegrationSingleton.getInstance().getNeuraApiClient().authenticate(request, new AuthenticateCallback() {
      @Override
      public void onSuccess(AuthenticateData authenticateData) {
        String successMessage = "Successfully authenticated with neura. Token: " +  authenticateData.getAccessToken()+  " User Id: " +  authenticateData.getNeuraUserId();
        Log.i(getClass().getSimpleName(), successMessage);
        promise.resolve( authenticateData.getAccessToken());
      }

      @Override
      public void onFailure(int errorCode) {
        String errorMessage = "Failed to authenticate with neura. Reason" +  SDKUtils.errorCodeToString(errorCode);
        Log.e(getClass().getSimpleName(), errorMessage);
        promise.reject(SDKUtils.errorCodeToString(errorCode), errorMessage);
      }
    });
  }

  @ReactMethod
  private void authenticateAnon(final Promise promise) {
    String startMessage = "Anon auth starting";
    Log.i(getClass().getSimpleName(), startMessage);

    if ( NeuraIntegrationSingleton.getInstance().getNeuraApiClient().isLoggedIn()) {
      Log.i(getClass().getSimpleName(), "Already Logged In");
      NeuraIntegrationSingleton.getInstance().onAuth();
      promise.resolve(LoginSuccessMessage);
    } else {
      Log.i(getClass().getSimpleName(), "Will attempt to log in");
      //Get the FireBase Instance ID, we will use it to instantiate AnonymousAuthenticationRequest
      String pushToken = FirebaseInstanceId.getInstance().getToken();

      Log.i(getClass().getSimpleName(), "PUSH TOKEN:" + pushToken);

      //Instantiate AnonymousAuthenticationRequest instance.
      AnonymousAuthenticationRequest request = new AnonymousAuthenticationRequest(pushToken);

      //Pass the AnonymousAuthenticationRequest instance and register a call back for success and failure events.
      NeuraIntegrationSingleton.getInstance().getNeuraApiClient().authenticate(request, new AnonymousAuthenticateCallBack() {
        @Override
        public void onSuccess(AnonymousAuthenticateData authenticateData) {
          NeuraIntegrationSingleton.getInstance().registerAuthStateListener();
          String debug = LoginSuccessMessage + " Neura Id: "  + authenticateData.getNeuraUserId() + " Is logged in is: " +  NeuraIntegrationSingleton.getInstance().getNeuraApiClient().isLoggedIn();
          Log.i(getClass().getSimpleName(), debug);
          promise.resolve(debug);
        }

        @Override
        public void onFailure(int errorCode) {
          String errorMessage = "Failed to authenticate with neura. Reason" +  SDKUtils.errorCodeToString(errorCode);
          Log.e(getClass().getSimpleName(), errorMessage);
          promise.reject(SDKUtils.errorCodeToString(errorCode), errorMessage);
        }
      });

      Log.i(getClass().getSimpleName(), "Attempted log in");
    }
  }

  @ReactMethod
  public void isAuthenticated(Promise promise) {
    Boolean isLoggedIn = NeuraIntegrationSingleton.getInstance().getNeuraApiClient().isLoggedIn();
    Log.i(getClass().getSimpleName(), "isAuthenticated: "  + isLoggedIn);
    promise.resolve(isLoggedIn);
  }

  @ReactMethod
  public void getUserAccessToken(Promise promise) {
    if ( NeuraIntegrationSingleton.getInstance().getNeuraApiClient().isLoggedIn()) {
      String token = NeuraIntegrationSingleton.getInstance().getNeuraApiClient().getUserAccessToken();
      Log.i(getClass().getSimpleName(), "getUserAccessToken: "  + token);
      promise.resolve(token);
    } else {
      Log.i(getClass().getSimpleName(), "getUserAccessToken Not logged in");
      promise.reject("Not logged in");
    }


  }

  @ReactMethod
  public void getUserId(final Promise promise) {
    NeuraIntegrationSingleton.getInstance().getNeuraApiClient().getUserDetails(new UserDetailsCallbacks() {
      @Override
      public void onSuccess(UserDetails userDetails) {
        promise.resolve(userDetails.getData().getNeuraId());
      }

      @Override
      public void onFailure(Bundle resultData, int errorCode) {
        promise.reject(new Error());
      }
    });
  }

  @ReactMethod
  public void notificationHandler(ReadableMap details, final Promise promise) {
    Map detailsMap = NeuraIntegrationMapUtil.recursivelyDeconstructReadableMap(details);
    Context mContext = getReactApplicationContext().getCurrentActivity().getBaseContext();

    boolean isNeuraPush = NeuraPushCommandFactory.getInstance().isNeuraPush(mContext, detailsMap, new NeuraEventCallBack() {
      @Override
      public void neuraEventDetected(NeuraEvent event) {
        //Log.d("Neura event:", event);
        promise.resolve(event);
      }
    });


    if(!isNeuraPush) {
      promise.reject(new Error("Neura event not found"));
    }
  }

  @ReactMethod
  public void simulateAnEvent(final Promise promise) {
    NeuraIntegrationSingleton.getInstance().getNeuraApiClient().simulateAnEvent("userArrivedHomeByWalking", new SimulateEventCallBack(){
      @Override
      public void onSuccess(String s) {
        String debug = "Fired, check server: " + s;
        Log.i(getClass().getSimpleName(), debug);
        promise.resolve(debug);
      }

      @Override
      public void onFailure(String s, String s1) {
        String errorMessage = "Failed, boo";
        Log.e(getClass().getSimpleName(), errorMessage);
        promise.reject(errorMessage);
      }


    });

  }
}