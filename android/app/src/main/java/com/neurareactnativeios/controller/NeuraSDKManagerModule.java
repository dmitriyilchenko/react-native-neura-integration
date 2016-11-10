package com.neurareactnativeios.controller;

import android.widget.Toast;
import java.util.ArrayList;
import android.util.Log;

import com.facebook.react.bridge.ReactApplicationContext;
import com.facebook.react.bridge.ReactContextBaseJavaModule;
import com.facebook.react.bridge.ReactMethod;
import com.facebook.react.ReactRootView;
import com.facebook.react.ReactInstanceManager;

import com.google.firebase.iid.FirebaseInstanceId;
import com.neura.resources.authentication.AuthenticateCallback;
import com.neura.resources.authentication.AuthenticateData;
import com.neura.sdk.object.AuthenticationRequest;
import com.neura.sdk.object.Permission;
import com.neura.standalonesdk.util.SDKUtils;

import com.neurareactnativeios.R;
import com.neurareactnativeios.controller.NeuraManager;

// these classes are required for playing the audio

public class NeuraSDKManagerModule extends ReactContextBaseJavaModule {

    private final ReactApplicationContext mReactApplicationContext;

    private ArrayList<Permission> mPermissions;

    public NeuraSDKManagerModule(ReactApplicationContext reactContext) {
        super(reactContext);
        mReactApplicationContext = reactContext;

        /** Copy the permissions you've declared to your application from
         * https://dev.theneura.com/console/edit/YOUR_APPLICATION - permissions section,
         * and initialize mPermissions with them.
         * for example : https://s31.postimg.org/x8phjuza3/Screen_Shot_2016_07_27_at_1.png
         */
        mPermissions = new ArrayList<>(Permission.list(new String[]{
                "userLeftWork", "userLeftHome", "userLeftActiveZone", "userArrivedWorkFromHome",
                "userArrivedHome", "userArrivedHomeFromWork", "userArrivedToWork",
                "userArrivedAtGroceryStore", "userArrivedAtSchoolCampus", "userArrivedAtAirport",
                "userArrivedAtHospital", "userLeftAirport", "userArrivedAtClinic",
                "userArrivedAtRestaurant", "userLeftCafe", "userLeftHospital", "userArrivedAtCafe",
                "userLeftRestaurant", "userLeftSchoolCampus", "userArrivedAtPharmacy", "userLeftGym",
                "userArrivedAtActiveZone", "userArrivedToGym", "userStartedRunning",
                "userStartedWalking", "userFinishedRunning", "userFinishedDriving",
                "userStartedDriving", "userFinishedWalking", "userStartedWorkOut", "userWokeUp",
                "userStartedSleeping", "userGotUp", "userFinishedWorkOut", "userIsIdle",
                "userIsOnTheWayToWork", "userIsOnTheWayToActiveZone", "userIsOnTheWayHome",
                "activitySummaryPerPlace", "wellnessProfile", "dailyActivitySummary",
                "getLocationNodesSemantics", "sleepData", "getPersonNodesSemantics",
                "getDeviceNodesSemantics", "userDetails", "userSituation"}));
    }

    @Override
    public String getName() {
        return "NeuraSDKManagerAndroid";
    }

    @ReactMethod
    public void initConnection() {
        Toast.makeText(mReactApplicationContext, "init neura connection", Toast.LENGTH_LONG).show();
        NeuraManager.getInstance().initNeuraConnection(mReactApplicationContext,
                mReactApplicationContext.getResources().getString(R.string.app_uid),
                mReactApplicationContext.getResources().getString(R.string.app_secret));
    }

    /**
     * Authenticate with Neura
     * Receiving unique neuraUserId and accessToken (for external api calls : https://dev.theneura.com/docs/api/insights)
     */
    @ReactMethod
    public void authenticate() {
        Toast.makeText(mReactApplicationContext, "android native toast", Toast.LENGTH_LONG).show();
        AuthenticationRequest request = new AuthenticationRequest(mPermissions);
        NeuraManager.getInstance().getClient().authenticate(request, new AuthenticateCallback() {
            @Override
            public void onSuccess(AuthenticateData authenticateData) {
                Log.i(getClass().getSimpleName(), "Successfully authenticate with neura. NeuraUserId = "
                        + authenticateData.getNeuraUserId() + ". AccessToken = " + authenticateData.getAccessToken());
                /**
                 * Go to our push notification guide for more info on how to register receiving
                 * events via firebase https://dev.theneura.com/docs/guide/android/pushnotification.
                 * If you're receiving a 'Token already exists error',make sure you've initiated a
                 * Firebase instance like {@link com.neura.sampleapplication.activities.MainActivity#onCreate(Bundle)}
                 * http://stackoverflow.com/a/38945375/5130239
                 */
                NeuraManager.getInstance().getClient().registerFirebaseToken(getCurrentActivity(),
                        FirebaseInstanceId.getInstance().getToken());
            }

            @Override
            public void onFailure(int errorCode) {
                Log.e(getClass().getSimpleName(), "Failed to authenticate with neura. Reason : "
                        + SDKUtils.errorCodeToString(errorCode));
            }
        });
    }
}
