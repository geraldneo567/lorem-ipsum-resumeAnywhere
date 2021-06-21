import React, {useEffect, useState} from 'react';
import {View, StyleSheet, Platform} from 'react-native';

import * as Print from 'expo-print';
import * as MediaLibrary from 'expo-media-library';
import * as FileSystem from 'expo-file-system';
import * as IntentLauncher from 'expo-intent-launcher';
import * as Sharing from 'expo-sharing';
import loadLocalResource from 'react-native-local-resource';
import AppButton from "../container/AppButton";

import {auth, db} from "../config/Database";

const ResumeGeneratorScreen = ({navigation}) => {

    const [html, setHtml] = useState('');
    const [data, setData] = useState(null);

    useEffect(() => {
        let docRef = db.collection("User Profiles").doc(auth.currentUser.uid)
        docRef.get().then(doc => {
            if (doc.exists) {
                setData(doc.data());
            }
        })}, [])

    const createAndSavePDF = async () => {
        try {
            await loadLocalResource(require("../templates/html-resume-master/resume.html"))
                .then((content) => {
                    setHtml(content);
                });
            const {uri} = await Print.printToFileAsync({html: html});
            if (Platform.OS==='ios') {
                await Sharing.shareAsync(uri);
            } else {
                const permission = await MediaLibrary.requestPermissionsAsync();
                if (permission.granted) {
                    await MediaLibrary.createAssetAsync(uri);
                }
            }
        } catch (err) {
            console.log(err);
        }
    }

    const viewFile = async () => {
        try {
            await loadLocalResource(require('../templates/html-resume-master/resume.html'))
                .then((content) => {
                    setHtml(content);
                });
            const {uri} = await Print.printToFileAsync({html: html});
            await FileSystem.getContentUriAsync(uri)
                .then(cUri => {
                    if (Platform.OS === 'android') {
                        IntentLauncher.startActivityAsync('android.intent.action.VIEW', {
                            data: cUri,
                            flags: 1,
                            type: 'application/pdf'
                        })
                    } else {
                        navigation.navigate("HTML Preview",
                                {htmlContent: html,
                                handler: createAndSavePDF,
                                object: data});
                    }
                })
        } catch (err) {
            console.log(err);
        }
    }

    return (
        <View>
            <AppButton title={"Edit information"}
                       handler={() => navigation.navigate("Personal Information",
                           {previous: "Resume Generator"})} />
            <AppButton title={"Choose Template"} handler={() => {}} />
            <AppButton title={"Preview & Download"} handler={viewFile} />
        </View>
    )
}

export default ResumeGeneratorScreen;