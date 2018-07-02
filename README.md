# react_native_sample_app

A simple plugin that allows using Neura for React Native.

## VERSIONS

- react_native_sample_app >= 0.1.0 supports react-native >= 0.52.0 and react == 16.0.0

## Known issues

---

## Getting started

Follow the instructions to install the SDK for

- [iOS](https://dev.theneura.com/tutorials/ios)
- [Android](https://dev.theneura.com/tutorials/android)

### - Auto install

Comming soon...

### - Manual install

#### iOS

1.  `npm i --save react_native_sample_app` OR `yarn add react_native_sample_app`
2.  In Xcode:
3.  Create a new group NeuraRN inside Libraries catalog.
4.  drag and drop into NeuraRN group:
    - `node_modules/react_native_sample_app/ios/NeuraSDKManager/NeuraSDKManager.m`
    - `node_modules/react_native_sample_app/ios/NeuraSDKManager/NeuraSDKManager.h`

#### Android

1.  `npm i --save react_native_sample_app` OR `yarn add react_native_sample_app`
2.  `react-native link react_native_sample_app`
3.  Connect Firebase (for push notifications)
    - open AndroidStudio
    - `Open an existing Android Studio project`
    - select ${projectRoot}/android
    - Click `Tools > Firebase` to open the `Assistant window`
    - Click `Cloud messaging`
    - Click `Connect to Firebase`
    - Create new or select existed firebase project
    - Click `Add FCM to your app`
    - Accept Changes
4.  open file `android/app/build.gradle` and update dependencies:

```
  ...
  android {
    compileSdkVersion 24
    buildToolsVersion "24.0.2"

    defaultConfig {
        ...
        targetSdkVersion 24
        ...
    }
    ...
    dependencies {
      ...
      compile "com.android.support:appcompat-v7:23.4.0"
      ...
```

\*\*4. Handling push notifications:

- You should install [`react-native-fcm`](https://github.com/evollu/react-native-fcm)
- Add handler of neura events:

```
  Neura.notificationHandler(notification.data)
```

## Usage

\*\*\* Android version have to be initialized (call `init` method) before using

Methods:

- (Android only) `init`:({ appUid: string, secret: string }) => void
- `authenticate`:() => `Promise<string | Error>`
- `isAuthenticated`: () => `Promise<boolean>`
- `getUserAccessToken`: () => `Promise<?string>`
- `getUserId`: () => `Promise<?string>`
- `notificationHandler`: (neuraNotificationData) => `Promise<neuraEvent | Error>`

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
