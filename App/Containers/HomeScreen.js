import React from 'react';

import {
  Text,
  KeyboardAvoidingView,
  Animated,
  View,
  Easing,
  Alert,
  Image,
  Platform,
} from 'react-native';

import RoundedButton from '../Components/RoundedButton';
import NeuraSDKManager from '../Lib/NeuraSDKManager';
// Add Actions - replace 'Your' with whatever your reducer is called :)
// import YourActions from '../Redux/YourRedux'
// external libs
import { Actions as NavigationActions } from 'react-native-router-flux';
import { Images } from '../Themes';

// Styles
import styles from './Styles/HomeScreenStyle';

class HomeScreen extends React.Component {
  constructor() {
    super();
    this.state = {
      loggedIn: false,
    };
    NeuraSDKManager.isConnected(this.checkConnected.bind(this));
    this.slideValue = new Animated.Value(0);
    this.loginButtonPressed = this.loginButtonPressed.bind(this);
    this.logoutButtonPressed = this.logoutButtonPressed.bind(this);
    this.approvedPermissionsList = this.approvedPermissionsList.bind(this);
  }

  checkConnected(connected) {
    this.setState({
      loggedIn: connected,
    });
    this.state.loggedIn ? this.slideForward() : this.slideBack();
  }

  get slideLeft() {
    return this.slideValue.interpolate({
      inputRange: [0, 1],
      outputRange: [0, -50],
    });
  }

  get slideRight() {
    return this.slideValue.interpolate({
      inputRange: [0, 1],
      outputRange: [0, 50],
    });
  }

  get opacity() {
    return this.slideValue.interpolate({
      inputRange: [0, 1],
      outputRange: [1, 0.3],
    });
  }

  slideForward() {
    this.slideValue.setValue(1);
    Animated.timing(
      this.slideValue,
      {
        toValue: 0,
        duration: 1000,
        easing: Easing.easeInOut,
      }
    ).start();
  }

  slideBack() {
    this.slideValue.setValue(0);
    Animated.timing(
      this.slideValue,
      {
        toValue: 1,
        duration: 1000,
        easing: Easing.easeInOut,
      }
    ).start();
  }

  loginButtonPressed() {
    NeuraSDKManager.authenticate((token, error) => {
      if (error === null) {
        this.slideForward();
        this.setState({
          loggedIn: true,
        });
      } else {
        console.warn('There was an error', error);
      }
    });
  }

  logoutButtonPressed() {
    NeuraSDKManager.forgetMe();
    this.slideBack();
    this.setState({
      loggedIn: false,
    });
  }

  userNotLoggedIn() {
    Alert.alert(
    'Error',
    'You must be logged in to access this functionality.',
      [
        { text: 'OK', onPress: () => null },
      ]
  );
  }
  approvedPermissionsList() {
    NeuraSDKManager.openNeuraSettingsPanel();
  }

  render() {
    return (
      <View
        style={{
          marginTop: 80,
        }}
      >
        <KeyboardAvoidingView behavior="position">
          <View style={styles.centered}>
            <Image source={Images.neuraSdkDemoLogo} style={styles.sdklogo} />
            <Text style={{ marginBottom: 20 }}>React Native</Text>
            <Animated.Image
              source={Images.neuraSymbolTopElement}
              className={styles.logo}
              style={{
                marginLeft: this.slideLeft,
                opacity: this.opacity,
              }}
            />
            <Animated.Image
              source={Images.neuraSymbolBottomElement}
              className={styles.logo}
              style={{
                marginLeft: this.slideRight,
                opacity: this.opacity,
                marginBottom: 20,
              }}
            />
            <Text>
              Neura Status:
            </Text>
            {this.state.loggedIn ?
              <Text style={{ color: 'green' }}>
                Connected
              </Text>
              : <Text style={{ color: 'red' }}>
                Disconnected
              </Text>
            }
          </View>
          {
            this.state.loggedIn ?
              <RoundedButton onPress={this.logoutButtonPressed}>
                Disconnect
              </RoundedButton>
              : <RoundedButton onPress={this.loginButtonPressed}>
                Connect and Request Permissions
              </RoundedButton>
          }
          {
            Platform.OS === 'android' ? null :
            <RoundedButton onPress={this.state.loggedIn ? this.approvedPermissionsList : this.userNotLoggedIn}>
              Approved Permissions List
            </RoundedButton>
          }

          {this.state.loggedIn ?
            <RoundedButton onPress={NavigationActions.subscriptionsList}>
              Edit Subscriptions
            </RoundedButton>
            : <RoundedButton onPress={NavigationActions.permissionsList}>
              Permissions List
            </RoundedButton>
          }
          <RoundedButton onPress={this.state.loggedIn ? NavigationActions.devicesScreen : this.userNotLoggedIn}>
            Devices
          </RoundedButton>
          {Platform.OS === 'android' ?
          null
          :
          <RoundedButton onPress={NeuraSDKManager.sendLog}>
            Send Log
          </RoundedButton>
        }
        </KeyboardAvoidingView>
      </View>
    );
  }
}

export default HomeScreen;
