import React, {useEffect, useState} from "react";
import PDFReader from "rn-pdf-reader-js";
import {View} from "react-native";
import AppButton from "../container/AppButton";

const PDFPreview = ({navigation, route}) => {

    return (
        <View style={{flex: 1}}>
            <PDFReader source={{uri: route.params.fileUri}}/>
            <AppButton title={"Done"} handler={() => navigation.navigate("Documents")} />
        </View>
    )
}

export default PDFPreview;