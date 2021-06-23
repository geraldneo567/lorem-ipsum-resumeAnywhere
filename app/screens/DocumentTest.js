import React, {useState} from 'react';
import {StyleSheet, Button, Text, Image, View} from 'react-native';
import DocumentPicker from "expo-document-picker/src/ExpoDocumentPicker";
import * as FileSystem from 'expo-file-system';
import PdfThumbnail from 'react-native-pdf-thumbnail';
import {db, auth, fb} from '../config/Database';
import * as IntentLauncher from "expo-intent-launcher";

const DocumentTest = () => {
    const [thumbnail, setThumbnail] = React.useState('');
    const [error, setError] = React.useState('');
    const [fileURI, setFileURI] = useState('');

    const reference = fb.child('test.pdf');

    const onPress = async () => {
        try {
            const response = await DocumentPicker.getDocumentAsync(
                {type: 'application/pdf'});

            await FileSystem.getContentUriAsync(response.uri).then(cUri => {
                setFileURI(cUri);
                /*
                IntentLauncher.startActivityAsync('android.intent.action.VIEW', {
                    data: cUri,
                    flags: 1,
                });
                 */
            });

            const {uri} = await FileSystem.getInfoAsync(fileURI);
            console.log(uri);
            /*
            await db.collection('Files')
                .doc(auth.currentUser.uid)
                .set({
                    file: fileURI
                }).then(content => console.log(content));
             */

            //const url = await reference.getDownloadURL();
            const result = await PdfThumbnail.generate(uri, 0)
            setThumbnail(result);
            setError(undefined);
        } catch (err) {
            setThumbnail(undefined);
            setError(err);
        }
    };

    const thumbnailResult = thumbnail ? (
        <>
            <Image
                source={thumbnail}
                resizeMode="contain"
                style={styles.thumbnailImage}
            />
            <Text style={styles.thumbnailInfo}>uri: {thumbnail.uri}</Text>
            <Text style={styles.thumbnailInfo}>width: {thumbnail.width}</Text>
            <Text style={styles.thumbnailInfo}>height: {thumbnail.height}</Text>
        </>
    ) : null;

    const thumbnailError = error ? (
        <>
            <Text style={styles.thumbnailError}>Error code: {error.code}</Text>
            <Text style={styles.thumbnailError}>Error message: {error.message}</Text>
        </>
    ) : null;

    return (
        <View style={styles.container}>
            <View style={styles.thumbnailPreview}>
                {thumbnailResult}
                {thumbnailError}
            </View>
            <Button onPress={onPress} title="Pick PDF File" />
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
    },
    thumbnailPreview: {
        padding: 20,
        alignItems: 'center',
    },
    thumbnailImage: {
        width: 200,
        height: 200,
        marginBottom: 20,
    },
    thumbnailInfo: {
        color: 'darkblue',
    },
    thumbnailError: {
        color: 'crimson',
    },
});