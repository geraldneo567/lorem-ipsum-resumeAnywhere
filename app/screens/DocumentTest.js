import React, {useEffect, useState} from 'react';
import {StyleSheet, Button, Text, Image, View, Platform, FlatList} from 'react-native';

import DocumentPicker from "expo-document-picker/src/ExpoDocumentPicker";
import * as FileSystem from 'expo-file-system';
import {db, auth, fb} from '../config/Database';
import * as IntentLauncher from "expo-intent-launcher";

const DocumentTest = ({navigation}) => {
    const [fileURI, setFileURI] = useState('');
    const [fileName, setFileName] = useState('');
    const [files, setFiles] = useState([]);

    const loadFiles = async () => {
        let docRef = db.collection("Files").doc(auth.currentUser.uid)
        await docRef.get().then(doc => {
            if (doc.exists) {
                setFiles(doc.data().files);
            }
            return () => console.log("Done")
        })
    }

    useEffect(() => {(async () => loadFiles())()},
        []);

    const file = {
        fileName,
        fileURI
    }

    const updateResponse = async (response) => {
        if (response.type === 'success') {
            setFileName(response.name);
            await FileSystem.getContentUriAsync(response.uri)
                .then(cUri => setFileURI(cUri));
        }
    }

    const onPress = async () => {
        try {
            await DocumentPicker
                .getDocumentAsync({type: '*/*'})
                .then(resp => updateResponse(resp));

            if (!files.includes(file)) {
                await db.collection('Files')
                    .doc(auth.currentUser.uid)
                    .set({
                        files: [...files, file]
                    }).then(() => {
                        setFileName('')
                        setFileURI('')
                    });
            }
        } catch (err) {
            console.log(err);
        }
    };

    const preview = async () => {
        try {
            if (Platform.OS === 'android') {
                await IntentLauncher.startActivityAsync('android.intent.action.VIEW', {
                    data: fileURI,
                    flags: 1,
                });
            } else {
                navigation.navigate('PDF Preview', {fileURI: fileURI});
            }
        } catch (e) {
            console.log(e);
        }
    }

    return (
            <View style={styles.container}>
                <View style={{flex: 0}}>
                    <FlatList data={files}
                              keyExtractor={item => item.fileName}
                              renderItem={({item}) => <Text>{item.fileName}</Text>} />
                </View>

                <Button onPress={onPress} title="Pick PDF File" />
                <Button onPress={preview} title={"Show File"} />
            </View>
    );
};

export default DocumentTest;

const styles = StyleSheet.create({
    container: {
        flex: 1,
        alignItems: 'center',
        justifyContent: 'center',
        padding: 20,
    }
});