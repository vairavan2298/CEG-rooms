import React, { Component } from 'react';
import { StyleSheet, View, Text, Animated, AsyncStorage, YellowBox } from 'react-native';
import { createAppContainer, StackActions, NavigationActions } from 'react-navigation';
import { createStackNavigator } from 'react-navigation-stack';
import Home from './components/home';
import Login from './components/login';
import Register from './components/register';
import auth from '@react-native-firebase/auth';
class App extends Component {
  static navigationOptions = {
    headerShown: false
  }
  constructor () {
    super()
    this.springValue = new Animated.Value(0.5)
    YellowBox.ignoreWarnings([
      'Warning'
    ])
  }
  startAnimation = () => {
    this.springValue.setValue(0.3)
    Animated.spring(
      this.springValue,
      {
        toValue: 1,
        friction: 1
      }
    ).start()
  }
  componentDidMount = () => {
     this.startAnimation()
    setTimeout(() => {
      AsyncStorage.getItem('token').then(token => {
        if (token == null && token == undefined) {
          this.props.navigation.dispatch(StackActions.reset({
            index: 0,
            actions: [
              NavigationActions.navigate({ routeName: 'login' })
            ]
          }))
         
        } else if (token.length > 1 && token === auth().currentUser.uid) {
          this.props.navigation.dispatch(StackActions.reset({
            index: 0,
            actions: [
              NavigationActions.navigate({ routeName: 'home' })
            ]
          }))
        }
      })
     
    }, 1500)
  }
  render() {
    return (
      <View style={styles.container}>
        <Animated.Text style={{fontSize: 50, color: 'white', fontFamily: 'Nexa-Bold', transform: [{scale: this.springValue}] }}>MAD</Animated.Text>
      </View>
    )
  }
}
const AppNavigator = createStackNavigator({
  app: App,
  home: {
    screen: Home,
    navigationOptions: {
      headerShown: false
   },
   
  },
  register: Register,
  login: Login
})
export default createAppContainer(AppNavigator)
const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#23bcc4',
    alignItems: 'center',
    justifyContent: 'center'
  }
})
