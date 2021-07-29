import React from 'react';
import {StyleSheet, Text, View} from "react-native";
import {Icon} from "react-native-elements";
import Colors from "../config/colors";

const InfoListItem = (props) => {

    return (
        <View style={styles.containerInfoWithImg}>
            <Icon name={props.iconName}
                  size={45}
                  type="material-community" />
            <View style={{flexDirection: "row"}}>
                <View style={styles.containerInfo}>
                    <Text style={styles.info}>{props.data}</Text>
                    <Text style={styles.label}>{props.title}</Text>
                </View>
            </View>
        </View>
    )
}

export default InfoListItem;

const styles = StyleSheet.create({
    containerInfo: {
        marginHorizontal: 20,
        width: "75%"
    },
    containerInfoWithImg: {
        flexDirection: "row",
        marginHorizontal: 20,
        marginTop: 15
    },
    edit: {
        alignSelf: "flex-end"
    },
    info: {
        fontSize: 22
    },
    label: {
        fontSize: 16,
        paddingVertical: 8,
        color: Colors.grey,
        fontWeight: '400'
    }
})