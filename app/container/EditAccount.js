import React, {useState} from 'react';
import {ImageBackground, SafeAreaView, StyleSheet, Text, View} from "react-native";
import EditListItem from "./EditListItem";
import Colors from "../config/colors";
import AppButton from "./AppButton";
import EditPassword from "../screens/EditPassword";
import EditDetails from "../screens/EditDetails";
import EditPrimaryEmail from "./EditPrimaryEmail";

const EditAccount = ({navigation}) => {
    const [passwordDialogVisible, setPasswordDialogVisible] = useState(false);
    const [detailsDialogVisible, setDetailsDialogVisible] = useState(false);
    const [emailDialogVisible, setEmailDialogVisible] = useState(false);

    const togglePasswordHandler = () => {
        setPasswordDialogVisible(!passwordDialogVisible);
    }

    const toggleDetailsHandler = () => {
        setDetailsDialogVisible(!detailsDialogVisible);
    }

    const toggleEmailHandler = () => {
        setEmailDialogVisible(!emailDialogVisible);
    }

    return (
        <ImageBackground source={require('../assets/ImageBackground.png')}
                         imageStyle={{opacity: 0.75}}
                         style={styles.containerImage}>
            <SafeAreaView style={{flex: 1, alignItems: "center"}}>
                <EditPassword visible={passwordDialogVisible} toggle={togglePasswordHandler} />
                <EditDetails visible={detailsDialogVisible} toggle={toggleDetailsHandler} />
                <EditPrimaryEmail visible={emailDialogVisible} toggle={toggleEmailHandler} />
                <View style={styles.container}>
                    <Text style={styles.header}>Settings</Text>
                    <EditListItem title={"Edit Account Details"} handler={toggleDetailsHandler} />
                    <EditListItem title={"Change Primary Email"} handler={toggleEmailHandler} />
                    <EditListItem title={"Change Password"} handler={togglePasswordHandler} />
                </View>
                <View style={{height: 50, width: 200}}>
                    <AppButton title={"Back to User Profile"} handler={() => navigation.goBack()} />
                </View>
            </SafeAreaView>
        </ImageBackground>
    );
}

export default EditAccount;

const styles = StyleSheet.create({
    container: {
        flex: 0,
        width: "90%",
        marginHorizontal: 20,
        marginVertical: 10,
        justifyContent: "center",
        alignItems: "flex-start",
        borderWidth: 1,
        borderStyle: "solid",
        borderColor: Colors.grey,
        borderRadius: 12,
        shadowColor: Colors.grey,
        shadowOffset: {
            width: 5,
            height: 10,
        }
    },
    containerButton: {
        height: 50,
        width: 300,
        justifyContent: "center",
        alignSelf: "center",
    },
    containerImage: {
        flex: 1,
        resizeMode: 'cover',
        justifyContent: 'center'
    },
    header: {
        padding: 8,
        fontSize: 30,
        fontWeight: "700"
    }
});