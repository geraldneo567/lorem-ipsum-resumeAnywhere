import React from "react";
import PDFReader from "rn-pdf-reader-js";
import {View} from "react-native";
import AppButton from "../container/AppButton";

const PDFPreview = ({navigation, route}) => {
    return (
        <View style={{flex: 1}}>
            <PDFReader source={{uri: route.params.fileUri}}/>
            <AppButton title={"Done"} handler={() => navigation.navigate(route.params.screenName)} />
        </View>
    )
}

export default PDFPreview;