import React, {useEffect, useState} from 'react';
import {
    View,
    StyleSheet,
    Platform,
    StatusBar,
    Modal,
    ScrollView,
    TouchableOpacity,
    Text,
    Image,
    ImageBackground
} from 'react-native';
import nusResume from '../templates/html-resume-master/nusResume.html'
import test from '../templates/html-resume-master/test.html'
import resumeTemplate2 from '../templates/html-resume-master/resumeTemplate2.html';

import * as Print from 'expo-print';
import loadLocalResource from 'react-native-local-resource';
import HTMLScreen from "./HTMLScreen";

import {auth, db} from "../config/Database";
import {LinearProgress} from "react-native-elements";
import Colors from "../config/colors";
import GeneratorCard from "../container/GeneratorCard";

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
            let htmlString;
            await loadLocalResource(resume)
                .then((content) => {
                    setHtml(content);
                    htmlString = content;
                });

            const template = await Print.printToFileAsync({html: htmlString});
            selectTemplate(name, resume);
            navigation.navigate('PDF Preview',
                    {fileUri: template.uri,
                    screenName: "Resume Generator"});

        } catch (err) {
            console.log(err);
        }
    }

    return (
        <ImageBackground source={require('../assets/ImageBackground.png')}
                         style={styles.containerImage}
                         imageStyle={{opacity: 0.7}}>
        <View>
            <Modal visible={templateVisible}>
                <ScrollView contentContainerStyle={styles.containerScrollView} horizontal={true}>
                    <TouchableOpacity style={styles.card}
                                      onPress={() => previewAndSelectTemplate("Template 1", nusResume)}>
                        <Text style={styles.text}>Template 1</Text>
                        <Image style={styles.image} source={require('../assets/nusResume.jpg')} />
                    </TouchableOpacity>
                    <TouchableOpacity style={styles.card}
                                      onPress={() => previewAndSelectTemplate("Template 2", resumeTemplate2)}>
                        <Text style={styles.text}>Template 2</Text>
                        <Image style={styles.image} source={require('../assets/resumeTemplate2.jpg')} />
                    </TouchableOpacity>
                    <TouchableOpacity style={styles.card}
                                      onPress={() => previewAndSelectTemplate("Template 3", test)}>
                        <Text style={styles.text}>Template 3</Text>
                        <Image style={styles.image} source={require('../assets/test.jpg')} />
                    </TouchableOpacity>
                </ScrollView>
            </Modal>
            {showLoading ? <LinearProgress color="primary"/> : <View/> }
            <ScrollView contentContainerStyle={styles.containerButtons}>
                <GeneratorCard handler={() => navigation.navigate("Personal Information")}
                               title={"Edit Information"}
                               imgUrl={require("../assets/editInfo.png")}/>
                <View style={[styles.line, {borderColor: Colors.yellow}]} />
                <GeneratorCard handler={() => {setTemplateVisible(true)}}
                               title={"Choose Template"}
                               imgUrl={require("../assets/choosing.png")}/>
                <View style={[styles.line, {borderColor: Colors.lightpink}]} />
                <GeneratorCard handler={viewFile}
                               title={"Download Resume"}
                               imgUrl={require("../assets/downloadCircle.png")}/>
                <View style={styles.containerText}>
                    <Text style={styles.text}>Selected Resume: {selectedResumeName}</Text>
                </View>

            </ScrollView>
            {view ?
                (<View style={styles.containerModal}>
                    <HTMLScreen visible={isPreviewMode}
                                htmlContent={html}
                                object={data}
                                onDone={togglePreviewHandler}/>
                </View>) : <View/>}
        </View>
        </ImageBackground>
    )
}

const styles = StyleSheet.create({
    card:{
        shadowColor: Colors.grey,
        shadowOffset: {
            width: 5,
            height: 10,
        },
        shadowOpacity: 0.40,
        shadowRadius: 7.5,
        elevation: 15,
        flex: 0,
        height: 500,
        marginHorizontal: 20,
        backgroundColor: Colors.placeholderColor,
        borderRadius: 20,
        alignItems:'center',
        justifyContent:'center',
        flexDirection: 'column',
    },
    containerButtons: {
        marginVertical: 20,
        justifyContent: 'center',
        alignItems: 'center',
    },
    containerImage: {
        flex: 1,
        resizeMode: 'cover',
        justifyContent: 'flex-start',
    },
    containerModal: {
        flex: 1,
        flexDirection: 'column',
        justifyContent: 'center',
        alignItems: 'flex-start',
        marginTop: Platform.OS === 'android' ? StatusBar.currentHeight : 0
    },
    containerScrollView: {
        backgroundColor: Colors.placeholderColor,
        justifyContent: "space-evenly",
        alignItems: "center",
        flex: 0,
        flexDirection: "row"
    },
    containerText: {
      height: 80,
      width: '90%'
    },
    image: {
        width: 300,
        height: 350,
        resizeMode: "contain",
        marginTop: 40,
        shadowColor: Colors.grey,
        shadowOffset: {
            width: 5,
            height: 10,
        },
        shadowOpacity: 0.40,
        shadowRadius: 7.5
    },
    line: {
        height: 50,
        borderWidth: 3,
        borderStyle: "dashed",
        marginVertical: 2
    },
    text: {
        fontSize: 18,
        fontWeight: "700",
        letterSpacing: 3,
        color: Colors.textColor
    }
})

export default ResumeGeneratorScreen;