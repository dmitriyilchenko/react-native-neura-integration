import React from 'react';
import {
  Text,
  View,
  Alert,
  ListView,
  Switch,
} from 'react-native';
import NeuraSDKManager from '../Lib/NeuraSDKManager';

// Styles
import styles from './Styles/SubscriptionsListViewStyle';

class SubscriptionsListScreen extends React.Component {
  constructor(props) {
    super(props);
    this.ds = new ListView.DataSource({ rowHasChanged: (r1, r2) => r1 !== r2 });
    this.state = {
      dataSource: this.ds.cloneWithRows([]),
    };
    this.subscriptionsArray = null;
    this.getSubscriptions();
    this.subscribeToEvent.bind(this);
    this.renderRow = this.renderRow.bind(this);
  }

  getSubscriptions() {
    NeuraSDKManager.getSubscriptions((subscriptionsArray, subscriptionsError) => {
      if (subscriptionsError !== null) {
        Alert.alert(
          'Error',
          'There was an error fetching data in getSubscriptions.',
          [
            { text: 'OK', onPress: () => null },
          ]
        );
        return;
      }
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
        // Get the permissions and subscriptions names into an array so we can figure out what subscriptions the user has
        const subscriptionNames = subscriptionsArray.map((subscription) => {
          return subscription.eventName;
        });
        const permissionNames = permissionsArray.map((permission) => {
          return permission.name;
        });
        // Loop through the permissiosn and see if each one is also in subscriptions
        const subscriptions = [];
        for (const permission of permissionNames) {
          subscriptions.push({
            eventName: permission,
            subscribed: (subscriptionNames.indexOf(permission) !== -1),
          });
        }
        // We have to keep a subscriptions array for subscribing and unsubscribing to events
        this.subscriptionsArray = subscriptions;
        // Finally, set a new data source for the table to update the switches
        this.setState({
          dataSource: this.ds.cloneWithRows(subscriptions),
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

  subscribeToEvent(eventName) {
    NeuraSDKManager.subscribeToEvent(eventName, (responseData, error) => {
      if (error) {
        this.displayError(error);
        const index = this.subscriptionsArray.findIndex((item) => item.eventName === eventName);
        // If error, reset the boolean to false
        this.subscriptionsArray[index].subscribed = false;
        this.setState({
          dataSource: this.ds.cloneWithRows(this.subscriptionsArray),
        });
      }
    });
  }

  removeSubscription(eventName) {
    NeuraSDKManager.removeSubscription(eventName, (responseData, error) => {
      if (error) {
        this.displayError(error);
        // If error, reset the bool to be true
        const index = this.subscriptionsArray.findIndex((item) => item.eventName === eventName);
        this.subscriptionsArray[index].subscribed = true;
        this.setState({
          dataSource: this.ds.cloneWithRows(this.subscriptionsArray),
        });
      }
    });
  }

  switchChanged(eventName, value) {
    if (value) {
      NeuraSDKManager.isMissingDataForEvent(eventName, ((missingData) => {
        const index = this.subscriptionsArray.findIndex((item) => item.eventName === eventName);
        this.subscriptionsArray[index].subscribed = true;
        this.setState({
          dataSource: this.ds.cloneWithRows(this.subscriptionsArray),
        });
        if (missingData) {
          Alert.alert(
            'Alert',
            'The place has not been set yet. Create it now?',
            [
              {
                text: 'Yes',
                onPress: () => NeuraSDKManager.getMissingDataForEvent(eventName, (responseData, error) => {
                  if (error) {
                    this.displayError();
                  }
                }),
              },
              { text: 'I will wait', onPress: () => this.subscribeToEvent(eventName) },
            ]
          );
        } else {
          this.subscribeToEvent(eventName);
        }
      }));
    } else {
      const index = this.subscriptionsArray.findIndex((item) => item.eventName === eventName);
        // If successful, switch the boolean to false
      this.subscriptionsArray[index].subscribed = false;
      this.setState({
        dataSource: this.ds.cloneWithRows(this.subscriptionsArray),
      });
      this.removeSubscription(eventName);
    }
  }

  renderRow(rowData) {
    return (
      <View style={styles.row}>
        <Text style={styles.boldLabel}>{rowData.eventName}</Text>
        <Switch
          value={rowData.subscribed}
          onValueChange={this.switchChanged.bind(this, rowData.eventName)} // eslint-disable-line react/jsx-no-bind
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
          enableEmptySections
          pageSize={15}
        />
      </View>
    );
  }
}

export default SubscriptionsListScreen;
