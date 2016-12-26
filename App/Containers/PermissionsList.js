import React from 'react';
import { ScrollView, Text, KeyboardAvoidingView, ListView, View, Alert } from 'react-native';

import NeuraSDKManager from '../Lib/NeuraSDKManager';
// Add Actions - replace 'Your' with whatever your reducer is called :)
// import YourActions from '../Redux/YourRedux'
// import { Metrics } from '../Themes';
// external libs
// import Icon from 'react-native-vector-icons/FontAwesome';

// Styles
import styles from './Styles/PermissionsListStyle';


class PermissionsList extends React.Component {
  constructor() {
    super();
    this.ds = new ListView.DataSource({ rowHasChanged: (r1, r2) => r1 !== r2 });
    this.state = {
      dataSource: this.ds.cloneWithRows([]),
    };
    this.getPermissions();
  }
  getPermissions() {
    NeuraSDKManager.getAppPermissions((permissionsArray, permissionsError) => {
      if (permissionsError !== null) {
        Alert.alert(
          'Error',
          'There was an error fetching data in getPermissions',
          [
            { text: 'OK', onPress: () => null },
          ]
        );
        return;
      }

      const permissionNames = permissionsArray.map((permission) => permission.name);
      // Finally, set a new data source for the table to update the switches
      this.setState({
        dataSource: this.ds.cloneWithRows(permissionNames),
      });
    });
  }


  render() {
    return (
      <View style={styles.container}>
        <Text>This app is allowed to request the following permissions:</Text>
        <ScrollView className={styles.container}>
          <KeyboardAvoidingView behavior="position">
            <ListView
              contentContainerStyle={styles.listContent}
              dataSource={this.state.dataSource}
              renderRow={(rowData) => <View style={styles.row}><Text style={styles.label}>{rowData}</Text></View>}
              enableEmptySections
            >
            </ListView>
          </KeyboardAvoidingView>
        </ScrollView>
      </View>
    );
  }
}

export default PermissionsList;
