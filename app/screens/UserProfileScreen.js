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
    ScrollView
} from 'react-native'
import {auth, db, fb,} from "../config/Database";
import Colors from "../config/colors";

import * as ImagePicker from 'expo-image-picker';
import InfoListItem from "../container/InfoListItem";
import {Icon, Input} from "react-native-elements";

export default function UserProfile({navigation}) {
    const [hasPermission, setHasPermission] = useState(false);
    const [name, setName] = useState("");
    const [callCode, setCallCode] = useState("")
    const [phoneNumber, setPhoneNumber] = useState("");
    const [personalProfile, setPersonalProfile] = useState("");
    const [email, setEmail] = useState("");
    const [country, setCountry] = useState("");
    const [imgUrl, setImgUrl] = useState("https://picsum.photos/id/1025/200");
    const [changeName, setChangeName] = useState(false);

    const toggleChangeName = () => {
        setChangeName(!changeName);
    }

    const changeDisplayName = async () => {
        await auth.currentUser.updateProfile({
            displayName: name
        }).then(toggleChangeName);
    }

    const loadProfileInformation = async () => {
        let docRef = db.collection("User Profiles").doc(auth.currentUser.uid)
        await docRef.get().then(doc => {
            if (doc.exists) {
                setCallCode(doc.data().callCode);
                setCountry(doc.data().country);
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
        [email, phoneNumber]);

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
            <ScrollView>
                <ImageBackground source={require('../assets/ImageBackground.png')}
                                 imageStyle={{opacity: 0.80}}
                                 style={styles.containerImage}>
                <View style={styles.containerContact}>
                    <TouchableOpacity onPress={chooseImage}>
                        <Image style={styles.image}
                               source={{uri: imgUrl}}/>
                    </TouchableOpacity>

                    <View style={styles.contact}>
                        {!changeName ?
                            (<View style={styles.containerChangeName}>
                                <Text style={styles.name}>{name || "Test User"}</Text>
                                <Icon style={styles.edit}
                                      name="pencil"
                                      type="material-community"
                                      onPress={toggleChangeName} />
                        </View>)
                            : (<View style={styles.containerChangeName}>
                                <Input style={styles.name}
                                       value={name}
                                       onChangeText={text => setName(text)}/>
                                <Icon name="check"
                                      type="material-community"
                                      onPress={changeDisplayName} />
                            </View>) }
                        <Text style={styles.text}>{personalProfile || ""}</Text>
                    </View>
                </View>
                </ImageBackground>
                <InfoListItem title="Email"
                              data={email}
                              iconName={"email-outline"} />
                <InfoListItem title="Mobile"
                              data={phoneNumber}
                              iconName={"phone-outline"} />
                <InfoListItem title="Country"
                              data={country}
                              iconName={"earth"} />
                <TouchableOpacity onPress={() => navigation.navigate("Settings")}>
                    <InfoListItem title=""
                                  data={"Settings"} iconName={"cog"}/>
                </TouchableOpacity>
            </ScrollView>
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
    containerChangeName: {
        flex: 0,
        flexDirection: "row",
        width: 200,
        justifyContent: "center",
        alignItems: "center",
        marginVertical: 0
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
    },
    headerTitle: {
        fontSize: 20,
        color: Colors.white
    }
})
