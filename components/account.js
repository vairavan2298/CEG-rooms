import React, { Component } from 'react';
import { View, StyleSheet, Text, Alert, AsyncStorage } from 'react-native';
import auth from '@react-native-firebase/auth';
import { Avatar, Divider, ListItem } from 'react-native-elements';
import Icon from 'react-native-vector-icons/FontAwesome';
import { NavigationActions, StackActions } from 'react-navigation';
import Axios from 'axios';
import RazorpayCheckout from 'react-native-razorpay';
export default class Account extends Component {
    static navigationOptions = {
        title: 'Account',
        headerTitleStyle: { fontFamily: 'Nexa-Bold', color: 'white' },
        headerStyle: { backgroundColor: '#23bcc4' }
    }
    state = {
        isUserLogged: false,
        fine: Math.floor(Math.random() * 500) + 1
    }
    componentDidMount = () => {
        auth().onAuthStateChanged((user) => {
            if (user) {
                this.setState({ isUserLogged: true })
            }
        });

    }
    render() {
        return (
            <View style={styles.container}>
                {
                    this.state.isUserLogged ?
                        <View style={{ backgroundColor: 'white', }}>
                            <View style={{ flexWrap: 'wrap', flexDirection: 'row', alignItems: 'center', padding: 15 }}>
                                <Avatar
                                    title={auth().currentUser.displayName.charAt(0)}
                                    titleStyle={{ fontFamily: 'Nexa-Bold' }}
                                    size={'large'}
                                    overlayContainerStyle={{ backgroundColor: 'lightgray' }}
                                    avatarStyle={{ borderColor: 'white', borderWidth: 5 }}
                                    rounded
                                    containerStyle={{ marginHorizontal: 10 }}
                                />
                                <View style={{ marginHorizontal: 10 }}>
                                    <Text style={{ fontFamily: 'Nexa-Bold' }}>{auth().currentUser.displayName}</Text>
                                    <Text style={{ fontFamily: 'Nexa-Light', color: 'gray', marginVertical: 5 }}>{auth().currentUser.email}</Text>
                                </View>

                            </View>
                            <Divider style={{ margin: 5 }} />
                            <ListItem
                                title={'Issued books'}
                                titleStyle={{ fontFamily: 'Nexa-Light' }}
                                chevron
                                leftIcon={<Icon name={'book'} color={'#23bcc4'} size={20} />}
                                onPress={() => this.props.navigation.navigate('issuedBooks')}
                            />
                             <ListItem
                                title={'Wishlist'}
                                titleStyle={{ fontFamily: 'Nexa-Light' }}
                                chevron
                                leftIcon={<Icon name={'star'} color={'#23bcc4'} size={20} />}
                                onPress={() => this.props.navigation.navigate('wishlist')}
                            />
                            <ListItem
                                title={'Pay fine'}
                                titleStyle={{ fontFamily: 'Nexa-Light' }}
                                chevron
                        rightElement={<Text style={{fontFamily: 'Nexa-Light'}}>Rs. {this.state.fine}</Text>}
                                leftIcon={<Icon name={'money'} color={'#23bcc4'} size={20} />}
                                onPress={() => {
                                    
                                    Axios.post('https://api.razorpay.com/v1/orders', 
                                    {
                                        amount: this.state.fine * 100,
                                        currency: 'INR'
                                    }, {
                                        auth: {
                                            username: 'rzp_test_Uo7GpZSYYMXNIC',
                                            password: 'W9NraSQ1Vdl3pFXBJ4alT2zD'
                                          }
                                        
                                    }).then(response => {

                                        console.log(response)
                                   
                                        let options = {
                                            description: 'College of Engineering Guindy',
                                            image: '',
                                            currency: 'INR',
                                            key: 'rzp_test_Uo7GpZSYYMXNIC',
                                            amount: response.data.amount,
                                            name: 'LIBM Fine',
                                            order_id: response.data.id,
                                            prefill: {
                                                email: auth().currentUser.email,
                                                name: auth().currentUser.displayName
                                            },
                                            theme: { color: '#23bcc4' }
                                        }
                                        console.log(options)
                                    
                                        RazorpayCheckout.open(options).then((transaction_data) => {
                                            this.setState({
                                                fine: 0
                                            })
                                            Alert.alert('', 'Payment successful!', [
                                                { text: 'OK', style: 'default' }
                                            ]);
                                        }).catch((error) => {
                                            
                                            Alert.alert('', 'Payment cancelled!', [
                                                { text: 'OK', style: 'default' }
                                            ]);
                                        });
                                    }).catch(e => {
                                        alert(e.message)
                                        console.log(e)
                                    })
                                }}
                            />
                            <ListItem
                                title={'Sign out'}
                                titleStyle={{ fontFamily: 'Nexa-Light' }}
                                chevron
                                leftIcon={<Icon name={'sign-out'} color={'#23bcc4'} size={20} />}
                                onPress={() =>
                                    Alert.alert('', 'Do you want to sign out?',
                                        [
                                            {
                                                text: 'NO',
                                                style: 'cancel'
                                            },
                                            {
                                                text: 'YES',
                                                onPress: async () => {
                                                    await auth().signOut()
                                                    await AsyncStorage.removeItem('token')
                                                    await this.props.navigation.dispatch(StackActions.reset({
                                                        index: 0,
                                                        actions: [
                                                            NavigationActions.navigate({ routeName: 'app' })
                                                        ]
                                                    }))
                                                }

                                            }
                                        ], { cancelable: false })
                                }
                            />
                        </View> :
                        <View>
                            <ListItem
                                title={'Sign in'}
                                titleStyle={{ fontFamily: 'Nexa-Light' }}
                                chevron
                                leftIcon={<Icon name={'sign-in'} color={'#23bcc4'} size={20} />}
                                onPress={() => {
                                    this.props.navigation.dispatch(StackActions.reset({
                                        index: 0,
                                        actions: [
                                            NavigationActions.navigate({ routeName: 'app' })
                                        ]
                                    }))
                                }}
                            />
                        </View>
                }

            </View>
        )
    }
}
const styles = StyleSheet.create({
    container: {
        flex: 1
    }
})