package com.dayzzpublic.neuraintegration;

import android.app.Notification;
import android.app.NotificationManager;
import android.content.Context;
import android.support.v4.app.NotificationCompat;
import android.util.Log;

import com.google.firebase.messaging.FirebaseMessagingService;
import com.google.firebase.messaging.RemoteMessage;
import com.neura.standalonesdk.events.NeuraEvent;
import com.neura.standalonesdk.events.NeuraEventCallBack;
import com.neura.standalonesdk.events.NeuraPushCommandFactory;

import java.util.Map;

public class NeuraIntegrationEventsService extends FirebaseMessagingService {

    private Context context;

    public NeuraIntegrationEventsService() {}
    public NeuraIntegrationEventsService(Context context) {
        this.context = context;
    }

    @Override
    public void onMessageReceived(RemoteMessage message) {
        Log.i(getClass().getSimpleName(), "onMessageReceived");
        if (context == null) {
            context = getApplicationContext();
        }
        boolean isNeuraPush = NeuraPushCommandFactory.getInstance().isNeuraPush(context, message.getData(), new NeuraEventCallBack() {
            @Override
            public void neuraEventDetected(NeuraEvent event) {
                String eventText = (event != null) ? event.toString() : "couldn't parse data";
                Log.i(getClass().getSimpleName(), "received Neura event - " + eventText);
                generateNotification(context, eventText);
            }
        });

        if (isNeuraPush) {
            Log.i(getClass().getSimpleName(), "received Neura event should have been handled");
        } else {
            Log.i(getClass().getSimpleName(), "received non Neura event should have been ignored");
        }


    }


    private void generateNotification(Context context, String eventText) {
        NotificationCompat.Builder builder = new NotificationCompat.Builder(context);
        Log.e(getClass().getSimpleName(), "generateNotification");


        String appName = "Neura";
        int stringId = context.getApplicationInfo().labelRes;
        if (stringId > 0)
            appName = context.getString(stringId);

        builder.setContentTitle(appName + " received an event")
                .setContentText(eventText)
                .setAutoCancel(true)
                .setWhen(System.currentTimeMillis())
                .setStyle(new NotificationCompat.BigTextStyle().bigText(eventText));

        Notification notification = builder.build();

        NotificationManager notificationManager = (NotificationManager) context.getSystemService(Context.NOTIFICATION_SERVICE);
        notificationManager.notify((int) System.currentTimeMillis(), notification);
    }
}