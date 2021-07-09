import React, {useState} from 'react';
import {View, Text, StyleSheet, TouchableOpacity, ImageBackground} from 'react-native';
import {Button, Input} from "react-native-elements";

import Colors from '../config/colors';
import { auth } from "../config/Database";

const RegisterScreen = ({navigation}) => {
    const [firstName, setFirstName] = useState("")
    const [lastName, setLastName] = useState("")
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("")

    const handleRegistration = () => {
        auth.createUserWithEmailAndPassword(email, password)
            .then(async (authUser) => {
                await authUser.user.updateProfile({
                    displayName: firstName + " " + lastName,
                })
            })
            .catch((error) => {
                console.log(error)
            });
        }

    return (
        <ImageBackground source={require("../assets/loginPageBackground.png")}
                         style={styles.containerImage}>
            <View style={styles.container}>
                <Input inputContainerStyle={styles.containerInput}
                       style={{marginVertical:0}}
                       placeholder='First name'
                       placeholderTextColor={Colors.grey}
                       onChangeText={(text) => setFirstName(text)}
                       value={firstName}
                />
                <Input inputContainerStyle={styles.containerInput}
                       placeholder={"Last name"}
                       placeholderTextColor={Colors.grey}
                       onChangeText={text => setLastName(text)}
                       value={lastName} />
                <Input inputContainerStyle={styles.containerInput}
                       placeholder='Email'
                       placeholderTextColor={Colors.grey}
                       textContentType={'emailAddress'}
                       keyboardType='email-address'
                       onChangeText={text => setEmail(text)}
                       value={email} />
                <Input inputContainerStyle={styles.containerInput}
                       placeholder='Password'
                       secureTextEntry
                       placeholderTextColor={Colors.grey}
                       onChangeText={(text) => setPassword(text)}
                       value={password}/>
                <Button title={'Register'}
                        onPress={handleRegistration} />
                <View style={styles.containerLogin}>
                    <Text>Already have an account? </Text>
                    <TouchableOpacity onPress={() => navigation.navigate('Login')}>
                        <Text style={styles.text}>Log in</Text>
                    </TouchableOpacity>
                </View>
            </View>
        </ImageBackground>
    );
}

const styles = StyleSheet.create({
    container: {
        flexDirection: 'column',
        justifyContent: 'center',
        alignItems: 'center',
        marginHorizontal: 15,
        top: 120
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
        paddingHorizontal: 10
    },
    containerLogin: {
        flexDirection: 'row',
        marginTop: 10
    },
    logo: {
        height: 200,
        width: 200
    },
    text: {
        color: Colors.textColor,
        fontSize: 15 ,
    },
});

export default RegisterScreen;