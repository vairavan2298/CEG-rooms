import React, { Component } from 'react';
import { View, StyleSheet, Text, ActivityIndicator, FlatList } from 'react-native';
import database from '@react-native-firebase/database';
import auth from '@react-native-firebase/auth';
import { ListItem } from 'react-native-elements';
export default class Recommended extends Component {
    static navigationOptions = {
        title: 'Recommended',
        headerTintColor: "white",
        headerStyle: {
            backgroundColor: '#23bcc4',
        },
        headerTitleStyle: {
            fontFamily: "Nexa-Bold"
        }
    };
    state = {
        data: [],
        visible: false,
        haveData: false,
    }

    componentDidMount = () => {
        database()
            .ref('/books')
            .once('value')
            .then(snapshot => {
                console.log(snapshot.val());
                if (snapshot.val().length > 0) {
                    let email = auth().currentUser.email
                    let filtered_data = snapshot.val().filter(data => {
                        if ('recommended' in data) {
                            return data.recommended.filter(sub_data => sub_data.year == email.substring(0, 4) && sub_data.course_id == email.substring(4, 7))
                        }

                    })
                    this.setState({
                        data: filtered_data,
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
                                        onPress={() => this.props.navigation.navigate('bookDetails', { data: item })}
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