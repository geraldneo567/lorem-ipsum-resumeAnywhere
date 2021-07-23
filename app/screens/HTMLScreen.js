import React, {useEffect, useState, useRef, useCallback, useMemo} from 'react'
import {Modal, Platform, SafeAreaView, ScrollView, StyleSheet, Text, useWindowDimensions, View} from "react-native";
import {Header, Icon} from "react-native-elements";

import RenderHtml, {domNodeToHTMLString} from 'react-native-render-html';
import * as Sharing from 'expo-sharing';
import * as Print from "expo-print";
import * as MediaLibrary from "expo-media-library";
import Colors from '../config/colors';
import {auth} from "../config/Database";


const HTMLScreen = (props) => {
    const src = props.htmlContent;

    const [htmlString, setHtmlString] = useState('');

    function generateJobs(text) {
        const workExperiences = props.object.workExperiences;
        for (let i = 0; i < workExperiences.length; i++)
        {
            const companyNameRegEx = new RegExp(`\{\{companyName${i + 1}\}\}`);
            const jobPositionRegEx = new RegExp(`\{\{jobPosition${i + 1}\}\}`);
            const descriptionRegEx = new RegExp(`\{\{description${i + 1}\}\}`);
            const startDateRegEx = new RegExp(`\{\{startDate${i + 1}\}\}`);
            const endDateRegEx = new RegExp(`\{\{endDate${i + 1}\}\}`);

            text.data = text.data.replace(companyNameRegEx,
                workExperiences[i].companyName);
            text.data = text.data.replace(jobPositionRegEx,
                workExperiences[i].jobPosition);
            text.data = text.data.replace(descriptionRegEx,
                workExperiences[i].description);
            text.data = text.data.replace(startDateRegEx,
                workExperiences[i].startDate.toDate().toISOString().substring(0, 10));
            text.data = text.data.replace(endDateRegEx,
                workExperiences[i].endDate.toDate().toISOString().substring(0, 10));
        }
    }

    function generateEducation(text) {
        const education = props.object.education;
        for (let i = 0; i < education.length; i++) {
            const schoolNameRegEx = new RegExp(`\{\{schoolName${i + 1}\}\}`);
            const educationStartDateRegEx = new RegExp(`\{\{educationStartDate${i + 1}\}\}`);
            const educationEndDateRegEx = new RegExp(`\{\{educationEndDate${i + 1}\}\}`);
            const educationLevelRegEx = new RegExp(`\{\{educationLevel${i + 1}\}\}`);
            text.data = text.data.replace(schoolNameRegEx, props.object.education[i].schoolName);
            text.data = text.data.replace(educationStartDateRegEx, props.object.education[i].startDate.toDate().toISOString().substring(0, 10));
            text.data = text.data.replace(educationEndDateRegEx, props.object.education[i].endDate.toDate().toISOString().substring(0, 10));
            text.data = text.data.replace(educationLevelRegEx, props.object.education[i].educationLevel);
        }
    }

    function generateSkills(text, number) {

    }

    function generateLanguages(text, number) {
        const languages = props.object.languages;
        for (let i = 0; i < languages.length; i++) {
            const languageRegEx = new RegExp(`\{\{language${i + 1}\}\}`);
            text.data = text.data.replace(languageRegEx, props.object.languages[i]);
        }
    }

    function onText(text) {
        generateJobs(text);
        generateEducation(text);
        generateLanguages(text);
        text.data = text.data.replace(/{{fullName}}/g, props.object.displayName);
        text.data = text.data.replace(/{{skill1}}/g, props.object.skills[0]);
        text.data = text.data.replace(/{{skill2}}/g, props.object.skills[1]);
        text.data = text.data.replace(/{{skill3}}/g, props.object.skills[2]);
        text.data = text.data.replace(/{{email}}/g, auth.currentUser.email);
        text.data = text.data.replace(/{{phoneNumber}}/g, props.object.phoneNumber);
        text.data = text.data.replace(/{{personalProfile}}/g, props.object.personalProfile);
    }

    const domVisitors = {
        onText: onText
    }

    const { width } = useWindowDimensions();

    const ttreeRef = useRef(null);

    const updateTTree = useCallback((ttree) => {
        ttreeRef.current = ttree;
    }, []);

    const saveHtml = useCallback(() => {
        setHtmlString(domNodeToHTMLString(ttreeRef.current.domNode));
    }, []);

    useEffect(saveHtml, []);

    const createAndSavePDF = async () => {
        try {
            const {uri} = await Print.printToFileAsync({html: htmlString});
            if (Platform.OS==='ios') {
                await Sharing.shareAsync(uri);
            } else {
                const permission = await MediaLibrary.requestPermissionsAsync();
                if (permission.granted) {
                    const promise = await Print.printAsync({
                        orientation: Print.Orientation.portrait,
                        html: htmlString,
                    });
                }
            }
        } catch (err) {
            console.log(err);
        }
    }

    return (
        <Modal visible={props.visible}
               statusBarTranslucent={true}
               animationType={'slide'}
               supportedOrientations={['portrait', 'landscape']}>
            <SafeAreaView>
                <Header
                    leftComponent={<Icon name={"closecircleo"}
                                         type={"antdesign"}
                                         onPress={props.onDone}/>}
                    centerComponent={{text: 'Preview', style: styles.headerTitle}}
                    rightComponent={<Icon name={'export-variant'}
                                          type={'material-community'}
                                          onPress={createAndSavePDF} />} />
                <ScrollView contentContainerStyle={styles.container}>
                    <ScrollView horizontal={true}>
                        <Text>Press the button on top right to download!</Text>
                        <View style={{height: 0}}>
                            <RenderHtml source={{html: src}}
                                        defaultViewProps={{style: {width: width, alignItems: "flex-start", justifyContent: "flex-start"}}}
                                        domVisitors={domVisitors}
                                        enableCSSInlineProcessing={true}
                                        contentWidth={width}
                                        onTTreeChange={updateTTree} />
                        </View>

                    </ScrollView>
                </ScrollView>
            </SafeAreaView>
        </Modal>

    );
}

const styles = StyleSheet.create({
    container: {
        flex: 0,
        flexDirection: 'column',
        marginHorizontal: 20,
    },
    containerRibbon: {
        marginHorizontal: 20,
        flexDirection: "row",
        justifyContent: "space-around",
        alignItems: 'flex-end'
    },
    headerTitle: {
        fontSize: 20,
        color: Colors.white
    }
});

export default HTMLScreen;