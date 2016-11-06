import React from 'react';
import {
  Text,
  View,
  NativeModules,
  Alert,
  ListView,
  Switch,
} from 'react-native';
import { connect } from 'react-redux';
// Add Actions - replace 'Your' with whatever your reducer is called :)
// import YourActions from '../Redux/YourRedux'

import { Actions as NavigationActions } from 'react-native-router-flux';

// Styles
import styles from './Styles/SubscriptionsListViewStyle';

class SubscriptionsListScreen extends React.Component {
  constructor(props) {
    super(props);
    const ds = new ListView.DataSource({ rowHasChanged: (r1, r2) => r1 !== r2 });
    this.state = {
      dataSource: ds.cloneWithRows([]),
    };
    this.subscriptionsArray = null;
    this.neuraSDKManager = NativeModules.NeuraSDKReact;
    this.getSubscriptions();
    this.subscribeToEvent.bind(this);
    this.renderRow = this.renderRow.bind(this);
  }

  getSubscriptions() {
    const neuraSDKManager = this.neuraSDKManager;

    neuraSDKManager.getSubscriptions((subscriptionsArray, subscriptionsError) => {
      if (subscriptionsError !== null) {
        Alert.alert(
          'Error',
          'There was an error fetching data in getSubscriptions.',
          [
            { text: 'OK', onPress: () => console.warn('OK Pressed') },
          ]
        );
        return;
      }
      neuraSDKManager.getPermissions((permissionsArray, permissionsError) => {
        if (permissionsError !== null) {
          Alert.alert(
            'Error',
            'There was an error fetching data in getPermissions',
            [
              { text: 'OK', onPress: () => console.warn('OK Pressed') },
            ]
          );
          return;
        }
        const subscribedArray = permissionsArray.map((permission) => {
          const subscribedBool = subscriptionsArray.indexOf(permission.name) !== -1;
          return { permission: permission.name, subscribed: subscribedBool };
        });
        this.subscriptionsArray = subscribedArray;
        this.setState({
          dataSource: this.state.dataSource.cloneWithRows(subscribedArray),
        });
      });
    });
  }

  displayError(error) {
    Alert.alert(
      'Error',
      error,
      [
        { text: 'Ok', onPress: null },
      ]
    );
  }

  subscribeToEvent(permission) {
    this.neuraSDKManager.subscribeToEvent(permission, (responseData, error) => {
      if (error) {
        this.displayError(error);
      } else {
        const index = this.subscriptionsArray.findIndex((item) => item.permission === permission);

        this.subscriptionsArray[index].subscribed = true;
        this.setState({
          dataSource: this.state.dataSource.cloneWithRows(this.subscriptionsArray),
        });
      }
    });
  }

  switchChanged(permission, value) {
    const neuraSDKManager = this.neuraSDKManager;

    if (value) {
      neuraSDKManager.isMissingDataForEvent(permission, ((missingData) => {
        if (missingData) {
          Alert.alert(
            'Alert',
            'The place has not been set yet. Create it now?',
            [
              {
                text: 'Yes',
                onPress: () => neuraSDKManager.getMissingDataForEvent(permission, (responseData, error) => {
                  if (error) {
                    this.displayError();
                  }
                }),
              },
              { text: 'I will wait', onPress: () => this.subscribeToEvent(permission) },
            ]
          );
        } else {
          this.subscribeToEvent(permission);
        }
      }));
    } else {
      self.removeSubscriptionWithIdentifier('_', permission);
    }
  }

  renderRow(rowData) {
    return (
      <View style={styles.row}>
        <Text style={styles.boldLabel}>{rowData.permission}</Text>
        <Switch
          value={rowData.subscribed}
          onValueChange={this.switchChanged.bind(this, rowData.permission)} // eslint-disable-line react/jsx-no-bind
        >
        </Switch>
      </View>
    );
  }

  render() {
    return (
      <View style={styles.container}>
        <ListView
          contentContainerStyle={styles.listContent}
          dataSource={this.state.dataSource}
          renderRow={this.renderRow}
          pageSize={15}
        />
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

export default connect(mapStateToProps, mapDispatchToProps)(SubscriptionsListScreen);
