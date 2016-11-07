import React from 'react';
import { View, Text, PickerIOS, NativeModules, Alert } from 'react-native';
import styles from './Styles/UserCapabilitiesPickerStyle';

const PickerItemIOS = PickerIOS.Item;

export default class UserCapabilitiesPicker extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      capabilities: [],
      capabilityIndex: null,
    };
    this.neuraSDKManager = NativeModules.NeuraSDKReact;
    this.getSupportedCapabilities();
  }

  getSupportedCapabilities() {
    this.neuraSDKManager.getSupportedCapabilitiesListWithHandler((capabilitiesArray, error) => {
      if (error) {
        Alert.alert(
          'Error',
          'There was an error fetching data in getSubscriptions.',
          [
            { text: 'OK', onPress: () => console.warn('OK Pressed') },
          ]
        );
        return;
      }
      this.setState({
        capabilities: capabilitiesArray,
      });
    });
  }

  checkCapability(capability) {
    this.neuraSDKManager.hasDeviceWithCapability(capability, (capabilityResponse, error) => {
      if (error) {
        Alert.alert(
          'Error',
          'There was an error fetching data in getSubscriptions.',
          [
            { text: 'OK', onPress: () => console.warn('OK Pressed') },
          ]
        );
        return;
      }
      debugger;
      Alert.alert(
        'Alert',
        'The user has some capability.',
        [
          { text: 'OK', onPress: () => console.warn('OK Pressed') },
        ]
      );
    });
  }

  render() {
    return (
      <View style={styles.container}>
        <Text>UserCapabilitiesPicker Component</Text>
        <PickerIOS
          selectedValue={this.state.capabilityIndex}
          key={this.state.capability}
          onValueChange={this.checkCapability}>
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

// // Prop type warnings
// UserCapabilitiesPicker.propTypes = {
//   someProperty: React.PropTypes.object,
//   someSetting: React.PropTypes.bool.isRequired
// }
//
// // Defaults for props
// UserCapabilitiesPicker.defaultProps = {
//   someSetting: false
// }
