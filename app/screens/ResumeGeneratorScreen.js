import React, {useEffect, useState} from 'react';
import {View, StyleSheet, Platform, StatusBar, Modal, ScrollView, TouchableOpacity, Text, Image} from 'react-native';
import nusResume from '../templates/html-resume-master/nusResume.html'
import test from '../templates/html-resume-master/test.html'

import * as Print from 'expo-print';
import * as MediaLibrary from 'expo-media-library';
import * as Sharing from 'expo-sharing';
import loadLocalResource from 'react-native-local-resource';
import AppButton from "../container/AppButton";
import HTMLScreen from "./HTMLScreen";

import {auth, db} from "../config/Database";
import {LinearProgress} from "react-native-elements";
import Colors from "../config/colors";
import * as IntentLauncher from "expo-intent-launcher";

const ResumeGeneratorScreen = ({navigation}) => {
    const [isPreviewMode, setPreviewMode] = useState(false);
    const [html, setHtml] = useState('');
    const [data, setData] = useState(null);
    const [view, setView] = useState(false);
    const [showLoading, setShowLoading] = useState(false);
    const [templateVisible, setTemplateVisible] = useState(false);
    const [selectedResume, setSelectedResume] = useState(nusResume);
    const [selectedResumeName, setSelectedResumeName] = useState('')

    useEffect(() => {
        let docRef = db.collection("User Profiles").doc(auth.currentUser.uid)

        loadLocalResource(selectedResume)
            .then((content) => {
                setHtml(content);
            });

        docRef.onSnapshot(snapshot => {
            if (snapshot.exists) {
                setData(snapshot.data());
            }
        })
    }, [selectedResume])

    const togglePreviewHandler = () => {
        setPreviewMode(!isPreviewMode);
    }

    const createAndSavePDF = async () => {
        try {
            await loadLocalResource(selectedResume)
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
            await loadLocalResource(selectedResume)
                .then((content) => {
                    setHtml(content);
                });
            setPreviewMode(true);
            setView(true);
            setShowLoading(false);
        } catch (err) {
            console.log(err);
        }
    }

    const selectTemplate = (name, template) => {
        setSelectedResumeName(name);
        setSelectedResume(template);
        setTemplateVisible(!templateVisible);
    }

    const previewAndSelectTemplate = async (name, resume) => {
        try {
            let htmlString;
            await loadLocalResource(resume)
                .then(async (content) => {
                    htmlString=content;
                });
            console.log(htmlString);
            const template = await Print.printToFileAsync({html: htmlString});
            selectTemplate(name, resume);
            if (Platform.OS === 'android') {
                await IntentLauncher.startActivityAsync('android.intent.action.VIEW', {
                    data: template.uri,
                    flags: 1,
                });
            } else {
                navigation.navigate('PDF Preview',
                    {fileUri: template.uri,
                    screenName: "Resume Generator"});
            }
        } catch (err) {
            console.log(err);
        }
    }

    return (
        <View>
            <Modal visible={templateVisible}>
                <ScrollView>
                    <TouchableOpacity style={styles.card}
                                      onPress={() => previewAndSelectTemplate("nusResume", nusResume)}>
                        <Text>nusResume</Text>
                    </TouchableOpacity>
                    <TouchableOpacity style={styles.card}
                                      onPress={() => previewAndSelectTemplate("test", test)}>
                        <Text style={{width: 50, height: 50}}>test</Text>
                        <Image style={{width: 200, height: 250}} source={require('../assets/test.jpg')} />
                    </TouchableOpacity>
                </ScrollView>
            </Modal>
            {showLoading ? <LinearProgress color="primary"/> : <View/> }
            <View style={styles.containerButtons}>
                <AppButton title={"Edit information"}
                           handler={() => navigation.navigate("Personal Information")} />
                <AppButton title={"Choose Template"} handler={() => {setTemplateVisible(true)}} />
                <AppButton title={"Preview & Download"} handler={viewFile} />
                <Text>Selected Resume: {selectedResumeName}</Text>
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
    card:{
        shadowColor: Colors.grey,
        shadowOffset: {
            width: 5,
            height: 10,
        },
        shadowOpacity: 0.40,
        shadowRadius: 7.5,
        elevation: 15,
        marginVertical: 20,
        marginHorizontal: 20,
        backgroundColor:'rgba(87,187,213,0.98)',
        width:300,
        height:300,
        borderRadius: 20,
        alignItems:'center',
        justifyContent:'center',
        flexDirection: 'row',
    },
})

export default ResumeGeneratorScreen;