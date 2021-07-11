import React, {useState} from 'react';
import {SafeAreaView, StyleSheet, Text, View} from "react-native";
import Courses from "../config/courses";
import {Picker} from "@react-native-picker/picker";
import Colors from "../config/colors";

const PSHelperScreen = () => {
    const [course, setCourse] = useState('');
    const [index, setIndex] = useState(0);

    return (
        <SafeAreaView>

            <View style={styles.containerCourse}>
                <Text style={styles.courseLabel}>Choose your course</Text>
                <Picker style={styles.picker}
                        itemStyle={styles.courseName}
                        selectedValue={course}
                        mode="dropdown"
                        onValueChange={(itemValue,itemIndex) => {
                            setCourse(itemValue);
                            setIndex(itemIndex);
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

            <View style={styles.label}>
                <Text style={styles.text}>Relevant Skills</Text>
            </View>
            {(!course.localeCompare("")) && (<View style={{flex: 0}}>
                {Courses[index].details.skillsToHave.map(skill => {
                    return (
                        <Text>{skill}</Text>
                    )
                })}
            </View>)}
            <View style={styles.label}>
                <Text style={styles.text}>Relevant Work Experience</Text>
            </View>
            {(!course.localeCompare("")) && (<View style={{flex: 0}}>
                {Courses[index].details.relevantWorkExperience.map(work => {
                    return (
                        <Text>{work}</Text>
                    )
                })}
            </View>)}
        </SafeAreaView>
    )
}

export default PSHelperScreen;

const styles = StyleSheet.create({
    containerCourse: {
        alignItems: "center",
    },
    courseLabel: {
        marginHorizontal: 20,
        padding: 10,
        fontSize: 18,
        color: Colors.grey,
        alignSelf: "flex-start",
        fontWeight: 'bold'
    },
    courseName: {
        fontSize: 20,
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