import React, {useRef, useState} from 'react';
import {ImageBackground, Platform, SafeAreaView, StyleSheet, Text, View} from "react-native";
import Courses from "../config/courses";
import {Picker} from "@react-native-picker/picker";
import Colors from "../config/colors";
import PSHelperListItem from "../container/PSHelperListItem";

const PSHelperScreen = () => {
    const [course, setCourse] = useState('');
    const [index, setIndex] = useState(0);

    const pickerRef = useRef();

    return (
        <ImageBackground source={require('../assets/ImageBackground.png')}
                         imageStyle={{opacity: 0.75}}
                         style={styles.containerImage}>
            <SafeAreaView>
                <View style={styles.containerCourse}>
                    <Text style={styles.courseLabel}>Choose your course</Text>
                    <Picker style={styles.picker}
                            ref={pickerRef}
                            enabled={true}
                            itemStyle={styles.courseName}
                            selectedValue={course}
                            mode="dropdown"
                            onValueChange={(itemValue,itemIndex) => {
                                setCourse(itemValue || course);
                                setIndex(itemIndex || index);
                            }}>
                        {Courses.map(course => {
                            return (
                                <Picker.Item key={course.courseName}
                                             label={course.courseName}
                                             value={course.courseName}/>
                            )
                        })}
                    </Picker>
                </View>
                <View style={styles.info}>
                    <View style={styles.label}>
                        <Text style={styles.text}>Relevant Skills</Text>
                    </View>
                    {!(course === "") && (<View style={styles.listItems}>
                        {Courses[index].details.skillsToHave.map((skill, ind) => {
                            return (
                                <PSHelperListItem key={skill + ind} item={skill}/>
                            )
                        })}
                    </View>)}
                    <View style={styles.label}>
                        <Text style={styles.text}>Relevant Work Experience</Text>
                    </View>
                    {!(course === "") && (<View style={styles.listItems}>
                        {Courses[index].details.relevantWorkExperience.map((work, ind) => {
                            return (
                                <PSHelperListItem key={work + ind} item={work}/>
                            )
                        })}
                    </View>)}
                </View>
            </SafeAreaView>
        </ImageBackground>
    )
}

export default PSHelperScreen;

const styles = StyleSheet.create({
    containerCourse: {
        flex: 0,
        margin: 20,
        alignItems: "center",
    },
    containerImage: {
        flex: 1,
        resizeMode: 'cover',
    },
    courseLabel: {
        padding: 10,
        fontSize: 18,
        color: Colors.grey,
        alignSelf: "flex-start",
        fontWeight: 'bold'
    },
    courseName: {
        fontSize: 20,
        borderRadius: 15,
        borderWidth: 0.4,
        borderColor: Colors.placeholderColor
    },
    info: {
        marginHorizontal: 20,
        alignItems: "flex-start",
        justifyContent: "center"
    },
    label: {
        flexDirection: 'row',
        marginVertical: 5,
    },
    listItems: {
        flexDirection: "row",
        flexWrap: "wrap",
        alignItems: "center",
        justifyContent: "flex-start"
    },
    picker: {
        width: '100%',
        height: Platform.OS === "android" ? 50 : 200,
    },
    text: {
        fontSize: 20,
        paddingTop: 10,
        fontWeight: "600"
    }
});