import React from 'react'
import { ScrollView, Text, KeyboardAvoidingView, Animated, Image, View, Easing } from 'react-native'
import { connect } from 'react-redux'
import RoundedButton from '../Components/RoundedButton'
// Add Actions - replace 'Your' with whatever your reducer is called :)
// import YourActions from '../Redux/YourRedux'
import { Metrics } from '../Themes'
// external libs
import Icon from 'react-native-vector-icons/FontAwesome'
import Animatable from 'react-native-animatable'
import { Actions as NavigationActions } from 'react-native-router-flux'
import { Images } from '../Themes'

// Styles
import styles from './Styles/HomeScreenStyle'

class HomeScreen extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      loggedIn: false,
    };

    this.slideValue = new Animated.Value(0)

    this.loginButtonPressed = this.loginButtonPressed.bind(this);
  }

  componentDidMount() {
    this.slide()
  }

  get slideLeft() {
    return this.slideValue.interpolate({
      inputRange: [0, 1],
      outputRange: [0, -50],
    });
  }

  get slideRight() {
    return this.slideValue.interpolate({
      inputRange: [0, 1],
      outputRange: [0, 50],
    });
  }

  slide () {
    this.slideValue.setValue(0)
    Animated.timing(
      this.slideValue,
      {
        toValue: 1,
        duration: 1000,
        easing: Easing.linear
      }
    ).start()
  }

  loginButtonPressed () {
    this.state.loggedIn = !this.state.loggedIn;
    console.log(this.state.loggedIn);
  }

  render () {
    return (
      <View
        style={{
          marginTop: 50
        }}
      >
        <KeyboardAvoidingView behavior='position'>
          <Text>HomeScreen Container</Text>
        </KeyboardAvoidingView>
        <View style={styles.centered}>
          <Animated.Image
            source={Images.neuraSymbolTopElement}
            className={styles.logo}
            style={{
              marginLeft: this.slideLeft,
            }}
          />
          <Animated.Image
            source={Images.neuraSymbolBottomElement}
            className={styles.logo}
            style={{
              marginLeft: this.slideRight,
            }}
          />
        </View>
        <RoundedButton onPress={this.loginButtonPressed}>
          Connect and Request Permissions
        </RoundedButton>
        <RoundedButton onPress={NavigationActions.componentExamples}>
          Approved Permissions
        </RoundedButton>
        <RoundedButton onPress={NavigationActions.componentExamples}>
          Permissions List
        </RoundedButton>
        <RoundedButton onPress={NavigationActions.componentExamples}>
          Devices
        </RoundedButton>
        <RoundedButton onPress={NavigationActions.componentExamples}>
          Send Log
        </RoundedButton>
      </View>
    )
  }
}

const mapStateToProps = (state) => {
  return {
  }
}

const mapDispatchToProps = (dispatch) => {
  return {
  }
}

export default connect(mapStateToProps, mapDispatchToProps)(HomeScreen)
