import React from 'react';
import {Image, SafeAreaView, ScrollView, StyleSheet} from "react-native";

const PSHelperInfographicScreen = () => {
    return (
            <SafeAreaView>
                <ScrollView>
                    <ScrollView horizontal={true}>
                        <Image source={require("../assets/PSHelperInfographic.png")}
                               style={styles.containerImage}/>
                    </ScrollView>

                </ScrollView>
            </SafeAreaView>
        );
}

export default PSHelperInfographicScreen

const styles = StyleSheet.create({
    containerImage: {
            flex: 1,
            resizeMode: "cover"
    }
});