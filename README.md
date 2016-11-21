# React Native Sample App

This sample app demontrates the integration of both the iOS and Android SDKs into React Native.

Here, we'll break it down into three main steps. If you're only integrating for iOS or Android, feel free to skip the irrelevant section.

## iOS
On the <a href="https://dev.theneura.com/docs/guide/ios/setup">Neura Devsite</a> follow the initial setup guide until you hit the "How to use the SDK" section. From here, you'll follow this guide.

In your AppDelegate.h file, create a reference to the root view controller. We'll need this to conduct actions that run on the main UI thread in the application.
```
@property (nonatomic, strong) UIViewController *rootViewController;
```

Next, make sure to assign this property to the root view controller that you create in appDelegate.m. See the code provided in the sample for reference.

In order to access native API methods from React Native code, you need a Bridge Module. For the Neura SDK, we've included one in the sample project, classed NeuraSDKManageriOS. Drag both the .h and .m files into your project. You'll also need the actual Neura SDK. Drag the appropriate one in (depending on if you're testing on the simulator or an actual device) and make sure to follow the steps outlined on the Neura website, including editing your info.plist, and adding the SDK as an embedded binary.

## Android
When bridging the Android SDK, there are two important files to take note of, the NeuraSDKManagerModule and the NeuraSDKManagerPackage. Both of these files must be included in your project as well. Be sure include these two modules in your MainApplication getPackages() method.


## Final steps (both platforms)
If you take a look at the sample app, you'll find a NeuraSDKManager.js file in the App/Lib directory. Because we have made on effort to ensure consistency across naming and functionality for functions in their respective bridges, there is no need to use two different bridged SDKs in your project. Simply drag the NeuraSDKManager.js file into your project. This file asks React Native whether the current platform is iOS or Android and all method calls to the right one. When it comes time to make an SDK call, import the SDK into the component or container that requires it with:
```
import NeuraSDKManager from '../Lib/NeuraSDKManager';
```
All data returned from our SDK is returned in a callback consistent with typical JS code. If you'd like to learn more about how bridging works in React Native, we highly suggest you take a look at the resources that Facebook has provided <a href="https://facebook.github.io/react-native/docs/native-modules-ios.html">here for iOS</a> or <a href="https://facebook.github.io/react-native/docs/native-modules-android.html">here for Android</a>.
The sample app is an excellent resource to familiarize yourself with the basic functionality of both React Native Native Modules and our bridged SDK.

Please note that all functionality provided here is still in beta. If you have any questions, comments, or suggestions, we'd love to hear from you.

