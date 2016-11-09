import { NativeModules, Platform } from 'react-native';

// const neuraSDKBridge = Platform.os === 'ios' ? NativeModules.NeuraSDKManager : NativeModules.NeuraSDKManagerAndroid;

const neuraSDKBridge = NativeModules.NeuraSDKManagerAndroid;
neuraSDKBridge.initConnection();
// if (Platform.os === 'android') {
//   neuraSDKBridge.initConnection();
// }

export default neuraSDKBridge;
