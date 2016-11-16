import { NativeModules, Platform } from 'react-native';
const NeuraSDKManager = Platform.OS === 'android' ? NativeModules.NeuraSDKManagerAndroid : NativeModules.NeuraSDKManageriOS;

if (Platform.OS === 'android') {
  NeuraSDKManager.initConnection();
}

export default NeuraSDKManager;
