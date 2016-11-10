import { NativeModules, Platform } from 'react-native';

const neuraSDKBridge = Platform.os === 'ios' ? NativeModules.NeuraSDKManager : NativeModules.NeuraSDKManagerAndroid;

if (Platform.os !== 'ios') {
  neuraSDKBridge.initConnection();
}

export default neuraSDKBridge;
