import React from 'react';
import { View, ActionSheetIOS, Alert } from 'react-native';
import { connect } from 'react-redux';
import NeuraSDK from '../Lib/NeuraSDKManager';
// Add Actions - replace 'Your' with whatever your reducer is called :)
// import YourActions from '../Redux/YourRedux'
// import { Metrics } from '../Themes';
import RoundedButton from '../Components/RoundedButton';
import UserCapabilitiesPicker from '../Components/UserCapabilitiesPicker';
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
    this.state = {
      actionSheetOptions: ['Show all', 'Add by capability', 'Add by device name', 'Cancel'],
      showPicker: false,
    };
    this.showAddDeviceActionSheet = this.showAddDeviceActionSheet.bind(this);
    this.hidePicker = this.hidePicker.bind(this);
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
    NeuraSDK.addDeviceWithCapability(capabilityName, deviceName, (response, error) => {
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


  hidePicker() {
    this.setState({
      showPicker: false,
    });
  }

  showPicker() {
    this.setState({
      showPicker: true,
    });
  }

  render() {
    return (
      <View style={{ marginTop: 80 }}>
        <RoundedButton onPress={NavigationActions.capabilitiesList}>
          Get All Capabilities
        </RoundedButton>
        <RoundedButton
          onPress={this.showPicker.bind(this)}
        >
          Check User&#39;s Capabilities
        </RoundedButton>
        <RoundedButton onPress={NavigationActions.devicesList}>
          Get All Devices
        </RoundedButton>
        <RoundedButton onPress={this.showAddDeviceActionSheet}>
          Add a Device
        </RoundedButton>

        {this.state.showPicker
          ? <UserCapabilitiesPicker
            hidePicker={this.hidePicker}
          />
        : null}

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
