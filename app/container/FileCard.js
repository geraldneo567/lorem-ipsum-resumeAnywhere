import React from 'react';
import {Image, StyleSheet, Text, TouchableOpacity, View} from "react-native";

import Colors from "../config/colors";

const FileCard = (props) => {
    return (
        <TouchableOpacity style={styles.card} onPress={props.handler}>
        <View style={styles.container}>
                <Image source={{uri: "https://img.icons8.com/file"}} style={styles.image} />
                <Text style={styles.header}>{props.fileName}</Text>
        </View>
        </TouchableOpacity>
    );
}

const styles = StyleSheet.create({
    card: {
      margin: 15
    },
    container: {
        flexDirection: 'column',
        alignItems: "center",
        justifyContent: "center",
        backgroundColor: Colors.placeholderColor,
        borderRadius: 8,
        shadowColor: Colors.black,
        shadowOffset: {
            width: 0,
            height: 3
        },
        shadowOpacity: 0.30,
        shadowRadius: 4.65,
        elevation: 5,
        padding: 5,
        width: 150,
        height: 150
    },
    image: {
        width: 50,
        height: 50
    },
    header: {
        color: Colors.grey,
        fontSize: 18,
        paddingTop: 10
    }
});

export default FileCard;