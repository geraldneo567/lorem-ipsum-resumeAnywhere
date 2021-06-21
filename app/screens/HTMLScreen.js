import React, {useEffect, useState, useRef, useCallback} from 'react'
import {Platform, SafeAreaView, ScrollView, StyleSheet, useWindowDimensions} from "react-native";
import {Button} from "react-native-elements";

import RenderHtml, {domNodeToHTMLString} from 'react-native-render-html';
import * as Sharing from 'expo-sharing';
import * as Print from "expo-print";
import * as MediaLibrary from "expo-media-library";


// This screen is for IOS app users
const HTMLScreen = ({navigation, route}) => {
    const src = route.params.htmlContent;

    const [htmlString, setHtmlString] = useState('');


    function generateJobs(text, number) {
        const companyNameRegEx = new RegExp(`\{\{companyName${number}\}\}`);
        const jobPositionRegEx = new RegExp(`\{\{jobPosition${number}\}\}`);
        const descriptionRegEx = new RegExp(`\{\{description${number}\}\}`);
        const startDateRegEx = new RegExp(`\{\{startDate${number}\}\}`);
        const endDateRegEx = new RegExp(`\{\{endDate${number}\}\}`);

        text.data = text.data.replace(companyNameRegEx, route.params.object.workExperiences[number - 1].companyName);
        text.data = text.data.replace(jobPositionRegEx, route.params.object.workExperiences[number - 1].jobPosition);
        text.data = text.data.replace(descriptionRegEx, route.params.object.workExperiences[number - 1].description);
        text.data = text.data.replace(startDateRegEx, route.params.object.workExperiences[number - 1].startDate.toDate().toISOString().substring(0, 10));
        text.data = text.data.replace(endDateRegEx, route.params.object.workExperiences[number - 1].endDate.toDate().toISOString().substring(0, 10));
    }

    function generateSkills(text, number) {

    }

    function generateLanguages(text, number) {

    }

    function onText(text) {
        generateJobs(text, 1);
        text.data = text.data.replace(/{{fullName}}/g, route.params.object.displayName);
        text.data = text.data.replace(/{{skill1}}/g, route.params.object.skills[0]);
        text.data = text.data.replace(/{{skill2}}/g, route.params.object.skills[1]);
        text.data = text.data.replace(/{{skill3}}/g, route.params.object.skills[2]);
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
        <SafeAreaView style={styles.container}>
            <ScrollView>
                <RenderHtml source={{html: src}}
                            domVisitors={domVisitors}
                            contentWidth={width}
                            onTTreeChange={updateTTree} />
                <Button title="Save HTML" onPress={createAndSavePDF} />
            </ScrollView>
        </SafeAreaView>
    );

    /*
    return (
        <SafeAreaView style={styles.container}>
            <ScrollView>
                <RenderHtml source={{html: src}}
                            domVisitors={domVisitors}
                            contentWidth={width} />
                <Button title={"Print"} onPress={() => {}} />
                <AppButton title={"Save"} handler={route.params.handler} />
            </ScrollView>
        </SafeAreaView>
    )
     */
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        marginHorizontal: 20
    },
    headerRight: {
        marginHorizontal: 20
    }
});

export default HTMLScreen;

