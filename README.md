# react_native_sample_app

A simple plugin that demonstrate the usage of Neura in a React Native app.

## VERSIONS

* react_native_sample_app >= 0.1.0 supports react-native >= 0.52.0 and react == 16.0.0

## Known issues
------
## Getting started

Follow these instructions to create a Neura app and get your app UID:
  * [iOS](https://dev.theneura.com/tutorials/ios)
  * [Android](https://dev.theneura.com/tutorials/android)

### - Install
Download / clone the react_native_sample_app repositories to your app folder
#### iOS
1. `npm i --save react_native_sample_app` OR `yarn add react_native_sample_app`
2. In Xcode: 
  1. Create a new group with the name of your app inside Libraries catalog.
  2. drag and drop into with the name of your app group:
      * `node_modules/react_native_sample_app/ios/NeuraSDKManager/NeuraSDKManager.m`
      * `node_modules/react_native_sample_app/ios/NeuraSDKManager/NeuraSDKManager.h`
3. `cd ios` - So you can `pod install` Neura SDK
4. Follow the rest of the instructions in the Neura iOS tutorial using the NeuraSDKManager

#### Android
1. `npm i --save react_native_sample_app` OR `yarn add react_native_sample_app`
2. `react-native link react_native_sample_app`
3. Connect Firebase (for push notifications)
    - open AndroidStudio
    - `Open an existing Android Studio project`
    - select ${projectRoot}/android
    - Click `Tools > Firebase` to open the `Assistant window`
    - Click `Cloud messaging`
    - Click `Connect to Firebase`
    - Create new or select existed firebase project
    - Click `Add FCM to your app`
    - Accept Changes
4. open file `android/app/build.gradle` and update dependencies:
```
  ...
  android {
    compileSdkVersion 26
    buildToolsVersion '27.0.3'

    defaultConfig {
        ...
        minSdkVersion 16
        targetSdkVersion 26
        ...
    }
    ...
    dependencies {
      ...
      implementation ("com.theneura:android-sdk:+") {
        exclude group: "com.google.android.gms"
        exclude group: "com.google.firebase"
      }
      implementation ("com.google.android.gms:play-services-gcm:15.0.1")
      implementation ("com.google.android.gms:play-services-location:15.0.1")
      implementation ("com.google.android.gms:play-services-awareness:15.0.1")
      implementation ("com.google.firebase:firebase-messaging:17.1.0")
      implementation ("com.google.firebase:firebase-core:16.0.1")
      ...
    }
    ...
    apply plugin: 'com.google.gms.google-services'
```
6. Handling push notifications:
- You should install [`react-native-fcm`](https://github.com/evollu/react-native-fcm)
- Add handler of neura events:
```
  Neura.notificationHandler(notification.data)
```
## Usage

** Android version have to be initialized (call `init` method) before using

Methods:
  * (Android only) `init`:({ appUid: string, secret: string }) => void
  * `authenticate`:() => `Promise<string | Error>`
  * `isAuthenticated`: () => `Promise<boolean>`
  * `getUserAccessToken`: () => `Promise<?string>`
  * `getUserId`: () => `Promise<?string>`
  * `notificationHandler`: (neuraNotificationData) => `Promise<neuraEvent | Error>`

Example:
```
    import Neura from 'react_native_sample_app'

    ...
      try {
        //Just for android
        Neura.init()

        const isAuth = await Neura.isAuthenticated()

        if (!isAuth) {
          const token = await Neura.authenticate()
        }
      } catch (error) {
        console.log(error)
      }
    ...
```
