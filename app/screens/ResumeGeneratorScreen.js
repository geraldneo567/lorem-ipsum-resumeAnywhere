import React, {useEffect, useState} from 'react';
import {View, StyleSheet, Platform, StatusBar} from 'react-native';

import * as Print from 'expo-print';
import * as MediaLibrary from 'expo-media-library';
import * as FileSystem from 'expo-file-system';
import * as IntentLauncher from 'expo-intent-launcher';
import * as Sharing from 'expo-sharing';
import loadLocalResource from 'react-native-local-resource';
import AppButton from "../container/AppButton";
import HTMLScreen from "./HTMLScreen";

import {auth, db} from "../config/Database";
import {LinearProgress} from "react-native-elements";

const ResumeGeneratorScreen = ({navigation}) => {
    const [isPreviewMode, setPreviewMode] = useState(false);
    const [html, setHtml] = useState('');
    const [data, setData] = useState(null);
    const [view, setView] = useState(false);
    const [showLoading, setShowLoading] = useState(false);

    useEffect(() => {
        let docRef = db.collection("User Profiles").doc(auth.currentUser.uid)
<<<<<<< HEAD

        loadLocalResource(require('../templates/html-resume-master/test.html'))
            .then((content) => {
                setHtml(content);
            });

        docRef.onSnapshot(snapshot => {
            if (snapshot.exists) {
                setData(snapshot.data());
            }
        })
       }, [])
=======
        docRef.get().then(doc => {
            if (doc.exists) {
                setData(doc.data());
            }
        })}, [])
>>>>>>> 2d756d5 (Revert "Merge 2 branches on document tests")

    const togglePreviewHandler = () => {
        setPreviewMode(!isPreviewMode);
    }

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
        setShowLoading(true);
        try {
            await loadLocalResource(require('../templates/html-resume-master/resume.html'))
                .then((content) => {
                    setHtml(content);
                });
            const {uri} = await Print.printToFileAsync({html: html});
            await FileSystem.getContentUriAsync(uri)
                .then(cUri => {
                        setPreviewMode(true);
                        setView(true);
                        setShowLoading(false);
                })
        } catch (err) {
            console.log(err);
        }
    }

    return (
        <View>
            {showLoading ? <LinearProgress color="primary"/> : <View/> }
            <View style={styles.containerButtons}>
                <AppButton title={"Edit information"}
                           handler={() => navigation.navigate("Personal Information",
                               {previous: "Resume Generator"})} />
                <AppButton title={"Choose Template"} handler={() => {}} />
                <AppButton title={"Preview & Download"} handler={viewFile} />
            </View>
            {view ?
                (<View style={styles.containerModal}>
                    <HTMLScreen visible={isPreviewMode}
                                htmlContent={html}
                                handler={createAndSavePDF}
                                object={data}
                                onDone={togglePreviewHandler}/>
                </View>) : <View/>}
        </View>
    )
}

const styles = StyleSheet.create({
    containerButtons: {
        marginVertical: 20,
        justifyContent: 'center',
        alignItems: 'center',
    },
    containerModal: {
        flex: 1,
        flexDirection: 'column',
        justifyContent: 'center',
        alignItems: 'flex-start',
        marginTop: Platform.OS === 'android' ? StatusBar.currentHeight : 0
    },
})

export default ResumeGeneratorScreen;