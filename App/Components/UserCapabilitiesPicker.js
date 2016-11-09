import React from 'react';
import { View, Text, PickerIOS, NativeModules, Alert, TouchableOpacity } from 'react-native';
import styles from './Styles/UserCapabilitiesPickerStyle';

const PickerItemIOS = PickerIOS.Item;

export default class UserCapabilitiesPicker extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      capabilities: [],
      chosenCapability: null,
    };
    this.neuraSDKManager = NativeModules.NeuraSDKReact;
    this.getSupportedCapabilities();
    this.checkCapability = this.checkCapability.bind(this);
  }

  getSupportedCapabilities() {
    this.neuraSDKManager.getSupportedCapabilities((capabilitiesArray, error) => {
      if (error) {
        Alert.alert(
          'Error',
          'There was an error fetching data in getSubscriptions.',
          [
            { text: 'OK', onPress: () => null },
          ]
        );
        return;
      }
      this.setState({
        capabilities: capabilitiesArray,
      });
    });
  }

  checkCapability() {
    const chosenCapability = this.state.chosenCapability;
    this.neuraSDKManager.hasDeviceWithCapability(chosenCapability, (capabilityResponse, error) => {
      if (error) {
        Alert.alert(
          'Error',
          'There was an error fetching data.',
          [
            { text: 'OK', onPress: () => null },
          ]
        );
        return;
      }
      const responseText = capabilityResponse.status === 'NO' ? ("User does not have " + chosenCapability) : ("User has " + chosenCapability);
      Alert.alert(
        'Alert',
        responseText,
        [
          { text: 'OK', onPress: () => null },
        ]
      );
    });
    this.props.hidePicker();
  }

  render() {
    return (
      <View>
        <View style={{ flexDirection: 'row', justifyContent: 'space-between', margin: 20 }}>
          <TouchableOpacity onPress={this.props.hidePicker}>
            <Text style={{ color: '#00ccff' }}>Cancel</Text>
          </TouchableOpacity>
          <TouchableOpacity onPress={this.checkCapability}>
            <Text style={{ color: '#00ccff' }}>Check</Text>
          </TouchableOpacity>
        </View>
        <PickerIOS
          selectedValue={this.state.chosenCapability}
          key={this.state.capability}
          onValueChange={(chosenCapability) => this.setState({ chosenCapability })}
        >
          {this.state.capabilities.map((capability) => (
            <PickerItemIOS
              key={capability}
              value={capability}
              label={capability}
            />
          ))}
        </PickerIOS>
      </View>
    );
  }
}

UserCapabilitiesPicker.propTypes = {
  hidePicker: React.PropTypes.func,
};
