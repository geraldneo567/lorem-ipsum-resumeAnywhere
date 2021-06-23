import React, {useState} from 'react';
import {StyleSheet, Text, View, Modal, Platform, StatusBar, SafeAreaView, ScrollView} from 'react-native';
import DateTimePicker from '@react-native-community/datetimepicker';
import {Icon, Input} from "react-native-elements";

import AppButton from "../container/AppButton";
import Colors from '../config/colors';

const WorkExperience = (props) => {
    const [companyName, setCompanyName] = useState("");
    const [startDate, setStartDate] = useState(new Date());
    const [endDate, setEndDate] = useState(new Date());
    const [jobPosition, setJobPosition] = useState("");
    const [description, setDescription] = useState("");

    const onStartDateChange = (event, selectedDate) => {
        const currentDate = selectedDate || startDate;
        setStartDate(currentDate);
    }

    const onEndDateChange = (event, selectedDate) => {
        const currentDate = selectedDate || endDate;
        setEndDate(currentDate);
    }

    const experience = {
        companyName,
        startDate,
        endDate,
        jobPosition,
        description
    }

    return (
        <Modal visible={props.visible}
               statusBarTranslucent={true}
               animationType={'slide'}
               supportedOrientations={['portrait', 'landscape']}>

            <SafeAreaView style={styles.container}>
                <View style={{width: '90%', flexDirection: "row", justifyContent: "flex-end"}}>
                    <Icon name={"closecircleo"}
                          type={"antdesign"}
                          color={"red"}
                          onPress={props.onDone}/>
                </View>
                <Text style={styles.title}> Add Work Experience</Text>
                <ScrollView>
                    <Input placeholder="Name of Company"
                           placeholderTextColor={Colors.grey}
                           inputContainerStyle={styles.containerDescription}
                           onChangeText={name => setCompanyName(name)}
                           value={companyName}
                    />
                    <View style={styles.containerDate}>
                        <View style={styles.containerIndivDate}>
                            <Text>Start Date</Text>
                            <DateTimePicker value={startDate}
                                            mode='date'
                                            onChange={onStartDateChange} />
                        </View>
                        <View style={styles.containerIndivDate}>
                            <Text>End Date</Text>
                            <DateTimePicker value={endDate}
                                            mode='date'
                                            onChange={onEndDateChange} />
                        </View>
                    </View>
                    <Input placeholder='Job Position'
                           placeholderTextColor={Colors.grey}
                           inputContainerStyle={styles.containerDescription}
                           onChangeText={job => setJobPosition(job)}
                           value={jobPosition} />
                    <Input inputContainerStyle={styles.containerDescription}
                           label='Describe Work Experience'
                           labelStyle={styles.label}
                           placeholder='Description'
                           placeholderTextColor={Colors.grey}
                           multiline={true}
                           numberOfLines={10}
                           onChangeText={des => setDescription(des)}
                           value={description}
                    />
                    <AppButton title='Done Adding' handler={() => {
                        props.onDone();
                        props.handler(experience);}} />
                </ScrollView>
            </SafeAreaView>
        </Modal>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        flexDirection: 'column',
        justifyContent: 'flex-start',
        alignItems: 'center',
        marginTop: Platform.OS === 'android' ? StatusBar.currentHeight : 0,
        marginHorizontal: 20
    },
    containerDate: {
        flexDirection: 'row',
        justifyContent: 'space-evenly',
        alignItems: 'flex-end',
        marginBottom: 15
    },
    containerIndivDate: {
        paddingHorizontal: 10,
        width: '50%'
    },
    containerDescription: {
        borderStyle: 'solid',
        borderWidth: 1,
        borderRadius: 8,
        paddingHorizontal: 10,
        elevation: 5,
        marginTop: 10
    },
    label: {
        paddingBottom: 5,
        paddingHorizontal: 5,
    },
    title: {
        fontSize: 20,
        fontWeight: 'bold',
        marginVertical: 20,
    }
})

export default WorkExperience;

