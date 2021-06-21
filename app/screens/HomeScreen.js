import React, {useLayoutEffect} from 'react';
import {
    StyleSheet,
    SafeAreaView,
    ImageBackground,
    Platform,
    StatusBar,
    Button
} from 'react-native';
import {auth} from "../config/Database"

export default function HomeScreen({navigation}) {

    useLayoutEffect(() =>
        navigation.setOptions({
            headerTitle: "Welcome " + auth.currentUser.displayName
        })
    , [])

    return (
        <ImageBackground style={styles.background}
                         source={require('../assets/background.jpg')}
                         opacity={0.3}
                         blurRadius={8} >
            <SafeAreaView style={styles.container}>
                <Button title={"Resume Generator"}
                        onPress={() => navigation.navigate("Information Page", {screen: 'Resume Generator'})}/>
            </SafeAreaView>
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
        justifyContent: 'center',
        marginTop: Platform.OS === "android" ? StatusBar.currentHeight : 0
    }
})