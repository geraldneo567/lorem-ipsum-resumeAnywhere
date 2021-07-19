import React, {useEffect, useState} from 'react';
import {
    StyleSheet,
    View,
    Platform,
    FlatList,
    ImageBackground
} from 'react-native';
import {FAB, Icon} from "react-native-elements";

import DocumentPicker from "expo-document-picker/src/ExpoDocumentPicker";
import * as FileSystem from 'expo-file-system';
import * as IntentLauncher from "expo-intent-launcher";

import {db, auth} from '../config/Database';
import Colors from '../config/colors';
import FileCard from '../container/FileCard'

const DocumentTest = ({navigation}) => {
    const [fileURI, setFileURI] = useState('');
    const [fileName, setFileName] = useState('');
    const [files, setFiles] = useState([]);

    const loadFiles = async () => {
        let docRef = db.collection("Files").doc(auth.currentUser.uid)
        await docRef.onSnapshot(async (doc) => {
            if (doc.exists) {
                const data = doc.data().files;
                setFiles(data);
            }
            return () => console.log("Done")
        })
    }

    const file = {
        fileName,
        fileURI
    }

    useEffect(() => {(async () => loadFiles())()}, []);

    const updateResponse = async (response) => {
        try {
            if (response.type === 'success') {
                const cUri = await FileSystem.getContentUriAsync(response.uri);
                setFileURI(cUri);
                setFileName(response.name);
                setFiles([...files, file]);
                return true;
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
            .update({
                files
            }).then(() => {});
    }

    const upload = async () => {
        try {
            const resp = await DocumentPicker
                .getDocumentAsync({type: '*/*'})
            const exist = updateResponse(resp);
            if (exist) {
                await updateDatabase();
                setTimeout(() => {}, 1500);
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
                navigation.navigate('PDF Preview', {fileUri: uri, screenName: "Documents"});
            }
        } catch (e) {
            console.log(e);
        }
    }

    return (
        <ImageBackground source={require('../assets/ImageBackground.png')}
                         style={styles.containerImage}
                         imageStyle={styles.image}>
            <View style={styles.container}>
                <FlatList data={files}
                          horizontal={false}
                          numColumns={2}
                          keyExtractor={item => Math.random() + item.fileURI}
                          renderItem={({item}) => {
                              return(
                                  <FileCard fileName={item.fileName}
                                            handler={() => preview(item.fileURI)}/>
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
        </ImageBackground>
    );
};

export default DocumentTest;

const styles = StyleSheet.create({
    container: {
        flex: 1,
        alignItems: 'center',
        justifyContent: 'center',
        padding: 20,
    },
    containerImage: {
        flex: 1,
        resizeMode: 'cover',
        justifyContent: 'center',
    },
    image: {
        opacity: 0.80
    },
});