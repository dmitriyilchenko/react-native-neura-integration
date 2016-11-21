import React, { PropTypes } from 'react';
import { View, Text, ListView, NativeModules, Alert } from 'react-native';
import NeuraSDKManager from '../Lib/NeuraSDKManager';

import AlertMessage from '../Components/AlertMessage';

// Styles
import styles from './Styles/CapabilitiesListStyle';

class CapabilitiesList extends React.Component {

  constructor(props) {
    super(props);
    const dataObjects = [];
    const rowHasChanged = (r1, r2) => (r1 !== r2);

    // DataSource configured
    this.ds = new ListView.DataSource({ rowHasChanged });

    // Datasource is always in state
    this.state = {
      dataSource: this.ds.cloneWithRows(dataObjects),
    };
    this.fetchCapabilities();
  }

  noRowData() {
    return this.state.dataSource.getRowCount() === 0;
  }


  fetchCapabilities() {
    NeuraSDKManager.getKnownCapabilities((capabilitiesDict, error) => {
      if (error) {
        Alert.alert(
          'Error',
          'There was an error fetching data in fetchDevices.',
          [
            { text: 'OK', onPress: () => null },
          ]
        );
        return;
      }
      const capabilityNames = capabilitiesDict.map((capability) => {
        return capability.displayName;
      });
      this.setState({
        dataSource: this.ds.cloneWithRows(capabilityNames),
      });
    });
  }

  renderRow(rowData) {
    return (
      <View style={styles.row}>
        <Text style={styles.boldLabel}>{rowData}</Text>
      </View>
    );
  }

  // Render a footer.
  renderFooter = () => {
    return (
      <Text> - Footer - </Text>
    );
  }

  render() {
    return (
      <View style={styles.container}>
        <AlertMessage title="Loading data" show={this.noRowData()} />
        <ListView
          contentContainerStyle={styles.listContent}
          dataSource={this.state.dataSource}
          renderRow={this.renderRow}
          enableEmptySections
        />
      </View>
    );
  }
}

export default CapabilitiesList;
