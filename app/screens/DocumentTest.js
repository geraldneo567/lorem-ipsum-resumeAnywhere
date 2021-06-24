import React, {useCallback, useEffect, useState} from 'react';
import {
    StyleSheet,
    Text,
    View,
    Platform,
    FlatList,
    TouchableOpacity
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

    const loadFiles = async () => {
        let docRef = db.collection("Files").doc(auth.currentUser.uid)
        await docRef.get().then(async (doc) => {
            if (doc.exists) {
                const data = doc.data().files;
                const removeDuplicates = new Set(data);
                setFiles([...removeDuplicates]);
            }
            return () => console.log("Done")
        })
    }

    useEffect(() => {(async() => loadFiles())()}, []);

    const file = {
        fileName,
        fileURI
    }

    const updateResponse = async (response) => {
        try {
            if (response.type === 'success') {
                await FileSystem.getContentUriAsync(response.uri)
                    .then(cUri => {setFileURI(cUri);})
                setFileName(response.name);
                if (file.fileURI !== undefined) {
                    setFiles(files => [...files, file])
                }
            } else {
                return false;
            }
        } catch (e) {
            console.log(e);
        }
    }

    const updateDatabase = async () => {
        await db.collection('Files')
            .doc(auth.currentUser.uid)
            .set({
                files
            }).then(() => {
                setFileURI("")
                setFileName("")
            });
    }

    const upload = async () => {
        try {
            const resp = await DocumentPicker
                .getDocumentAsync({type: '*/*'})
            const exist = updateResponse(resp);
            if (exist && fileURI !== "") {
                await updateDatabase();
            }
        } catch (err) {
            console.log(err);
        }
    };

    const preview = async (uri) => {
        try {
            if (Platform.OS === 'android') {
                await IntentLauncher.startActivityAsync('android.intent.action.VIEW', {
                    data: uri,
                    flags: 1,
                });
            } else {
                navigation.navigate('PDF Preview', {fileUri: uri});
            }
        } catch (e) {
            console.log(e);
        }
    }

    return (
            <View style={styles.container}>
                <FlatList data={files}
                          extraData={files}
                          keyExtractor={item => item.fileURI}
                          renderItem={({item}) => {
                              return(
                                  <View>
                                      <TouchableOpacity onPress={() => preview(item.fileURI)}>
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