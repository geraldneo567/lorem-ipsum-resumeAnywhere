import React, {useCallback, useEffect, useState} from 'react';
import {StyleSheet, Button, Text, Image, View, Platform, FlatList, TouchableOpacity} from 'react-native';

import DocumentPicker from "expo-document-picker/src/ExpoDocumentPicker";
import * as FileSystem from 'expo-file-system';
import {db, auth, fb} from '../config/Database';
import * as IntentLauncher from "expo-intent-launcher";
import {Touchable} from "react-native-web";

const DocumentTest = ({navigation}) => {
    const [fileURI, setFileURI] = useState('');
    const [fileName, setFileName] = useState('');
    const [files, setFiles] = useState([]);
    const [uris, setUris] = useState([])

    const loadFiles = async () => {
        let docRef = db.collection("Files").doc(auth.currentUser.uid)
        await docRef.get().then(doc => {
            if (doc.exists) {
                setFiles(doc.data().files);
                setFiles(files.filter(x => x !== ``));
            }
            return () => console.log("Done")
        })
    }

    useCallback(() => {(async () => loadFiles())()},
        []);

    const file = {
        key: fileURI + files.length,
        fileName,
        fileURI
    }

    const updateResponse = async (response) => {
        if (response.type === 'success') {
            setFileName(response.name);
            setUris([...uris, response.uri])
            await FileSystem.getContentUriAsync(response.uri)
                .then(cUri => setFileURI(cUri));
        }
    }

    const onPress = async () => {
        try {
            await DocumentPicker
                .getDocumentAsync({type: 'application/pdf'})
                .then(resp => updateResponse(resp));

            setFiles([...files, file])

            await db.collection('Files')
                .doc(auth.currentUser.uid)
                .set({
                    files
                }).then(() => {
                    console.log(files);
                });
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
                console.log(files)
                //navigation.navigate('PDF Preview', {fileURI: fileURI});
            }
        } catch (e) {
            console.log(e);
        }
    }

    return (
            <View style={styles.container}>
                <FlatList data={files}
                          extraData={file}
                          renderItem={({item}) => {
                              return(
                                  <View>
                                      <TouchableOpacity>
                                          <Text>{item.fileName}</Text>
                                      </TouchableOpacity>
                                  </View>
                              )
                          }} />
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