import React from 'react';
import {StyleSheet, Text, View} from "react-native";
import {Icon} from "react-native-elements";

import Colors from '../config/colors';

const DescriptionContainer = (props) => {
    return (
            <View style={styles.container}>
                <View style={styles.containerHeader}>
                    <Text style={styles.header}>
                        {props.title}
                    </Text>
                </View>
                <View style={styles.info}>
                    <Text>{props.additional}</Text>
                </View>
                <View style={styles.containerDate}>
                    <Text style={styles.date}>
                        From {props.startDate} to {props.endDate}
                    </Text>
                </View>
                <View style={styles.description}>
                    <Text>{props.description}</Text>
                </View>
                <Icon name="delete"
                      type="material-community"
                      onPress={() => props.remove(props.toRemove)} />
            </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 0,
        backgroundColor: Colors.offwhite,
        borderStyle: 'solid',
        borderColor: 'rgba(158, 150, 150, 0.5)',
        borderWidth: 1,
        borderRadius: 8,
        padding: 10,
        marginTop: 10,
        width: '100%'
    },
    containerDate: {
        height: 50,
        justifyContent: 'space-around'
    },
    containerHeader: {
        marginVertical: 10
    },
    date: {
        fontSize: 15,
        fontStyle: 'italic',
        textTransform: 'uppercase'
    },
    header: {
        fontVariant: ['small-caps'],
        fontSize: 20,
        fontWeight: 'bold',
        textShadowOffset: {width: 10, height: 10},
        textShadowColor: 'red',
        lineHeight: 20
    },
    info: {
        fontSize: 15,
        fontWeight: 'bold'
    },
    description: {
        fontSize: 15
    }
})

export default DescriptionContainer;