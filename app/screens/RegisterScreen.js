import React, {useState} from 'react';
import {Image, View, Text, StyleSheet, TouchableOpacity} from 'react-native';
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
            .then((authUser) => {
                authUser.user.updateProfile({
                    displayName: firstName + " " + lastName
                })
            })
            .catch((error) => {
                console.log(error)
            });
        }

    return (
        <View style={styles.container}>
            <View style={styles.containerImage}>
                <Image style={styles.logo} source={require('../assets/logo.jpg')} />
            </View>
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
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        flexDirection: 'column',
        justifyContent: 'flex-start',
        alignItems: 'center',
        marginHorizontal: 15,
        marginVertical: 0
    },
    containerImage: {
        alignSelf: 'center',
        resizeMode: 'cover',
        marginVertical: 60
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
        color: Colors.menu,
        fontSize: 15 ,
    },
});

export default RegisterScreen;