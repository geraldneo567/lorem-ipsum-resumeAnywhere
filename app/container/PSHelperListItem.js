import React from 'react';
import {StyleSheet, Text, View} from "react-native";
import Colors from "../config/colors";

const PSHelperListItem = (props) => {
    return (
        <View style={styles.container}>
            <Text style={styles.text}>{props.item}</Text>
        </View>
    )
}

export default PSHelperListItem;

const styles=StyleSheet.create({
    container: {
        flex: 0,
        shadowColor: Colors.grey,
        shadowOffset: {
            width: 5,
            height: 8,
        },
        shadowOpacity: 0.40,
        shadowRadius: 3.5,
        elevation: 5,
        padding: 10,
        borderRadius: 8,
        margin: 3,
        backgroundColor: Colors.placeholderColor,
        alignItems:'center',
        justifyContent:'center'
    },
    text: {
        fontSize: 16,
        fontWeight: "500",
        color: Colors.textColor
    }
});