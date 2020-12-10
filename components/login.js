import React, { Component } from 'react';
import { View, StyleSheet, Text, AsyncStorage, Alert, ActivityIndicator } from 'react-native';
import { Button, Input, Overlay } from 'react-native-elements';
import Icon from 'react-native-vector-icons/Feather';
import auth from '@react-native-firebase/auth';
import { NavigationActions, StackActions } from 'react-navigation';

export default class Login extends Component {
    static navigationOptions = {
        headerShown: false
    }
    state = {
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
    onClickLogin = () => {
        if (this.state.roll_no !== "" && this.state.password !== '') {
            this.setState({loading: true})
            auth().signInWithEmailAndPassword(this.state.roll_no + '@annauniv.edu.in', this.state.password)
                .then(async response => {
                    if (auth().currentUser.emailVerified) {
                        this.setState({loading: false})

                        AsyncStorage.setItem('token', auth().currentUser.uid)
                        
                        await this.props.navigation.dispatch(StackActions.reset({
                            index: 0,
                            actions: [
                                NavigationActions.navigate({ routeName: 'home' })
                            ]
                        }))
                    } else {
                        this.setState({loading: false})
                        response.user.sendEmailVerification()
                        
                            .then(() => {
                                Alert.alert(
                                    "Verification",
                                    'A verification link has been sent to "' + this.state.roll_no + '@annauniv.edu.in". Please verify in order to complete the registration.',
                                    [
                                        {
                                            text: "Ok",
                                        },

                                    ],
                                    { cancelable: true }
                                );
                            })

                    }
                }).catch(error => {
                    console.log(error)
                    alert('Invalid roll number or password!')
                    this.setState({
                        loading: false
                    })
                })
        }
    }
    render() {
        return (
            <View style={styles.container}>
                <Overlay isVisible={this.state.loading} height={75} overlayStyle={{ alignItems: 'center', justifyContent: 'center' }}>
                    <View style={{ flexDirection: 'row', alignItems: 'center' }}>
                        <ActivityIndicator size='large' color={'#ff6b6b'} />
                        <Text style={{ fontFamily: 'Nexa-Light', marginHorizontal: 20 }}>Logging in...</Text>
                    </View>

                </Overlay>
                <View style={{ alignItems: 'center', backgroundColor: '#23bcc4', paddingVertical: 50 }}>
                    <Text style={{ fontSize: 50, color: 'white', fontFamily: 'Nexa-Bold' }}>MAD-LIBM</Text>
                </View>
                <View style={{ borderRadius: 5, padding: 15, marginHorizontal: 15, marginTop: '5%' }}>
                    <View><Text style={{ fontFamily: 'Nexa-Bold', margin: 10, fontSize: 20, color: '#23bcc4' }}>LOGIN</Text></View>
                    <View style={{ marginTop: '2%' }}>
                        <Input
                            returnKeyType="next"
                            onSubmitEditing={() => { this.passwordInput.focus(); }}
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
                            title="LOGIN"
                            titleStyle={{ fontFamily: 'Nexa-Bold' }}
                            buttonStyle={{ backgroundColor: '#23bcc4', borderRadius: 30 }}
                            containerStyle={{ width: '80%', alignSelf: 'center' }}
                            onPress={() => { this.onClickLogin() }}
                        />
                    </View>
                </View>
                <View style={{ alignItems: 'center' }}>
                    <Text
                        style={{ fontFamily: 'Nexa-Light' }}>
                        Don't have an account?  <Text
                            style={{ fontFamily: 'Nexa-Light', color: '#23bcc4' }}
                            onPress={() => this.props.navigation.navigate('register')}>Sign Up</Text>
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