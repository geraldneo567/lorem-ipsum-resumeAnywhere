import {Button, SafeAreaView, Text, StyleSheet} from "react-native";
import React from "react";

export default function LogoutScreen({navigation}) {

    return (
        <SafeAreaView style={styles.container}>
            <Text>You have been logged out.</Text>
            <Button title={"Login"}
                    style={{color: 'red'}}
                    onPress={() => {
                        navigation.navigate('Main', {screen: 'Login'})}}/>
        </SafeAreaView>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center'
    }
})
