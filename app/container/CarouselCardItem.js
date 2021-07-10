import React from 'react';
import {Dimensions, Image, StyleSheet, Text, View} from "react-native";

import Colors from "../config/colors";

export const SLIDER_WIDTH = Dimensions.get('window').width + 80;
export const ITEM_WIDTH = Math.round(SLIDER_WIDTH * 0.70);

const CarouselCardItem = ({item, index}) => {
    return (
        <View style={styles.container} key={index}>
            <Image source={{uri: item.imgUrl}} style={styles.image} />
            <Text style={styles.header}>{item.title}</Text>
            <Text style={styles.body}>{item.body}</Text>
            <View style={styles.acknowledgement}>
                <Text> {'\u00A9'}NUS Centre for Future-ready Graduates</Text>
            </View>
        </View>
    );
}

const styles = StyleSheet.create({
    acknowledgement: {
        position: 'absolute',
        alignItems: 'center',
        justifyContent: 'center',
        paddingHorizontal: 10,
        bottom: 10
    },
    container: {
        flexDirection: 'column',
        backgroundColor: Colors.white,
        borderRadius: 8,
        width: ITEM_WIDTH,
        height: 650,
        paddingBottom: 40,
        shadowColor: Colors.black,
        shadowOffset: {
            width: 0,
            height: 3
        },
        shadowOpacity: 0.30,
        shadowRadius: 4.65,
        elevation: 7
    },
    image: {
        width: ITEM_WIDTH,
        height: 300
    },
    header: {
        color: Colors.grey,
        fontSize: 28,
        fontWeight: 'bold',
        paddingLeft: 20,
        paddingTop: 20
    },
    body: {
        color: Colors.grey,
        fontSize: 14.5,
        paddingHorizontal: 20,
        paddingTop: 20
    }
});

export default CarouselCardItem;