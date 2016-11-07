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

// import { Actions as NavigationActions } from 'react-native-router-flux';

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
    this.neuraSDKManager = NativeModules.NeuraSDKReact;
    this.getSubscriptions();
    this.subscribeToEvent.bind(this);
    this.renderRow = this.renderRow.bind(this);
  }

  getSubscriptions() {
    this.neuraSDKManager.getSubscriptions((subscriptionsArray, subscriptionsError) => {
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
      this.neuraSDKManager.getPermissions((permissionsArray, permissionsError) => {
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
    this.neuraSDKManager.subscribeToEvent(eventName, (responseData, error) => {
      if (error) {
        this.displayError(error);
      } else {
        const index = this.subscriptionsArray.findIndex((item) => item.eventName === eventName);
        // If successful, switch the boolean to true
        this.subscriptionsArray[index].subscribed = true;
        // Update datasource
        this.setState({
          dataSource: this.ds.cloneWithRows(this.subscriptionsArray),
        });
      }
    });
  }

  removeSubscription(eventName) {
    this.neuraSDKManager.removeSubscriptionWithIdentifier(eventName, (responseData, error) => {
      if (error) {
        this.displayError(error);
      } else {
        const index = this.subscriptionsArray.findIndex((item) => item.eventName === eventName);
        // If successful, switch the boolean to false
        this.subscriptionsArray[index].subscribed = false;
        // Update datasource
        this.setState({
          dataSource: this.ds.cloneWithRows(this.subscriptionsArray),
        });
      }
    });
  }

  switchChanged(eventName, value) {
    const neuraSDKManager = this.neuraSDKManager;

    if (value) {
      neuraSDKManager.isMissingDataForEvent(eventName, ((missingData) => {
        if (missingData) {
          Alert.alert(
            'Alert',
            'The place has not been set yet. Create it now?',
            [
              {
                text: 'Yes',
                onPress: () => neuraSDKManager.getMissingDataForEvent(eventName, (responseData, error) => {
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

const mapStateToProps = (state) => {
  return {
  };
};

const mapDispatchToProps = (dispatch) => {
  return {
  };
};

export default connect(mapStateToProps, mapDispatchToProps)(SubscriptionsListScreen);
