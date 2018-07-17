import React, { Component } from 'react';
// import { element } from 'prop-types';
import { View, Button, Text } from 'react-native';
import Neura from 'react_native_sample_app';
import { styles } from './index';

class Container extends Component {
  constructor(props) {
    super(props);
    this.state = {
      isAuth: 'Unkown',
      accessToken: 'Unknown',
      successfulSubsctiption: 'Unknown',
      successfulSimulation: 'Unknown',
      attemptTagging: 'Unknown',
      featureTagging: 'Unknown',
    };
    this.isAuthenticated = this.isAuthenticated.bind(this);
    this.authenticate = this.authenticate.bind(this);
    this.logOut = this.logOut.bind(this);
    this.subscribe = this.subscribe.bind(this);
    this.simulateEvent = this.simulateEvent.bind(this);
    this.tagEngagementAttempt = this.tagEngagementAttempt.bind(this);
    this.tagEngagementFeature = this.tagEngagementFeature.bind(this);
  }

  isAuthenticated() {
    Neura.isAuthenticated().then(function(result){
      console.log(result);
      this.setState({ isAuth: result });
    }.bind(this)).catch(err => console.log(err));
  }

  authenticate() {
    Neura.authenticate().then(function(token){
      console.log(token);
      this.setState({ accessToken: token});
    }.bind(this)).catch(err => console.log(err));
  }

  logOut() {
    Neura.logOut().then(function(result){
      console.log(result);
      this.setState({ isAuth: !result });
    }.bind(this)).catch(err => console.log(err));
  }

  subscribe() {
    Neura.addWebhookSubsciption('userLeftHome', '_userLeftHome', 'rn-sample-webhook-id').then(function(result){
      console.log(result);
      this.setState({ successfulSubsctiption: result});
    }.bind(this)).catch(function(err){
      this.setState({ successfulSubsctiption: false});
      console.log(err);
    }.bind(this));
  }

  simulateEvent() {
    Neura.simulateEvent('userLeftHome').then(function(result){
      console.log(result);
      this.setState({ successfulSimulation: result});
    }.bind(this)).catch(err => console.log(err));
  }

  tagEngagementAttempt() {
    Neura.tagEngagementAttempt('UpgradeToPremium', null, null).then(function(result){
      console.log(result);
      this.setState({ attemptTagging: result});
    }.bind(this)).catch(function(err){
      this.setState({ attemptTagging: false});
      console.log(err);
    }.bind(this));
  }

  tagEngagementFeature() {
    Neura.tagEngagementFeature('UpgradeOffer', 'FeatureActionSuccess', null, null).then(function(result){
      console.log(result);
      this.setState({ featureTagging: result});
    }.bind(this)).catch(function(err){
      this.setState({ featureTagging: false});
      console.log(err);
    }.bind(this));
  }

  render() {
    return(
      <View style = {styles.container}>
        <Button onPress={this.isAuthenticated} title="Check Auth State" color="#147eff" />
        <Text>Is Authenticated: {this.state.isAuth.toString()}</Text>
        <Button onPress={this.authenticate} title="Authenticate" color="#147eff" />
        <Text>Token: {this.state.accessToken.toString()}</Text> 
        <Button onPress={this.subscribe} title="Subscribe to Event" color="#147eff" />
        <Text>Subscribed successfully: {this.state.successfulSubsctiption.toString()}</Text>
        <Button onPress={this.simulateEvent} title="Simulate Event" color="#147eff" />
        <Text>Simulation sent successfuly: {this.state.successfulSimulation.toString()}</Text>
        <Button onPress={this.tagEngagementAttempt} title="Tag Engagement Attempt" color="#147eff" />
        <Text>Tag sent successfully: {this.state.attemptTagging.toString()}</Text>
        <Button onPress={this.tagEngagementFeature} title="Tag Engagement Feature" color="#147eff" />
        <Text>Tag sent successfully: {this.state.featureTagging.toString()}</Text>
        <Button onPress={this.logOut} title="Log Out" color="#147eff" />
      </View>
    )  
  }
}

export default Container;
