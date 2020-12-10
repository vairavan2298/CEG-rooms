import React, { Component } from 'react';
import { View, StyleSheet, Text, FlatList, YellowBox, ToastAndroid, ActivityIndicator, AsyncStorage, Alert, Image } from 'react-native'
import BookDetails from './bookDetails';
import { createStackNavigator } from 'react-navigation-stack';
import { createAppContainer, NavigationActions, StackActions } from 'react-navigation';
import SearchBooks from './searchBooks';
import auth from '@react-native-firebase/auth';
import { TouchableOpacity } from 'react-native-gesture-handler';
import Recommended from './recommended';
import Icon from 'react-native-vector-icons/FontAwesome5'
import { createBottomTabNavigator } from 'react-navigation-tabs';
import Account from './account';
import Wishlist from './wishlist';
import IssuedBooks from './issuedBooks';
class Home extends Component {
    static navigationOptions = ({ navigation }) => ({
        title: "Home",
        headerTintColor: "white",
        headerStyle: {
            backgroundColor: '#23bcc4',
        },
        headerTitleStyle: {
            fontFamily: "Nexa-Bold"
        },
        // headerRight: () => <Text onPress={() => {
        //     Alert.alert('Log out', 'Are you sure you want to log out?',
        //         [{ text: 'NO', style: 'cancel' },
        //         {
        //             text: 'YES', onPress: async () => {
        //                 await AsyncStorage.removeItem('token')
        //                 await navigation.dispatch(StackActions.reset({
        //                     index: 0,
        //                     actions: [
        //                         NavigationActions.navigate({ routeName: 'login' })
        //                     ]
        //                 }))
        //             }
        //         }
        //         ], { cancelable: false })

        // }} style={{ fontFamily: 'Nexa-Light', color: 'white', marginHorizontal: 10 }}>Log out</Text>
    })
    constructor() {
        super()
        this.state = {
                isSigned: false
        }
        YellowBox.ignoreWarnings([
            "'ListItem"
        ])
    }
  

    render() {
        return (
            <View style={styles.container}>
                <View style={{ flexWrap: 'wrap', flexDirection: 'row', flexBasis: '75%', marginVertical: '5%' }}>
                    <View style={{ backgroundColor: 'white', margin: 5, alignItems: 'center', padding: 15, width: '40%' }}>
                        <TouchableOpacity onPress = {() => {this.props.navigation.navigate('searchBooks')}}>
                            <Image source={require('../icons/book.png')} style={{ width: 35, height: 35, alignSelf: 'center' }} />
                            <Text style={{ fontFamily: 'Nexa-Light', marginVertical: 10 }}>Search Books</Text>
                        </TouchableOpacity>
                    </View>
                    {
                        auth().currentUser !== null ?
                            <View style={{ backgroundColor: 'white', margin: 5, alignItems: 'center', padding: 15, width: '40%' }}>
                                  <TouchableOpacity onPress = {() => {this.props.navigation.navigate('Recommended')}}>
                                    <Image source={require('../icons/badge.png')} style={{ width: 35, height: 35, alignSelf: 'center' }} />
                                    <Text style={{ fontFamily: 'Nexa-Light', marginVertical: 10 }}>Recommended</Text>
                                </TouchableOpacity>
                            </View> : <View />
                    }

                </View>

            </View>
        )
    }
}

const HomeTab = createStackNavigator({
    Home: Home,
    searchBooks: SearchBooks,
    bookDetails: BookDetails,
    Recommended: Recommended
});
const AccountTab = createStackNavigator({
    Account: Account,
    wishlist: Wishlist,
    wishlistDetails: BookDetails,
    issuedBooks: IssuedBooks
})
const Tabs = createBottomTabNavigator({
    Home: HomeTab,
    Account: AccountTab
}, {
    defaultNavigationOptions: ({ navigation }) => ({

        tabBarIcon: ({ focused }) => {
            const { routeName } = navigation.state;
            if (routeName === 'Home') {
                return <Icon name='home' size={20} color={focused ? '#23bcc4' : 'gray'} />
            } else if (routeName === 'Account') {
                return <Icon name='user-alt' size={20} color={focused ? '#23bcc4' : 'gray'} />
            }

        },
        tabBarOptions: {

            pressColor: '#23bcc4',
            style: {
                height: 60,
            },
            activeTintColor: '#23bcc4',
            inactiveTintColor: 'gray',
            labelStyle: {
                fontFamily: 'Nexa-Light',
                fontSize: 12,
                marginBottom: 6,
            },
        },

    })
}

);

export default createAppContainer(Tabs);
const styles = StyleSheet.create({
    container: {
        flex: 1,
        alignItems: 'center'
    }
})