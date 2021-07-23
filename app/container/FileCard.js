import React from 'react';
import {Image, StyleSheet, Text, TouchableOpacity, View} from "react-native";

import Colors from "../config/colors";
import {Icon} from "react-native-elements";

const FileCard = (props) => {
    return (
        <View style={styles.card}>
            <Icon name="close-thick"
                  type="material-community"
                  color="red" size={15}
                  style={styles.icon}
                  onPress={props.remove}/>
            <TouchableOpacity style={styles.container} onPress={props.handler}>
                    <Image source={{uri: "https://img.icons8.com/file"}} style={styles.image} />
                    <Text style={styles.header}>{props.fileName}</Text>
            </TouchableOpacity>
        </View>
    );
}

const styles = StyleSheet.create({
    card: {
        flexDirection: "row",
        margin: 15,
        backgroundColor: Colors.placeholderColor,
        borderWidth: 0.73,
        borderColor: Colors.white,
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
        height: 180,
        justifyContent: "flex-start"
    },
    container: {
        paddingLeft: 10,
        flexDirection: 'column',
        alignItems: "center",
        justifyContent: "center",
        backgroundColor: Colors.placeholderColor
    },
    icon: {
      alignSelf: "flex-start"
    },
    image: {
        width: 50,
        height: 50
    },
    header: {
        color: Colors.grey,
        fontSize: 16,
        paddingTop: 10
    }
});

export default FileCard;