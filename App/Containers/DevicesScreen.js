import React from 'react';
import { View, Alert } from 'react-native';

import NeuraSDKManager from '../Lib/NeuraSDKManager';
import RoundedButton from '../Components/RoundedButton';
import UserCapabilitiesPicker from '../Components/UserCapabilitiesPicker';

import { Actions as NavigationActions } from 'react-native-router-flux';

// Styles
// import styles from './Styles/DevicesScreenStyle';

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
    let capabilityNames = [];
    let deviceName = '';
    switch (buttonIndex) {
      case 0:
        NeuraSDKManager.addDevice((response, error) => {
          if (error) {
            Alert.alert(
              'Error',
              'There was an error adding a device.',
              [
                { text: 'OK', onPress: () => null },
              ]
            );
          }
        });
        break;
      case 1:
        capabilityNames = ['sleepQuality'];
        NeuraSDKManager.addDeviceByCapability(capabilityNames, (response, error) => {
          if (error) {
            Alert.alert(
              'Error',
              'There was an error adding a device.',
              [
                { text: 'OK', onPress: () => null },
              ]
            );
          }
        });
        break;
      case 2:
        deviceName = 'Fitbit Charge';
        NeuraSDKManager.addDeviceByName(deviceName, (response, error) => {
          if (error) {
            Alert.alert(
              'Error',
              'There was an error adding a device.',
              [
                { text: 'OK', onPress: () => null },
              ]
            );
          }
        });
        break;
      default:
        return;
    }
  }

  showAddDeviceActionSheet() {
    Alert.alert(
      'Ådd Device',
      null,
      [
        { text: 'show all', onPress: () => this.addDevice(0) },
        { text: 'by capability', onPress: () => this.addDevice(1) },
        { text: 'by name', onPress: () => this.addDevice(2) },
      ]
    );
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

export default DevicesScreen;
