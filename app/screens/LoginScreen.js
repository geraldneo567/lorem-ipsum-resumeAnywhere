import React, {useState, useEffect} from 'react';
import {
    Platform,
    StatusBar,
    StyleSheet,
    View,
    Text,
    TouchableOpacity, ImageBackground, Alert,
} from 'react-native';
import { Icon, Input} from "react-native-elements";

import AppButton from "../container/AppButton";
import Colors from '../config/colors';

import { auth } from "../config/Database";

export default function LoginScreen({navigation}) {
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("")

    useEffect(() => {
        const unsubscribe = auth.onAuthStateChanged((authUser) => {
            if (authUser) {
                setTimeout(() => {
                    navigation.replace("Home")
                }, 1500);
                //navigation.replace("Home")
            }
        });

        return unsubscribe;
    }, [])

    const handleLogin = () => {
        auth.signInWithEmailAndPassword(email, password)
            .catch((error) => {
                Alert.alert("Unable to login", JSON.stringify(error.message));
            })
    }

    return (

            <ImageBackground source={require("../assets/loginPageBackground.png")}
                             style={styles.containerImage}>
                <View style={styles.content}>
                    <View style={styles.containerEntries}>
                        <Input inputContainerStyle={styles.containerInput}
                               placeholder='Email'
                               placeholderTextColor={Colors.grey}
                               leftIcon={<Icon name='account'
                                               type='material-community' />}
                               textContentType={'emailAddress'}
                               keyboardType='email-address'
                               onChangeText={text => setEmail(text)}
                               value={email} />
                        <Input inputContainerStyle={styles.containerInput}
                               placeholder='Password'
                               secureTextEntry
                               placeholderTextColor={Colors.grey}
                               leftIcon={<Icon name='lock'
                                               type='material-community' />}
                               onChangeText={(text) => setPassword(text)}
                               value={password}/>
                    </View>
                    <AppButton title='Login' handler={handleLogin}/>
                    <View style={styles.containerRegister}>
                        <Text>Don't have an account? </Text>
                        <TouchableOpacity onPress={() => navigation.navigate('Register')}>
                            <Text style={styles.text}>Register</Text>
                        </TouchableOpacity>
                    </View>
                </View>

            </ImageBackground>

    );
}

const styles = StyleSheet.create({
    background: {
        width: '100%',
        height: '100%'
    },
    container: {
        flex: 1,
        alignItems: 'center',
        justifyContent: 'flex-start',
        marginTop: Platform.OS === "android" ? StatusBar.currentHeight + 20: 20,
        marginHorizontal: 16
    },
    containerEntries: {
        width: '100%'
    },
    containerImage: {
        flex: 1,
        resizeMode: 'cover',
        justifyContent: 'center'
    },
    containerInput: {
        borderStyle: 'solid',
        borderWidth: 1,
        borderRadius: 50,
        paddingHorizontal: 10,
    },
    containerRegister: {
        flexDirection: 'row',
        justifyContent: 'center',
        marginTop: 10
    },
    content: {
        flexDirection: 'column',
        justifyContent: 'center',
        alignItems: 'center',
        marginHorizontal: 15,
        top: 80
    },
    logo: {
        height: 200,
        width: 200
    },
    text: {
        color: Colors.textColor,
        fontSize: 15
    }
})