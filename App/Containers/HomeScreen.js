import React from 'react';

import {
  Text,
  KeyboardAvoidingView,
  Animated,
  View,
  Easing,
  Alert,
  Image,
  NativeModules,
} from 'react-native';
import { connect } from 'react-redux';
import RoundedButton from '../Components/RoundedButton';
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
    this.slideValue = new Animated.Value(0);
    this.loginButtonPressed = this.loginButtonPressed.bind(this);
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

  slideBack() {
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

  loginButtonPressed() {
    const neuraSDKManager = NativeModules.NeuraSDKReact;

    if (this.state.loggedIn === false) {
      neuraSDKManager.authenticateWithPermissions((token, error) => {
        if (error === null) {
          this.slideForward();
          this.setState({
            loggedIn: true,
          });
        } else {
          console.warn('there was an error', error);
        }
      });
    } else {
      console.warn('logging out');
      this.setState({
        loggedIn: false,
      });
    }
  }

  userNotLoggedIn() {
    Alert.alert(
    'Error',
    'You must be logged in to access this functionality.',
      [
        { text: 'OK', onPress: () => console.warn('OK Pressed') },
      ]
  );
  }
  approvedPermissionsList() {
    console.log('approvedPermissionsList');
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
          <RoundedButton onPress={this.loginButtonPressed}>
            Connect and Request Permissions
          </RoundedButton>
          <RoundedButton onPress={this.state.loggedIn ? this.approvedPermissionsList : this.userNotLoggedIn}>
            Approved Permissions List
          </RoundedButton>
          {this.state.loggedIn ?
            <RoundedButton onPress={NavigationActions.permissionsList}>
              Edit Subscriptions
            </RoundedButton>
            : <RoundedButton onPress={NavigationActions.permissionsList}>
              Permissions List
            </RoundedButton>
          }

          <RoundedButton onPress={this.state.loggedIn ? NavigationActions.permissionsList : this.userNotLoggedIn}>
            Devices
          </RoundedButton>
          <RoundedButton onPress={NavigationActions.componentExamples}>
            Send Log
          </RoundedButton>
        </KeyboardAvoidingView>
      </View>
    );
  }
}

const mapStateToProps = (state) => {
  return {
  };
};

const mapDispatchToProps = (dispatch) => {
  return {
  };
};

export default connect(mapStateToProps, mapDispatchToProps)(HomeScreen);
