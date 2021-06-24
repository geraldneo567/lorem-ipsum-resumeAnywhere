import React, {useCallback, useEffect, useState} from 'react';
import {
    StyleSheet,
    Text,
    View,
    Platform,
    FlatList,
    TouchableOpacity, ScrollView
} from 'react-native';
import {FAB, Icon} from "react-native-elements";

import DocumentPicker from "expo-document-picker/src/ExpoDocumentPicker";
import * as FileSystem from 'expo-file-system';

import {db, auth} from '../config/Database';
import Colors from '../config/colors';
import * as IntentLauncher from "expo-intent-launcher";


const DocumentTest = ({navigation}) => {
    const [fileURI, setFileURI] = useState('');
    const [fileName, setFileName] = useState('');
    const [files, setFiles] = useState([]);
    const [uris, setUris] = useState([])

    const loadFiles = async () => {
        let docRef = db.collection("Files").doc(auth.currentUser.uid)
        await docRef.get().then(async (doc) => {
            if (doc.exists) {
                await setFiles(doc.data().files);
                await setUris(doc.data().fileUris);
            }
            return () => console.log("Done")
        })
    }

    useEffect(() => {(async() => loadFiles())()}, []);

    const file = {
        id: files.length,
        fileName,
        fileURI
    }

    const updateResponse = async (response) => {
        if (response.type === 'success') {
            await FileSystem.getContentUriAsync(response.uri)
                .then(cUri => console.log(cUri))

            setFileName(response.name);
            if (uris.includes(fileURI)) {
                console.log("File already exists");
                return false;
            } else {
                setUris(uris => [...uris, fileURI])
                setFiles(files => [...files, file])
                return true;
            }
        } else {
            return false;
        }
    }

    const updateDatabase = async () => {
        if (file.fileURI !== "") {
            await db.collection('Files')
                .doc(auth.currentUser.uid)
                .set({
                    files,
                    fileUris: uris
                }).then(() => {
                });
        }
    }

    const upload = async () => {
        try {
            const resp = await DocumentPicker
                .getDocumentAsync({type: 'application/pdf'})
            const exist = updateResponse(resp);
            if (exist && fileURI !== "") {
                await updateDatabase();
            }
        } catch (err) {
            console.log(err);
        }
    };

    const preview = async (id) => {
        try {
            if (Platform.OS === 'android') {
                await IntentLauncher.startActivityAsync('android.intent.action.VIEW', {
                    data: uris[id],
                    flags: 1,
                });
            } else {
                navigation.navigate('PDF Preview', {id: id});
            }
        } catch (e) {
            console.log(e);
        }
    }

    return (
            <View style={styles.container}>
                <FlatList data={files}
                          extraData={files}
                          renderItem={({item}) => {
                              return(
                                  <View>
                                      <TouchableOpacity onPress={() => preview(item.id)}>
                                          <Text>{item.fileName}</Text>
                                      </TouchableOpacity>
                                  </View>
                              )
                          }} />
                <FAB onPress={upload}
                     icon={<Icon name='plus'
                            type='material-community'
                            size={20}
                            color={Colors.white}/>}
                     placement="right"
                     color={Colors.placeholderColor}
                />
            </View>
    );
};

export default DocumentTest;

const styles = StyleSheet.create({
    container: {
        flex: 1,
        alignItems: 'center',
        justifyContent: 'center',
        padding: 20
    }
});