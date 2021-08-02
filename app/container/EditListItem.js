import React from 'react';
import {StyleSheet, Text, TouchableOpacity, View} from "react-native";

import Colors from "../config/colors";

const EditListItem = (props) => {
    return (
        <View style={styles.container}>
            <TouchableOpacity style={styles.containerButton}
                              onPress={props.handler}>
                <Text style={styles.text}>{props.title}</Text>
            </TouchableOpacity>
        </View>

    );
}

export default EditListItem;

const styles = StyleSheet.create({
    container: {
        padding: 8,
        justifyContent: "center",
        alignItems: "flex-start",
        width: "100%"
    },
    containerButton: {
        padding: 10,
        borderBottomWidth: 1,
        borderColor: Colors.grey,
        width: '95%',
    },
    text: {
        fontSize: 16
    }
})
