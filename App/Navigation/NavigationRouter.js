import React, { Component } from 'react';
import { Scene, Router } from 'react-native-router-flux';
import Styles from './Styles/NavigationContainerStyle';


// screens identified by the router

// No maps by default for now
// import MapviewExample from '../Containers/MapviewExample'

import HomeScreen from '../Containers/HomeScreen';
import PermissionsList from '../Containers/PermissionsList';
import SubscriptionsList from '../Containers/SubscriptionsListScreen';
import DevicesScreen from '../Containers/DevicesScreen';
import CapabilitiesList from '../Containers/CapabilitiesList';
import DevicesList from '../Containers/DevicesList';

/* **************************
* Documentation: https://github.com/aksonov/react-native-router-flux
***************************/

class NavigationRouter extends Component {
  render() {
    return (
      <Router>
        <Scene key="drawerChildrenWrapper" navigationBarStyle={Styles.navBar} titleStyle={Styles.title}>
          <Scene key="homeScreen" component={HomeScreen} title="Home Screen" />
          <Scene key="permissionsList" component={PermissionsList} title="Permissions List" />
          <Scene key="subscriptionsList" component={SubscriptionsList} title="Subscriptions List" />
          <Scene key="devicesScreen" component={DevicesScreen} title="Devices" />
          <Scene key="capabilitiesList" component={CapabilitiesList} title="Capabilities List" />
          <Scene key="devicesList" component={DevicesList} title="Devices List" />
        </Scene>
      </Router>
    );
  }
}

export default NavigationRouter;
