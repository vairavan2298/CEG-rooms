import React, { Component } from 'react';
import { View, StyleSheet, Text, FlatList, YellowBox, ToastAndroid, ActivityIndicator, AsyncStorage, Alert } from 'react-native'
import { ListItem, SearchBar } from 'react-native-elements'
import auth from '@react-native-firebase/auth';
import database from '@react-native-firebase/database';
export default class IssuedBooks extends Component {
    static navigationOptions = {
        title: 'Issued books',
        headerTintColor: "white",
        headerStyle: {
            backgroundColor: '#23bcc4',
        },
        headerTitleStyle: {
            fontFamily: "Nexa-Bold"
        }
    };
    constructor() {
        super()
        YellowBox.ignoreWarnings([
            "'ListItem"
        ])
    }
    state = {
        data: [],
        visible: false,
        haveData: false
    }
    
    componentDidMount = () => {
        database()
            .ref('books')
            .once('value')
            .then(snapshot => {
                console.log(snapshot.val());
                if(snapshot.val()){
                    let value = Math.floor(Math.random() * 10)
                    let response = snapshot.val()
                    let data = []
                    for(let i = 0; i <= value; i++){
                        data.push(response[i])
                    }
                    this.setState({
                        data: data,
                        visible: true,
                        haveData: true
                    })
                    
                } else {
                    this.setState({
                        
                        visible: true,
                        haveData: false
                    })
                }
                });
    }
   
    render() {
        if (!this.state.visible) {
            return (

                <View style={{ alignItems: 'center', justifyContent: 'center', flex: 1 }}>
                    <ActivityIndicator size='large' color='#23bcc4' />
                    <Text style={{ fontFamily: 'Nexa-Light', margin: 5, color: 'black' }}>Please wait...</Text>
                </View>
            )
        } else {
            if (!this.state.haveData) {
                return (

                    <View style={{ alignItems: 'center', justifyContent: 'center', flex: 1 }}>
                        <Text style={{ fontFamily: 'Nexa-Light', color: 'black' }}>There is nothing to show, just yet!</Text>
                    </View>


                )
            } else {
                return (
                    <View style={styles.container}>
                        <FlatList
                            data={this.state.data}
                            keyExtractor={(item, index) => index.toString()}
                            renderItem={({ item, index }) => {
                                return (
                                    <ListItem
                                        title={item.name}
                                        titleStyle={{ fontFamily: 'Nexa-Bold' }}
                                        subtitle={
                                            <View>
                                                <Text style={{ fontFamily: 'Nexa-Light', color: 'gray' }}>Author: <Text style={{ fontFamily: 'Nexa-Light' }}>{item.author.firstname} {item.author.lastname}</Text></Text>
                                            </View>
                                        }
                                        containerStyle={{
                                            marginHorizontal: 10,
                                            margin: 5,
                                        }}
                                        onPress={() => this.props.navigation.navigate('wishlistDetails', { data: item })}
                                    />
                                )
                            }}
                         />
                    </View>
                )
            }
        }
    }
}

const styles = StyleSheet.create({
    container: {
        flex: 1
    }
})