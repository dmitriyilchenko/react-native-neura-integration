import React from 'react';
import { View, ActionSheetIOS, Alert, NativeModules } from 'react-native';
import { connect } from 'react-redux';
// Add Actions - replace 'Your' with whatever your reducer is called :)
// import YourActions from '../Redux/YourRedux'
// import { Metrics } from '../Themes';
import RoundedButton from '../Components/RoundedButton';
// external libs
// import Icon from 'react-native-vector-icons/FontAwesome';
// import Animatable from 'react-native-animatable';
import { Actions as NavigationActions } from 'react-native-router-flux';

// Styles
// import styles from './Styles/DevicesScreenStyle';

// I18n
// import I18n from 'react-native-i18n';

const BUTTONS = ['Show all', 'Add by capability', 'Add by device name', 'Cancel'];

class DevicesScreen extends React.Component {
  constructor(props) {
    super(props);
    this.CANCEL_INDEX = 3;
    this.neuraSDKManager = NativeModules.NeuraSDKReact;
    this.state = {
      actionSheetOptions: ['Show all', 'Add by capability', 'Add by device name', 'Cancel'],
    };
  }

  addDevice(buttonIndex) {
    let deviceName = '';
    let capabilityName = '';
    switch (buttonIndex) {
      case 0:
        break;
      case 1:
        capabilityName = 'sleepQuality';
        break;
      case 2:
        deviceName = 'Fitbit Charge';
        break;
      default:
        return;
    }
    this.neuraSDKManager.addDeviceWithCapability(capabilityName, deviceName, (response, error) => {
      if (error) {
        Alert.alert(
          'Error',
          'There was an error adding a device.',
          [
            { text: 'OK', onPress: () => null },
          ]
          );
        return;
      }
    });
  }

  showAddDeviceActionSheet() {
    ActionSheetIOS.showActionSheetWithOptions({
      options: BUTTONS,
      cancelButtonIndex: this.CANCEL_INDEX,
    },
    (buttonIndex) => {
      this.addDevice(buttonIndex);
    });
  }

  render() {
    return (
      <View style={{ marginTop: 80 }}>
        <RoundedButton onPress={NavigationActions.capabilitiesList}>
          Get All Capabilities
        </RoundedButton>
        <RoundedButton onPress={console.warn('users capabilities')}>
          Check User&#39;s Capabilities
        </RoundedButton>
        <RoundedButton onPress={console.warn('all devices')}>
          Get All Devices
        </RoundedButton>
        <RoundedButton onPress={this.showAddDeviceActionSheet.bind(this)}>
          Add a Device
        </RoundedButton>
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

export default connect(mapStateToProps, mapDispatchToProps)(DevicesScreen);
