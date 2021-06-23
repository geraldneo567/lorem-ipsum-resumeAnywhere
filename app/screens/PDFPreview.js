import React, {useEffect, useState} from "react";
import PDFReader from "rn-pdf-reader-js";
import {View} from "react-native";
import AppButton from "../container/AppButton";
import {useNavigation} from "@react-navigation/native";
import {auth, db} from "../config/Database";

const PDFPreview = (props) => {
    const [fileURI, setFileURI] = useState('');
    const navigation = useNavigation();

    const loadURI = async () => {
        let docRef = db.collection("Files").doc(auth.currentUser.uid)
        await docRef.get().then(doc => {
            if (doc.exists) {
                console.log(doc.data());
                setFileURI(doc.data().files[0])
            }
            return () => console.log("Done")
        })
    }

    useEffect(() => {(async () => loadURI())()},
        []);

    return (
        <View style={{flex: 1}}>
            <PDFReader source={{uri: fileURI}}/>
            <AppButton title={"Done"} handler={() => navigation.navigate("Documents")} />
        </View>
    )
}

export default PDFPreview;