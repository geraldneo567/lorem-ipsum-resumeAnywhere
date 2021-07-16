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
                            <Text key={skill + ind}>{skill}</Text>
                        )
                    })}
                </View>)}
                <View style={styles.label}>
                    <Text style={styles.text}>Relevant Work Experience</Text>
                </View>
                {!(course === "") && (<View style={styles.listItems}>
                    {Courses[index].details.relevantWorkExperience.map((work, ind) => {
                        return (
                            <Text key={work + ind}>{work}</Text>
                        )
                    })}
                </View>)}
            </View>
        </SafeAreaView>
    )
}

export default PSHelperScreen;

const styles = StyleSheet.create({
    containerCourse: {
        margin: 20,
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

    },
    picker: {
        width: '100%'
    },
    text: {
        fontSize: 20,
        paddingTop: 10
    }
});