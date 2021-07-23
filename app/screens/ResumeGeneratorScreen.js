import React, {useEffect, useState} from 'react';
import {View, StyleSheet, Platform, StatusBar, Modal, ScrollView, TouchableOpacity, Text, Image} from 'react-native';
import nusResume from '../templates/html-resume-master/nusResume.html'
import test from '../templates/html-resume-master/test.html'
import resumeTemplate2 from '../templates/html-resume-master/resumeTemplate2.html';

import * as Print from 'expo-print';
import * as MediaLibrary from 'expo-media-library';
import * as Sharing from 'expo-sharing';
import loadLocalResource from 'react-native-local-resource';
import AppButton from "../container/AppButton";
import HTMLScreen from "./HTMLScreen";

import {auth, db} from "../config/Database";
import {LinearProgress} from "react-native-elements";
import Colors from "../config/colors";

const ResumeGeneratorScreen = ({navigation}) => {
    const [isPreviewMode, setPreviewMode] = useState(false);
    const [html, setHtml] = useState('');
    const [htmlPreview, setHtmlPreview] = useState('');
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

    useEffect(() => {

    }, [html, htmlPreview])

    const togglePreviewHandler = () => {
        setPreviewMode(!isPreviewMode);
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
            await loadLocalResource(resume)
                .then(async (content) => {
                    setHtml(content);
                    setHtmlPreview(content);
                });

            const template = await Print.printToFileAsync({html: htmlPreview});
            selectTemplate(name, resume);
            navigation.navigate('PDF Preview',
                    {fileUri: template.uri,
                    screenName: "Resume Generator"});

        } catch (err) {
            console.log(err);
        }
    }

    return (
        <View>
            <Modal visible={templateVisible}>
                <ScrollView horizontal>

                    <TouchableOpacity style={styles.card}
                                      onPress={() => previewAndSelectTemplate("Template 1", nusResume)}>
                        <Text style={styles.text}>Template 1</Text>
                        <Image style={styles.image} source={require('../assets/nusResume.jpg')} />
                    </TouchableOpacity>
                    <TouchableOpacity style={styles.card}
                                      onPress={() => previewAndSelectTemplate("Template 2", test)}>
                        <Text style={styles.text}>Template 2</Text>
                        <Image style={styles.image} source={require('../assets/resumeTemplate2.jpg')} />
                    </TouchableOpacity>
                    <TouchableOpacity style={styles.card}
                                      onPress={() => previewAndSelectTemplate("Template 3", resumeTemplate2)}>
                        <Text style={styles.text}>Template 3</Text>
                        <Image style={styles.image} source={require('../assets/test.jpg')} />
                    </TouchableOpacity>
                </ScrollView>
            </Modal>
            {showLoading ? <LinearProgress color="primary"/> : <View/> }
            <View style={styles.containerButtons}>
                <AppButton title={"Edit Information"}
                           handler={() => navigation.navigate("Personal Information")} />
                <AppButton title={"Choose Template"} handler={() => {setTemplateVisible(true)}} />
                <AppButton title={"Download as PDF"} handler={viewFile} />
                <Text>Selected Resume: {selectedResumeName}</Text>
            </View>
            {view ?
                (<View style={styles.containerModal}>
                    <HTMLScreen visible={isPreviewMode}
                                htmlContent={html}
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
    image: {
        width: 300, height: 350, resizeMode: "contain", marginTop: 40
    },
    text: {
      fontSize: 30,
      fontWeight: "bold"
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
        height:'90%',
        borderRadius: 20,
        alignItems:'center',
        justifyContent:'center',
        flexDirection: 'column',
    },
})

export default ResumeGeneratorScreen;