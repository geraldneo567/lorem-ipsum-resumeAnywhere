import React, {useEffect, useState} from 'react'
import {
    Image,
    ImageBackground,
    Platform,
    SafeAreaView,
    StyleSheet,
    Text,
    TouchableOpacity,
    View,
    Modal,
    TextInput
} from 'react-native'
import {auth, db, fb,} from "../config/Database";
import Colors from "../config/colors";
import AppButton from "../container/AppButton";

import * as ImagePicker from 'expo-image-picker';
import InfoListItem from "../container/InfoListItem";
import {Input} from "react-native-elements";



export default function UserProfile() {
    const [hasPermission, setHasPermission] = useState(false);
    const [name, setName] = useState("");
    const [callCode, setCallCode] = useState("+––")
    const [phoneNumber, setPhoneNumber] = useState("");
    const [personalProfile, setPersonalProfile] = useState("");
    const [email, setEmail] = useState("");
    const [imgUrl, setImgUrl] = useState("https://picsum.photos/id/1025/200");
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

    const loadProfileInformation = async () => {
        let docRef = db.collection("User Profiles").doc(auth.currentUser.uid)
        await docRef.get().then(doc => {
            if (doc.exists) {
                setCallCode(doc.data().callCode);
                setPhoneNumber(doc.data().phoneNumber);
                setPersonalProfile(doc.data().personalProfile);
                setEmail(auth.currentUser.email);
                setName(auth.currentUser.displayName);
                if (doc.data().imgUrl) {
                    setImgUrl(doc.data().imgUrl);
                }
            }
            return () => {}
        })
    }

    useEffect(() => {
        (async () => loadProfileInformation())();
            (async () => {
                if (Platform.OS !== 'web') {
                    const {status} = await ImagePicker.requestMediaLibraryPermissionsAsync();
                    if (status !== "granted") {
                        alert("Sorry, we need camera roll permissions to make this work!");
                    }
                }
            })();
        },
        []);

    async function uploadImageAsync(uri) {
        const blob = await new Promise((resolve, reject) => {
            const xhr = new XMLHttpRequest();
            xhr.onload = function () {
                resolve(xhr.response);
            }
            xhr.onerror = function (e) {
                console.log(e);
                reject(new TypeError("Network request failed"));
            }
            xhr.responseType = "blob";
            xhr.open("GET", uri, true);
            xhr.send(null);
        });
        const ref = fb.child("avatar");
        const snapshot = await ref.put(blob);
        blob.close();

        return await snapshot.ref.getDownloadURL();
    }

    const chooseImage = async () => {
        let result = await ImagePicker.launchImageLibraryAsync({
            mediaTypes: ImagePicker.MediaTypeOptions.All,
            allowsEditing: true,
            aspect: [4,3],
            quality: 1
        });

        if (!result.cancelled) {
            const uploadUrl = await uploadImageAsync(result.uri);
            setImgUrl(uploadUrl);
            await db.collection("User Profiles")
                .doc(auth.currentUser.uid)
                .update({imgUrl})
                .then(() => console.log("Done"))
                .catch(error => alert(error));
        }
    };

    return (
        <SafeAreaView style={styles.container}>
            <Modal visible={passwordDialogVisible}>
                <Text style={styles.passwordHeader}>
                    Change Password
                </Text>
                <Input textContentType={"password"} secureTextEntry={true} placeholder={"Enter password"} onChangeText={text => setPassword(text)}/>
                <Input textContentType={"password"} secureTextEntry={true} placeholder={"Re-Enter password"} onChangeText={text => setReEnterPassword(text)}/>
                <AppButton title={"Confirm Change Password"} handler={submitPasswordHandler}></AppButton>

            </Modal>
            <ImageBackground source={require('../assets/ImageBackground.png')}
                             imageStyle={{opacity: 0.80}}
                             style={styles.containerImage}>
            <View style={styles.containerContact}>
                <TouchableOpacity onPress={chooseImage}>
                    <Image style={styles.image}
                           source={{uri: imgUrl}}/>
                </TouchableOpacity>

                <View style={styles.contact}>
                    <Text style={styles.name}>{name || "Test User"}</Text>
                    <Text style={styles.text}>{personalProfile || ""}</Text>
                </View>
            </View>
            </ImageBackground>
            <InfoListItem title="Email"
                          data={email}
                          iconName={"email-outline"} />
            <InfoListItem title="Mobile"
                          data={callCode + " " + phoneNumber}
                          iconName={"phone-outline"} />
            <View style={styles.button}>
                <AppButton title={"Change Password"} handler={changePasswordHandler}/>
            </View>

        </SafeAreaView>
    )
}

const styles = StyleSheet.create({
    button: {
        alignItems: "center",
        justifyContent: 'center',
      width: '100%',
      height: 120
    },
    contact: {
        alignItems: "center",
        marginHorizontal: 30,
        marginVertical: 10
    },
    container: {
        flex: 1,
        flexDirection: 'column',
        justifyContent: 'flex-start',
    },
    containerContact: {
        flex: 0,
        alignItems: "center",
        marginVertical: 30,
        marginHorizontal: 20
    },
    containerImage: {
        flex: 0,
        resizeMode: 'cover',
        justifyContent: 'center'
    },
    header: {
        flex: 0,
        height: 60,
        backgroundColor: Colors.profileHeader
    },
    image: {
        height: 200,
        width: 200,
        resizeMode: "cover",
        borderRadius: 100,
        borderColor: Colors.placeholderColor,
        borderWidth: 5
    },
    passwordHeader: {
      fontSize: 24,
      fontWeight: "400",
      alignSelf: 'center'
    },
    name: {
        fontSize: 24,
        fontWeight: "400"
    },
    text: {
        fontSize: 16,
        color: Colors.grey,
        paddingTop: 15
    },
    input: {
        height: 100,
        width: 100
    }
})
