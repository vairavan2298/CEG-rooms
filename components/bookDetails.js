import React, { Component } from 'react';
import { View, StyleSheet, Text, Image, ScrollView, Alert, } from 'react-native';
import { Button, Icon } from 'react-native-elements'
import messaging from '@react-native-firebase/messaging';
import database from '@react-native-firebase/database';
import auth from '@react-native-firebase/auth';
import { TouchableNativeFeedback } from 'react-native';

export default class BookDetails extends Component {
    static navigationOptions = {
        title: '',
        headerTintColor: "white",
        headerStyle: {
            backgroundColor: '#23bcc4',
        },
        headerTitleStyle: {
            fontFamily: "Nexa-Bold"
        }
    };

    state = {
        wishlist: [],
        subscriptions: []
    }

    componentDidMount = () => {
        database()
            .ref('/users/' + auth().currentUser.uid + '/wishlist')
            .once('value')
            .then(snapshot => {
                console.log(snapshot.val());
                if (snapshot.val()) {
                    this.setState({
                        wishlist: snapshot.val()
                    })
                }

            })
        database()
            .ref('/users' + auth().currentUser.uid + '/subscriptions')
            .once('value')
            .then(snapshot => {
                console.log(snapshot.val());
                if (snapshot.val()) {
                    this.setState({
                        subscriptions: snapshot.val()
                    })
                }

            })

    }
    onSubscribeToBook = () => {
        let data = this.props.navigation.getParam('data')

        let subscriptions = Object.assign([], this.state.wishlist)
        if (this.state.subscriptions.filter(filtered_data => filtered_data.id == data.id).length == 0) {
            messaging()
                .subscribeToTopic(data.id.toString())
                .then(() => {
                    subscriptions.push({ id: data.id })
                    this.setState({
                        subscriptions: subscriptions
                    })
                    database().ref('users/' + auth().currentUser.uid + '/subscriptions').set(subscriptions)
                        .then(() => {
                            Alert.alert('Subscribed', 'You have been subscribed to the book "' + data.name + '". As the count of the book decreases, ' + "you'll be notified.")
                        })

                })
        } else {
            messaging()
                .unsubscribeFromTopic(data.id.toString())
                .then(() => {
                    let removing_index = this.state.subscriptions.findIndex(filtered_data => filtered_data.id == data.id)
                    subscriptions.splice(removing_index, 1)
                    this.setState({
                        subscriptions: subscriptions
                    })
                    database().ref('users/' + auth().currentUser.uid + '/subscriptions').set(subscriptions)
                        .then(() => {
                            Alert.alert('Unsubscribed', 'You have been unsubscribed to the book "' + data.name + '". As the count of the book decreases, ' + "you'll not be notified.")
                        })

                })
        }

    }

    render() {
        let data = this.props.navigation.getParam('data')
        return (
            <View style={styles.container}>
                <ScrollView>
                    <View style={{ backgroundColor: 'white', marginHorizontal: 10, margin: 5, paddingVertical: 10 }}>
                        <Image
                            style={{ width: 175, height: 250, alignSelf: 'center' }}
                            source={{ uri: data.image }}
                        />
                        <View style={{ marginHorizontal: 15, marginVertical: 10, marginTop: 20 }}>
                            <View style={{ alignItems: 'flex-end' }}>
                                <TouchableNativeFeedback onPress={() => {
                                    console.log(this.state.wishlist)
                                    let wishlist = Object.assign([], this.state.wishlist)
                                    if (this.state.wishlist.filter(filtered_data => filtered_data.id == data.id).length == 0) {
                                        
                                        wishlist.push(data)
                                        this.setState({
                                            wishlist: wishlist
                                        })
                                        database().ref('users/' + auth().currentUser.uid + '/wishlist').set(wishlist)
                                            .then(() => console.log('Data updated.'));
                                    } else {
                                        let removing_index = this.state.wishlist.findIndex(filtered_data => filtered_data.id == data.id)
                                        wishlist.splice(removing_index, 1)
                                        this.setState({
                                            wishlist: wishlist
                                        })
                                        database().ref('users/' + auth().currentUser.uid + '/wishlist').set(wishlist)
                                        .then(() => console.log('Data updated.'));
                                    }


                                }}>
                                    <Icon name='heart' size={24} type='font-awesome' reverse reverseColor={this.state.wishlist.filter(filtered_data => filtered_data.id == data.id).length > 0 ? 'red' : 'gray'} raised color='white' />
                                </TouchableNativeFeedback>

                            </View>

                            <Text style={{ fontFamily: 'Nexa-Bold' }}>{data.name}</Text>
                            <Text style={{ fontFamily: 'Nexa-Light', color: 'gray' }}>{data.author.firstname + ' ' + data.author.lastname}</Text>
                        </View>
                    </View>
                    <View style={{ backgroundColor: 'white', marginHorizontal: 10, margin: 5, paddingVertical: 10 }}>
                        <View style={{ marginHorizontal: 15, margin: 5 }}>
                            <View style={{ flexWrap: 'wrap', flexDirection: 'row' }}>
                                <Text style={{ fontFamily: 'Nexa-Bold' }}>ID :  </Text><Text style={{ fontFamily: 'Nexa-Light' }}>{data.id}</Text>
                            </View>
                            <View style={{ flexWrap: 'wrap', flexDirection: 'row' }}>
                                <Text style={{ fontFamily: 'Nexa-Bold' }}>Location :  </Text><Text style={{ fontFamily: 'Nexa-Light' }}>{data.location}</Text>
                            </View>


                        </View>

                    </View>
                    <View style={{ backgroundColor: 'white', marginHorizontal: 10, margin: 5, paddingVertical: 10 }}>
                        <View style={{ marginHorizontal: 15, margin: 5 }}>
                            <View style={{ flexWrap: 'wrap', flexDirection: 'row' }}>
                                <Text style={{ fontFamily: 'Nexa-Bold' }}>No. of Books :  </Text><Text style={{ fontFamily: 'Nexa-Light' }}>{data.count}</Text>
                            </View>
                            <View style={{ flexWrap: 'wrap', flexDirection: 'row' }}>
                                <Text style={{ fontFamily: 'Nexa-Bold' }}>Edition :  </Text><Text style={{ fontFamily: 'Nexa-Light' }}>{data.edition}</Text>
                            </View>


                        </View>

                    </View>
                    <View style={{ marginVertical: 20 }}>
                        <Button
                            containerStyle={{ width: '75%', alignSelf: 'center' }}
                            buttonStyle={{ backgroundColor: '#23bcc4', borderRadius: 15 }}
                            titleStyle={{ fontFamily: 'Nexa-Light', color: 'white' }}
                            title={this.state.subscriptions.filter(filtered_data => filtered_data.id == data.id).length > 0 ? 'Unsubscribe' : 'To be picked'}
                            onPress={() => this.onSubscribeToBook()}
                        />
                    </View>
                </ScrollView>
            </View>
        )
    }
}
const styles = StyleSheet.create({
    container: {
        flex: 1
    }
})