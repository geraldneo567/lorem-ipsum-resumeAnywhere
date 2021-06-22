import React, {useEffect, useState} from 'react';
import {
    Alert,
    View,
    Text,
    StyleSheet,
    ScrollView,
    SafeAreaView,
    Platform,
    StatusBar} from 'react-native';
import {Icon, Input} from "react-native-elements";
import {auth , db} from "../config/Database"

import Colors from '../config/colors';
import WorkExperience from './WorkExperience';
import AppButton from "../container/AppButton";
import ProficiencyChip from "../container/ProficiencyChip"
import InfoTooltip from "../container/InfoTooltip";
import EducationScreen from "./EducationScreen";
import DescriptionContainer from "../container/DescriptionContainer";

const PersonalInformationScreen =  ( {navigation} ) => {
    const [isAddWorkExperienceMode, setWorkExperienceMode] = useState(false);
    const [isEducationMode, setEducationMode] = useState(false);
    const [skills, setSkills] = useState([])
    const [skillInput, setSkillInput] = useState('')
    const [languages, setLanguages] = useState([])
    const [languageInput, setLanguageInput] = useState('')
    const [phoneNumber, setPhoneNumber] = useState('')
    const [education, setEducation] = useState([]);
    const [workExperiences, setWorkExperiences] = useState([])

    const loadExistingInformation = async () => {
        let docRef = db.collection("User Profiles").doc(auth.currentUser.uid)
        await docRef.get().then(doc => {
            if (doc.exists) {
                setPhoneNumber(doc.data().phoneNumber);
                setSkills(doc.data().skills);
                setLanguages(doc.data().languages);
                setWorkExperiences(doc.data().workExperiences);
                setEducation(doc.data().education);
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
                    onPress: () => navigation.navigate('Resume Generator'),
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
                phoneNumber,
                skills,
                languages,
                education,
                workExperiences
        }).then(() => alertMessage())
            .catch(error => alert(error))
    }

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
                       const schoolName = edu.schoolName;
                       const level = edu.educationLevel;
                       const startDate = edu.startDate.toDate().toISOString().substring(0, 10);
                       const endDate = edu.endDate.toDate().toISOString().substring(0, 10);

                       return (
                           <DescriptionContainer title={schoolName}
                                                 startDate={startDate}
                                                 endDate={endDate}
                                                 additional={level}
                                                 description={''}
                                                 toRemove={edu}
                                                 remove={removeEducation} />
                       )
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
                       const string = JSON.stringify(workExperience,null,'\t')

                       return (
                               <ProficiencyChip title={string}
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
   );
}

const styles = StyleSheet.create({
    addButton: {

    },
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
    containerInput: {
        borderStyle: 'solid',
        borderWidth: 1,
        borderRadius: 20,
        paddingHorizontal: 10
    },
    containerModal: {
        flex: 1,
        flexDirection: 'column',
        justifyContent: 'center',
        alignItems: 'flex-start',
        marginTop: Platform.OS === 'android' ? StatusBar.currentHeight : 0
    },
    input: {
        padding: 5,
    },
    label: {
        flexDirection: 'row',
        marginVertical: 5,
        marginHorizontal: 15,

    },
    text: {
        fontSize: 20,
        paddingTop: 10,
    }
});

export default PersonalInformationScreen;