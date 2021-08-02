import {Header, Icon, Input} from "react-native-elements";
import {Alert, Image, Modal, SafeAreaView, StyleSheet} from "react-native";
import AppButton from "../container/AppButton";
import React, {useState} from "react";
import {au, auth} from "../config/Database";
import Colors from "../config/colors";

const EditPassword = (props) => {
    const [oldPassword, setOldPassword] = useState('');
    const [password, setPassword] = useState('');
    const [reEnterPassword, setReEnterPassword] = useState('');

    const submitPasswordHandler = () => {
        if (password === reEnterPassword) {
            const user = auth.currentUser;
            const credential = au.EmailAuthProvider.credential(
                user.email,
                oldPassword
            );

            user.reauthenticateWithCredential(credential)
                .then(() => user.updatePassword(password)
                    .then(() => {
                        setPassword('');
                        setReEnterPassword('');
                        Alert.alert("Success",
                            "Password changed successfully.",
                            [
                                {
                                    text: "OK",
                                    onPress: props.toggle,
                                    style: 'default'
                                }
                            ]);
                    }).catch((error) => {
                        alert(error);
                    }))
                .catch((error) => {
                    alert(error);
                });
        } else {
            alert("Passwords do not match.")
        }
    }

    return (
        <Modal visible={props.visible}>
            <Header
                leftComponent={<Icon name={"closecircleo"}
                                     type={"antdesign"}
                                     onPress={props.toggle}/>}
                centerComponent={{text: 'Change Password', style: styles.headerTitle}} />
            <Image source={require('../assets/passwordlock.jpg')}
                   style={styles.image}>

            </Image>
            <SafeAreaView style={{marginTop: 40, marginHorizontal: 20}}>
                <Input textContentType={"password"}
                       secureTextEntry={true}
                       placeholder={"Enter old password"}
                       leftIcon={<Icon name='lock'
                                       type='material-community' />}
                       value={oldPassword}
                       onChangeText={text => setOldPassword(text)}/>
                <Input textContentType={"password"}
                       secureTextEntry={true}
                       placeholder={"Enter new password"}
                       leftIcon={<Icon name='lock'
                                       type='material-community' />}
                       value={password}
                       onChangeText={text => setPassword(text)}/>
                <Input textContentType={"password"}
                       secureTextEntry={true}
                       placeholder={"Re-enter password"}
                       leftIcon={<Icon name='lock'
                                       type='material-community' />}
                       value={reEnterPassword}
                       onChangeText={text => setReEnterPassword(text)}/>
                <AppButton title={"Confirm Change Password"} handler={submitPasswordHandler}/>
            </SafeAreaView>
        </Modal>
    )
}

export default EditPassword;

const styles = StyleSheet.create({
    headerTitle: {
        fontSize: 20,
        color: Colors.white
    },
    image: {
        marginTop: 20,
        height: 300,
        width: 300,
        alignSelf: 'center'
    },
});