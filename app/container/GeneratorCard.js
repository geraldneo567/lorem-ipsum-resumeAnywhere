import React from 'react';
import {Image, StyleSheet, Text, TouchableOpacity, View} from "react-native";

import Colors from "../config/colors";

const GeneratorCard = (props) => {
    return (
        <TouchableOpacity style={styles.card} onPress={props.handler}>
            <View style={styles.container}>
                <Image source={props.imgUrl}
                       style={styles.image} />
                <Text style={styles.header}>{props.title}</Text>
            </View>
        </TouchableOpacity>
    );
}

const styles = StyleSheet.create({
    card: {
        margin: 15,
        justifyContent: "center",
        alignItems: "center",
        backgroundColor: Colors.white,
        borderWidth: 2.5,
        borderStyle: "solid",
        borderColor: Colors.placeholderColor,
        borderRadius: 12,
        shadowColor: Colors.grey,
        shadowOffset: {
            width: 5,
            height: 10,
        },
        width: 150,
        height: 150
    },
    container: {
        justifyContent: "center",
        alignItems: 'center',
    },
    image: {
        resizeMode: "contain",
        width: 70,
        height: 110
    },
    header: {
        fontSize: 16,
        color: Colors.textColor,
        fontWeight: "500"
    }
});

export default GeneratorCard;