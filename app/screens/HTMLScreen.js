import React, {useEffect, useState, useRef, useCallback} from 'react'
import {Modal, Platform, SafeAreaView, ScrollView, StyleSheet, useWindowDimensions} from "react-native";
import {Button, Header, Icon} from "react-native-elements";

import RenderHtml, {domNodeToHTMLString} from 'react-native-render-html';
import * as Sharing from 'expo-sharing';
import * as Print from "expo-print";
import * as MediaLibrary from "expo-media-library";
import Colors from '../config/colors';


// This screen is for IOS app users
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

    function generateSkills(text, number) {

    }

    function generateLanguages(text, number) {

    }

    function onText(text) {
        generateJobs(text);
        text.data = text.data.replace(/{{fullName}}/g, props.object.displayName);
        text.data = text.data.replace(/{{skill1}}/g, props.object.skills[0]);
        text.data = text.data.replace(/{{skill2}}/g, props.object.skills[1]);
        text.data = text.data.replace(/{{skill3}}/g, props.object.skills[2]);
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
                    await MediaLibrary.createAssetAsync(uri);
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
                    <RenderHtml source={{html: src}}
                                domVisitors={domVisitors}
                                contentWidth={width}
                                onTTreeChange={updateTTree} />
                    <Button title="Save HTML" onPress={createAndSavePDF} />
                </ScrollView>
            </SafeAreaView>
        </Modal>

    );
}

const styles = StyleSheet.create({
    container: {
        justifyContent: 'center',
        alignItems: 'center',
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

