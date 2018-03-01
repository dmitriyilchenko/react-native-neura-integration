package com.neurareact.neurasdkmanager;

import android.os.Message;
import android.util.Log;
import android.os.Bundle;

import com.facebook.react.bridge.Callback;
import com.facebook.react.bridge.NativeModule;
import com.facebook.react.bridge.ReactApplicationContext;
import com.facebook.react.bridge.ReactContext;
import com.facebook.react.bridge.ReactContextBaseJavaModule;
import com.facebook.react.bridge.ReactMethod;
import com.facebook.react.bridge.ReadableMap;
import com.facebook.react.bridge.Promise;
import com.facebook.react.bridge.Arguments;

import com.neura.standalonesdk.service.NeuraApiClient;
import com.neura.standalonesdk.util.Builder;
import com.neura.standalonesdk.util.SDKUtils;

import com.neura.standalonesdk.events.NeuraEventCallBack;
import com.neura.resources.authentication.AnonymousAuthenticateCallBack;
import com.neura.resources.authentication.AnonymousAuthenticateData;
import com.neura.sdk.object.AnonymousAuthenticationRequest;
import com.neura.sdk.service.SubscriptionRequestCallbacks;
import com.neura.sdk.object.EventDefinition;
import com.google.firebase.iid.FirebaseInstanceId;
import com.neura.resources.user.UserDetailsCallbacks;
import com.neura.resources.user.UserDetails;


import java.util.ArrayList;
import java.util.HashMap;
import java.util.Map;


public class NeuraSDKModule extends ReactContextBaseJavaModule {
  private NeuraApiClient mNeuraApiClient;

  private Callback success;
  private Callback error;


  private String appUid = "";
  private String appSecret = "";

  public NeuraSDKModule(ReactApplicationContext reactContext) {
    super(reactContext);
  }

  @Override
  public String getName() {
    return "Neura";
  }

  @ReactMethod
  public void init(ReadableMap config, Promise promise) {
    appUid = config.getString("appUid");
    appSecret = config.getString("appSecret");
    Builder builder = new Builder(getReactApplicationContext());
    mNeuraApiClient = builder.build();
    mNeuraApiClient.setAppUid(appUid);
    mNeuraApiClient.setAppSecret(appSecret);
    mNeuraApiClient.connect();
    promise.resolve("initialized");
  }

  @ReactMethod
  public void authenticate(final Promise promise) {
    String pushToken = FirebaseInstanceId.getInstance().getToken();

    AnonymousAuthenticationRequest request = new AnonymousAuthenticationRequest(pushToken);

    mNeuraApiClient.authenticate(request, new AnonymousAuthenticateCallBack() {
      @Override
      public void onSuccess(AnonymousAuthenticateData authenticateData) {
        Log.i(getClass().getSimpleName(), "Successfully requested authentication with neura. ");
        promise.resolve(authenticateData);
      }

      @Override
      public void onFailure(int errorCode) {
        Log.e(getClass().getSimpleName(), "Failed to authenticate with neura. "
                      + "Reason : " + SDKUtils.errorCodeToString(errorCode));
        promise.resolve(SDKUtils.errorCodeToString(errorCode));
      }
    });
  }

  @ReactMethod
  public void isAuthenticated(Promise promise) {
    Boolean isLoggedIn = mNeuraApiClient.isLoggedIn();

    promise.resolve(isLoggedIn);
  }

  @ReactMethod
  public void getUserAccessToken(Promise promise) {
    String token = mNeuraApiClient.getUserAccessToken();

    promise.resolve(token);
  }

  @ReactMethod
  public void getUserId(final Promise promise) {
    mNeuraApiClient.getUserDetails(new UserDetailsCallbacks() {
      @Override
      public void onSuccess(UserDetails userDetails) {
        promise.resolve(userDetails);
      }

      @Override
      public void onFailure(Bundle resultData, int errorCode) {
        promise.reject(new Error());
      }
    });
  }

  @ReactMethod
  public void notificationHandler(ReadableMap details) {
    Bundle bundle = Arguments.toBundle(details);

    boolean isNeuraPush = NeuraPushCommandFactory.getInstance().isNeuraPush(getApplicationContext(), bundle, new NeuraEventCallBack() {
      @Override
      public void neuraEventDetected(NeuraEvent event) {
          Log.d("Neura event:", event);
          promise.resolve(event);
      }
    });


    if(!isNeuraPush) {
      promise.reject(new Error("Neura event not found"));
    }
  }
}
