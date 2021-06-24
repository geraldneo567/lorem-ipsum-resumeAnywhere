import React, {useEffect, useState} from "react";
import PDFReader from "rn-pdf-reader-js";
import {View} from "react-native";
import AppButton from "../container/AppButton";
import {useNavigation} from "@react-navigation/native";
import {auth, db} from "../config/Database";
import {FileSystem} from "react-native-unimodules";

const PDFPreview = (props) => {
    const [uri, setUri] = useState('');
    const navigation = useNavigation();

    const loadUri = async () => {
        let docRef = db.collection("Files").doc(auth.currentUser.uid)
        await docRef.get().then(async (doc) => {
            if (doc.exists) {
                await FileSystem.getContentUriAsync(doc.data.fileUris[props.id])
                    .then(cUri => setUri(cUri))
            }
            return () => console.log("Done")
        })
        console.log(uri);
    }

    useEffect(() => {(async() => loadUri())()}, []);

    return (
        <View style={{flex: 1}}>
            <PDFReader source={{uri: uri}}/>
            <AppButton title={"Done"} handler={() => navigation.navigate("Documents")} />
        </View>
    )
}

export default PDFPreview;