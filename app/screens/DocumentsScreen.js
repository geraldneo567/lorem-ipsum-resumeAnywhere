import React, { useState } from 'react';
import {StyleSheet, Text, View, Image} from 'react-native';
import DocumentPicker from "expo-document-picker/src/ExpoDocumentPicker";

import AppButton from "../container/AppButton";

const DocumentsScreen = ({navigation}) => {
    const [fileURI, setfileURI] = useState('');
    const [show, setShow] = useState(false);

    const selectDocuments = async () => {
        let result = await DocumentPicker.getDocumentAsync({});
        setfileURI(result.uri);
        setShow(true);
        console.log(result);
    }

    return (
        <View style={styles.container}>
            <Text>Saved Documents</Text>
            <AppButton title='Camera' handler={() => navigation.navigate("Camera")} />
            <AppButton title='Upload' handler={selectDocuments} />
            {show && <Image source={fileURI} />}
        </View>
    );
}

const styles =StyleSheet.create({
    container: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center'
    }
});

export default DocumentsScreen;
