import React, {useState} from 'react';
import {Image, Modal, StyleSheet, Text, View} from "react-native";
import EditListItem from "./EditListItem";
import Colors from "../config/colors";
import AppButton from "./AppButton";
import {auth, db} from "../config/Database";
import {Header, Icon, Input} from "react-native-elements";

const EditAccount = ({navigation, route}) => {
    const [passwordDialogVisible, setPasswordDialogVisible] = useState(false);
    const [password, setPassword] = useState('')
    const [reEnterPassword, setReEnterPassword] = useState('')

    const changePasswordHandler = () => {
        setPasswordDialogVisible(true);
    }

    const submitPasswordHandler = () => {
        if (password === reEnterPassword) {
            const user = auth.currentUser;
            user.updatePassword(password).then(() => {
                setPassword('');
                setReEnterPassword('');
                setPasswordDialogVisible(false)
                alert("Password changed successfully.")
            }).catch((error) => {
                alert(error);
            });
        } else {
            alert("Passwords do not match.")
        }
    }

    /*
    const toggleEditAndSaveInfo = async () => {
        if (props.title === "Email") {
            await auth.currentUser.updateEmail(change.toString())
                .then(toggleEdit)
                .catch(e => alert(e));
        } else {
            await db.collection("User Profiles")
                .doc(auth.currentUser.uid)
                .update({phoneNumber: change})
                .then(toggleEdit)
                .catch(e => alert(e));
        }
    }
     */

    return (
        <View style={{flex: 1, alignItems: "center"}}>
            <Modal visible={passwordDialogVisible}>
                <Header
                    leftComponent={<Icon name={"closecircleo"}
                                         type={"antdesign"}
                                         onPress={() => setPasswordDialogVisible(false)}/>}
                    centerComponent={{text: 'Change Password', style: styles.headerTitle}} />
                <Image source={require('../assets/passwordlock.jpg')} style={{marginTop: 20, height: 300, width: 300, alignSelf: 'center'}}>

                </Image>
                <View style={{marginTop: 40}}>
                    <Input textContentType={"password"} secureTextEntry={true} placeholder={"Enter new password"} onChangeText={text => setPassword(text)}/>
                    <Input textContentType={"password"} secureTextEntry={true} placeholder={"Re-enter password"} onChangeText={text => setReEnterPassword(text)}/>
                    <AppButton title={"Confirm Change Password"} handler={submitPasswordHandler}/>
                </View>
            </Modal>

            <View style={styles.container}>
                <Text style={styles.header}>Settings</Text>
                <EditListItem title={"Edit Account Details"} handler={changePasswordHandler} />
                <EditListItem title={"Change Password"} handler={changePasswordHandler} />
            </View>
            <View style={{height: 50, width: 200}}>
                <AppButton title={"Back to User Profile"} handler={() => navigation.goBack()} />
            </View>

        </View>

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
    header: {
        padding: 8,
        fontSize: 30,
        fontWeight: "700"
    }
});