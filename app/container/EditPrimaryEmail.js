import {Header, Icon, Input} from "react-native-elements";
import {Alert, Modal, SafeAreaView, StyleSheet} from "react-native";
import AppButton from "../container/AppButton";
import React, {useState} from "react";
import {au, auth} from "../config/Database";
import Colors from "../config/colors";

const EditPrimaryEmail = (props) => {
    const [password, setPassword] = useState('');
    const [email, setEmail] = useState(auth.currentUser.email);

    const submitEmailHandler = () => {
        const user = auth.currentUser;
        const credential = au.EmailAuthProvider.credential(
            user.email,
            password
        );
        user.reauthenticateWithCredential(credential)
            .then(() => user.updateEmail(email)
                .then(() => {
                    setPassword('');
                    Alert.alert("Success",
                        "Primary email changed successfully.",
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
    }

    return (
        <Modal visible={props.visible}>
            <Header
                leftComponent={<Icon name={"closecircleo"}
                                     type={"antdesign"}
                                     onPress={props.toggle}/>}
                centerComponent={{text: 'Change Primary Email', style: styles.headerTitle}} />
            <SafeAreaView style={{margin: 20}}>
                <Input placeholder='Email'
                       leftIcon={<Icon name='email'
                                       type='material-community' />}
                       textContentType={'emailAddress'}
                       keyboardType='email-address'
                       onChangeText={text => setEmail(text)}
                       value={email} />
                <Input textContentType={"password"}
                       secureTextEntry={true}
                       placeholder={"Enter your password"}
                       leftIcon={<Icon name='lock'
                                       type='material-community' />}
                       onChangeText={text => setPassword(text)}
                       value={password}/>
                <AppButton title={"Update"} handler={submitEmailHandler}/>
            </SafeAreaView>
        </Modal>
    )
}

export default EditPrimaryEmail;

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