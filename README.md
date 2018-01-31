# react-native-neura

A simple plugin that allows using Neura for React Native.

## VERSIONS

* react-native-neura >= 0.1.0 supports react-native >= 0.52.0 and react == 16.0.0

## Known issues

I could not find how to make the import for iOS work properly since I'm using Cocoapods for Neura. If you have a suggestion that would be great.

## Getting started

Follow the instructions to install the SDK for
  * [iOS](https://dev.theneura.com/tutorials/ios)
  * [Android](https://dev.theneura.com/tutorials/android)

### - Auto install
  Comming soon...

### - Manual install
#### iOS
1. `npm i --save react-native-neura` OR `yarn add react-native-neura`
2. In Xcode: 
  1. Create a new group NeuraRN inside Libraries catalog.
  2. drag and drop into NeuraRN group:
    * `node_modules/react-native-neura/ios/NeuraSDKManager/NeuraSDKManager.m`
    * `node_modules/react-native-neura/ios/NeuraSDKManager/NeuraSDKManager.h`

#### Android
1. `npm i --save react-native-neura` OR `yarn add react-native-neura`
2. `react-native link react-native-neura`
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
## Usage

*** Android version have to be initialized (call `init` method) before using

Methods:
  * (Android only) `init`:({ appUid: string, secret: string }) => void
  * `authenticate`:() => `Promise<string | Error>`
  * `isAuthenticated`: () => `Promise<boolean>`
  * `getUserAccessToken`: () => `Promise<?string>`
  * `getUserId`: () => `Promise<?string>`

Example:
```
    import Neura from 'react-native-neura'

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
