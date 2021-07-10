import React, {useEffect, useRef, useState} from 'react';
import {
    Alert,
    View,
    Text,
    StyleSheet,
    ScrollView,
    SafeAreaView,
    Platform,
    StatusBar, ImageBackground
} from 'react-native';
import {Icon, Input} from "react-native-elements";
import {auth , db} from "../config/Database"

import Colors from '../config/colors';
import CallingCodes from '../config/CountryCodes';
import WorkExperience from './WorkExperience';
import AppButton from "../container/AppButton";
import ProficiencyChip from "../container/ProficiencyChip"
import InfoTooltip from "../container/InfoTooltip";
import EducationScreen from "./EducationScreen";
import DescriptionContainer from "../container/DescriptionContainer";
import {Picker} from "@react-native-picker/picker";

const PersonalInformationScreen =  ( {navigation} ) => {
    const [isAddWorkExperienceMode, setWorkExperienceMode] = useState(false);
    const [isEducationMode, setEducationMode] = useState(false);
    const [skills, setSkills] = useState([])
    const [skillInput, setSkillInput] = useState('')
    const [languages, setLanguages] = useState([])
    const [languageInput, setLanguageInput] = useState('')
    const [phoneNumber, setPhoneNumber] = useState('')
    const [education, setEducation] = useState([]);
    const [personalProfile, setPersonalProfile] = useState('');
    const [workExperiences, setWorkExperiences] = useState([])
    const [callCode, setCallCode] = useState("+");

    const loadExistingInformation = async () => {

        let docRef = db.collection("User Profiles").doc(auth.currentUser.uid)
        await docRef.get().then(doc => {
            if (doc.exists) {
                setPhoneNumber(doc.data().phoneNumber);
                setSkills(doc.data().skills);
                setLanguages(doc.data().languages);
                setWorkExperiences(doc.data().workExperiences);
                setEducation(doc.data().education);
                setPersonalProfile(doc.data().personalProfile);
            }
            return () => console.log("Done")
        })
    }

    useEffect(() => {(async () => loadExistingInformation())()},
        []);

    const toggleWorkExperienceHandler = () => {
        setWorkExperienceMode(!isAddWorkExperienceMode);
    }

    const toggleEducationHandler = () => {
        setEducationMode(!isEducationMode);
    }

    const alertMessage = () => {
        Alert.alert(
            'Generate Your Resume',
            'Do you want to go to Resume Generator?',
            [
                {
                    text: 'Yes',
                    onPress: () => navigation.navigate("Information Page",
                        {screen: 'Resume Generator'}),
                    AlertButtonStyle: 'default'
                },
                {
                    text: 'No',
                    onPress: () => {},
                    AlertButtonStyle: 'cancel'
                }
            ],
            {cancelable: false}
        )
    }

    const add = async () => {
        await db.collection('User Profiles')
            .doc(auth.currentUser.uid)
            .set({
                displayName: auth.currentUser.displayName,
                phoneNumber: callCode + " " + phoneNumber,
                skills,
                languages,
                education,
                workExperiences,
                personalProfile,
            }).then(alertMessage)
            .catch(error => alert(error))
    }

    const pickerRef = useRef();

    const updateWorkExperiences = (work) => {
        setWorkExperiences([...workExperiences, work]);
    }

    const updateEducation = (edu) => {
        setEducation([...education, edu]);
    }

    const removeSkill = (skill) => {
        setSkills(skills.filter(x => x !== skill));
    }

    const removeLanguage = (language) => {
        setLanguages(languages.filter(x => x !== language));
    }

    const removeWorkExperience = (workExperience) => {
        setWorkExperiences(workExperiences.filter(x => x !== workExperience));
    }

    const removeEducation = (edu) => {
        setEducation(education.filter(x => x !== edu));
    }
    return (
        <ImageBackground source={require('../assets/ImageBackground.png')}
                         style={styles.containerImage}
                         imageStyle={styles.image}>
            <SafeAreaView style={styles.container}>
                <ScrollView>
                    <View style={styles.label}>
                        <Text style={styles.text}>Proficiency</Text>
                        <InfoTooltip input={"skills or languages"}/>
                    </View>

                    <View>
                        <Input inputContainerStyle={styles.containerInput}
                               style={styles.input}
                               placeholder='Skills'
                               placeholderTextColor={Colors.placeholderColor}
                               leftIcon={<Icon name='tools'
                                               type='material-community' />}
                               multiline={true}
                               onChangeText={text => setSkillInput(text)}
                               onEndEditing={() => {
                                   if (skillInput !== "" && !skills.includes(skillInput)) {
                                       setSkills([...skills, skillInput])
                                   }
                                   setSkillInput("")
                               }}
                               value={skillInput}
                        />
                    </View>
                    <Input inputContainerStyle={styles.containerInput}
                           style={styles.input}
                           placeholder='Languages'
                           placeholderTextColor={Colors.placeholderColor}
                           leftIcon={<Icon name='translate'
                                           type='material-community' />}
                           multiline={true}
                           onChangeText={text => setLanguageInput(text)}
                           onEndEditing={() => {
                               if (languageInput !== "" && !languages.includes(languageInput)) {
                                   setLanguages([...languages, languageInput])
                               }
                               setLanguageInput("")
                           }}
                           value={languageInput}/>

                    <View style={styles.label}>
                        <Text style={styles.text}>Contact Information</Text>
                    </View>
                    <View style={styles.containerCountry}>
                        <Text style={styles.countryLabel}>Country</Text>
                        <Picker style={styles.picker}
                                itemStyle={styles.countryName}
                                selectedValue={callCode}
                                mode="dropdown"
                                ref={pickerRef}
                                onValueChange={(itemValue) => setCallCode(itemValue)}>
                            {CallingCodes.map(country => {
                                return (
                                    <Picker.Item key={country.code}
                                                 label={country.name + " " + country.dial_code}
                                                 value={country.dial_code}/>
                                )
                            })}
                        </Picker>
                    </View>

                    <Input inputContainerStyle={styles.containerInput}
                           style={styles.input}
                           placeholder='Phone Number'
                           placeholderTextColor={Colors.placeholderColor}
                           keyboardType={'numeric'}
                           leftIcon={<Icon name='phone'
                                           type='material-community' />}
                           onChangeText={(text) => setPhoneNumber(text)}
                           value={phoneNumber}/>

                    <View style={styles.label}>
                        <Text style={styles.text}>Personal Profile</Text>
                    </View>
                    <Input inputContainerStyle={styles.containerInputBig}
                           inputStyle={styles.input}
                           multiline={true}
                           placeholder='A short description about you'
                           placeholderTextColor={Colors.placeholderColor}
                           keyboardType={'default'}
                           leftIcon={<Icon name='account'
                                           type='material-community' />}
                           onChangeText={(text) => setPersonalProfile(text)}
                           value={personalProfile}/>

                    <View style={styles.label}>
                        <Text style={styles.text}>Added Skills</Text>
                    </View>
                    <View style={styles.containerChip}>
                        {skills.map(skill => {
                            return (
                                <ProficiencyChip title={skill}
                                                 toRemove={skill}
                                                 remove={removeSkill} />
                            )
                        })}
                    </View>

                    <View style={styles.label}>
                        <Text style={styles.text}>Languages</Text>
                    </View>
                    <View style={styles.containerChip}>
                        {languages.map(language => {
                            return (
                                <ProficiencyChip title={language}
                                                 toRemove={language}
                                                 remove={removeLanguage} />
                            )
                        })}
                    </View>

                    <View style={styles.label}>
                        <Text style={styles.text}>Education</Text>
                        <View style={styles.addButton}>
                            <Icon
                                reverse
                                name='plus'
                                type='material-community'
                                size={15}
                                color={Colors.placeholderColor}
                                onPress={toggleEducationHandler} />
                        </View>
                    </View>

                    <View style={styles.containerChip}>
                        {education.map(edu => {
                            if (edu) {
                                const schoolName = edu.schoolName;
                                const level = edu.educationLevel;
                                const start = new Date(edu.startDate.seconds * 1000);
                                const end = new Date(edu.endDate.seconds * 1000);

                                const startDate = isNaN(start.getMonth()) ? edu.startDate.toString() : start.getMonth().toString() + "/" + start.getFullYear().toString();
                                const endDate = isNaN(end.getMonth()) ?  edu.endDate.toString() : end.getMonth().toString() + "/" + end.getFullYear().toString();


                                return (
                                    <DescriptionContainer title={schoolName}
                                                          startDate={startDate}
                                                          endDate={endDate}
                                                          additional={level}
                                                          description={''}
                                                          toRemove={edu}
                                                          remove={removeEducation} />
                                )
                            }
                        })}
                    </View>


                    <View style={styles.containerModal}>
                        <EducationScreen visible={isEducationMode}
                                         onDone={toggleEducationHandler}
                                         handler={updateEducation}/>
                    </View>

                    <View style={styles.label}>
                        <Text style={styles.text}>Work Experiences</Text>
                        <Icon
                            reverse
                            name='plus'
                            type='material-community'
                            size={15}
                            color={Colors.placeholderColor}
                            onPress={toggleWorkExperienceHandler} />
                    </View>


                    <View style={styles.containerChip}>
                        {workExperiences.map(workExperience => {
                            const companyName = workExperience.companyName;
                            const description = workExperience.description;
                            const jobPosition = workExperience.jobPosition;

                            const start = new Date(workExperience.startDate.seconds * 1000);
                            const end = new Date(workExperience.endDate.seconds * 1000);

                            const startDate = isNaN(start.getMonth()) ? workExperience.startDate.toString() : start.getMonth().toString() + "/" + start.getFullYear().toString();
                            const endDate = isNaN(end.getMonth()) ?  workExperience.endDate.toString() : end.getMonth().toString() + "/" + end.getFullYear().toString();
                            return (

                                <DescriptionContainer title={companyName}
                                                      startDate={startDate}
                                                      endDate={endDate}
                                                      additional={jobPosition}
                                                      description={description}
                                                      toRemove={workExperience}
                                                      remove={removeWorkExperience} />
                            )
                        })}
                    </View>
                    <View style={styles.containerModal}>
                        <WorkExperience visible={isAddWorkExperienceMode}
                                        onDone={toggleWorkExperienceHandler}
                                        handler={updateWorkExperiences}/>
                    </View>
                    <View style={styles.addButton}>

                    </View>


                    <View style={styles.containerButton}>
                        <AppButton title={"Save"} handler={add} />
                    </View>
                </ScrollView>
            </SafeAreaView>
        </ImageBackground>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        marginVertical: Platform.OS === 'android' ? StatusBar.currentHeight : 20,
        marginHorizontal: 15
    },
    containerButton: {
        padding: 5,
        alignItems: 'center',
        marginBottom: 100,
        justifyContent: "flex-end"
    },
    containerChip: {
        marginHorizontal: 15,
        flexDirection: 'row',
        flexWrap: 'wrap'
    },
    containerCountry: {
        alignItems: "center",
    },
    containerInput: {
        backgroundColor: Colors.offwhite,
        borderStyle: 'solid',
        borderWidth: 1,
        borderRadius: 20,
        paddingHorizontal: 10
    },
    containerInputBig: {
        flexWrap: "wrap",
        backgroundColor: Colors.offwhite,
        borderStyle: 'solid',
        borderWidth: 1,
        borderRadius: 20,
        padding: 10,
        height: 100,
    },
    containerImage: {
        flex: 1,
        resizeMode: 'cover',
        justifyContent: 'center',
    },
    containerModal: {
        flex: 1,
        flexDirection: 'column',
        justifyContent: 'center',
        alignItems: 'flex-start',
        marginTop: Platform.OS === 'android' ? StatusBar.currentHeight : 0
    },
    countryLabel: {
        marginHorizontal: 20,
        padding: 10,
        fontSize: 18,
        color: Colors.grey,
        alignSelf: "flex-start",
        fontWeight: 'bold'
    },
    countryName: {
        fontSize: 20,
    },
    input: {
        padding: 5
    },
    image: {
        opacity: 0.6
    },
    label: {
        flexDirection: 'row',
        marginVertical: 5,
        marginHorizontal: 20,
        paddingHorizontal: 5
    },
    picker: {
       width: '100%'
    },
    text: {
        fontSize: 20,
        paddingTop: 10
    }
});

export default PersonalInformationScreen;