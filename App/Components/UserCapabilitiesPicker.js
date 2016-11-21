import React from 'react';
import { View, Text, Picker, Alert, TouchableOpacity, Platform } from 'react-native';
import NeuraSDKManager from '../Lib/NeuraSDKManager';
// import styles from './Styles/UserCapabilitiesPickerStyle';

const Item = Picker.Item;

export default class UserCapabilitiesPicker extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      capabilities: [],
      chosenCapability: null,
    };

    this.getKnownCapabilities();
    this.checkCapability = this.checkCapability.bind(this);
  }

  getKnownCapabilities() {
    NeuraSDKManager.getKnownCapabilities((capabilitiesResponse, error) => {
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
        capabilities: capabilitiesResponse,
        chosenCapability: capabilitiesResponse[0].name,
      });
    });
  }

  checkCapability() {
    const chosenCapability = this.state.chosenCapability;
    NeuraSDKManager.hasDeviceWithCapability(chosenCapability, (capabilityResponse, error) => {
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

      let responseText = '';
      if (Platform.OS === 'android') {
        responseText = capabilityResponse === false ? ("User does not have " + chosenCapability) : ("User has " + chosenCapability);
      } else {
        responseText = capabilityResponse.status === 'NO' ? ("User does not have " + chosenCapability) : ("User has " + chosenCapability);
      }

      Alert.alert(
        'Response',
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
        <Picker
          selectedValue={this.state.chosenCapability}
          key={this.state.chosenCapability}
          onValueChange={(itemPosition) => this.setState({ this.state.capabilities[itemPosition].name })}
        >
          {this.state.capabilities.map((capability) => (
            <Item
              value={capability.name}
              label={capability.displayName}
              key={capability.name}
            />
          ))}
        </Picker>
      </View>
    );
  }
}

UserCapabilitiesPicker.propTypes = {
  hidePicker: React.PropTypes.func,
};
