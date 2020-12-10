import React, { Component } from 'react';
import { View, StyleSheet, Text, TextInput, Alert, ActivityIndicator } from 'react-native';
import Icon from 'react-native-vector-icons/Feather';

import { Button, Input, Overlay } from 'react-native-elements';
import auth from '@react-native-firebase/auth';

export default class Register extends Component {
    static navigationOptions = {
        headerShown: false
    }
    state = {
        name: '',
        isClose: true,
        roll_no: '',
        password: '',
        loading: false
    }

    password = () => {
        if (!this.state.isClose) {
            return (
                <Icon
                    name="eye"
                    size={20}
                    color="gray"
                    style={{ marginRight: 10 }}
                    onPress={() => {
                        this.setState({ isClose: true });
                    }}
                />
            );
        } else {
            return (
                <Icon
                    name="eye-off"
                    size={20}
                    color="gray"
                    style={{ marginRight: 10 }}
                    onPress={() => {
                        this.setState({ isClose: false });
                    }}
                />
            );
        }
    };
    onClickRegister = () => {
        if (this.state.name !== '' && this.state.roll_no !== '' && this.state.password !== '') {
            this.setState({loading: true})
            auth().createUserWithEmailAndPassword(this.state.roll_no + '@annauniv.edu.in', this.state.password)
                .then(async (userCredentials) => {
                    console.log(userCredentials)
                   
                    if (userCredentials.user) {
                        userCredentials.user.updateProfile({
                            displayName: this.state.name,
                        })
                       
                    }
                    this.setState({loading: false})
                    Alert.alert(
                        "Verification",
                        'A verification link has been sent to "' + this.state.roll_no + '@annauniv.edu.in". Please verify in order to complete the registration.',
                        [
                            {
                                text: "Ok",
                                onPress: () => {
                                    this.props.navigation.navigate('login')

                                }
                            },

                        ],
                        { cancelable: true }
                    );
                }).catch(e => {
                    this.setState({loading: false})
                    Alert.alert('', 'Problem in registering!')
                })
        } else {
            Alert.alert('', 'Fields should not be empty!', [{ text: 'OK' }], { cancelable: false })
        }
    }

    render() {
        return (
            <View style={styles.container}>
                   <Overlay isVisible={this.state.loading} height={75} overlayStyle={{ alignItems: 'center', justifyContent: 'center' }}>
                    <View style={{ flexDirection: 'row', alignItems: 'center' }}>
                        <ActivityIndicator size='large' color={'#ff6b6b'} />
                        <Text style={{ fontFamily: 'Nexa-Light', marginHorizontal: 20 }}>Registering...</Text>
                    </View>

                </Overlay>
                <View style={{ alignItems: 'center', backgroundColor: '#23bcc4', paddingVertical: 50 }}>
                    <Text style={{ fontSize: 50, color: 'white', fontFamily: 'Nexa-Bold' }}>MAD-LIBM</Text>
                </View>
                <View style={{ borderRadius: 5, padding: 15, marginHorizontal: 15, marginTop: '5%' }}>
                    <View><Text style={{ fontFamily: 'Nexa-Bold', margin: 10, fontSize: 20, color: '#23bcc4' }}>REGISTER</Text></View>
                    <View style={{ marginTop: '2%' }}>
                        <Input
                            returnKeyType="next"
                            onSubmitEditing={() => { this.nameInput.focus(); }}
                            inputStyle={styles.input_style}
                            placeholder="Roll No."
                            leftIcon={
                                <Icon
                                    name="book"
                                    size={20}
                                    color="gray"
                                    style={{ marginRight: 5 }}
                                />
                            }

                            onChangeText={text => {
                                this.setState({ roll_no: text });
                            }}

                        />
                    </View>
                    <View>
                        <Input
                            returnKeyType="next"
                            onSubmitEditing={() => { this.passwordInput.focus(); }}
                            ref={(input) => { this.nameInput = input; }}
                            inputStyle={styles.input_style}
                            placeholder="Name"
                            leftIcon={
                                <Icon
                                    name="user"
                                    size={20}
                                    color="gray"
                                    style={{ marginRight: 5 }}
                                />
                            }

                            onChangeText={text => {
                                this.setState({ name: text });
                            }}

                        />
                    </View>




                    <View>
                        <Input
                            ref={(input) => { this.passwordInput = input; }}
                            placeholder="Password"
                            leftIcon={
                                <Icon
                                    name="lock"
                                    size={20}
                                    color="gray"
                                    style={{ marginRight: 5 }}
                                />
                            }
                            inputStyle={styles.input_style}
                            onChangeText={text => {
                                this.setState({ password: text });
                            }}
                            rightIcon={this.password()}
                            secureTextEntry={this.state.isClose}

                        />
                    </View>
                    <View style={{ marginVertical: '5%' }}>
                        <Button
                            title="REGISTER"
                            titleStyle={{ fontFamily: 'Nexa-Bold' }}
                            buttonStyle={{ backgroundColor: '#23bcc4', borderRadius: 30 }}
                            containerStyle={{ width: '80%', alignSelf: 'center' }}
                            onPress={() => { this.onClickRegister() }}
                        />
                    </View>
                </View>
                <View style={{ alignItems: 'center' }}>
                    <Text
                        style={{ fontFamily: 'Nexa-Light' }}>
                        Already have an account?  <Text
                            style={{ fontFamily: 'Nexa-Light', color: '#23bcc4' }}
                            onPress={() => this.props.navigation.navigate('login')}>Sign In</Text>
                    </Text>
                </View>
            </View>
        );
    }
}
const styles = StyleSheet.create({
    container: {
        flex: 1,

    },
    input_style: { fontFamily: 'Nexa-Light', fontSize: 15 }
})