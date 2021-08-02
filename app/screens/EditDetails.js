import React, {useEffect, useState} from "react";
import {Alert, Modal, Platform, SafeAreaView, StyleSheet, Text, View} from "react-native";
import {Header, Icon, Input} from "react-native-elements";
import AppButton from "../container/AppButton";
import {auth, db} from "../config/Database";
import Colors from "../config/colors";
import CallingCodes from "../config/CountryCodes";
import {Picker} from "@react-native-picker/picker";

const EditDetails = (props) => {
    const [name, setName] = useState("");
    const [callCode, setCallCode] = useState("")
    const [phoneNumber, setPhoneNumber] = useState("");
    const [country, setCountry] = useState("");

    const loadProfileInformation = async () => {
        let docRef = db.collection("User Profiles").doc(auth.currentUser.uid)
        await docRef.get().then(doc => {
            if (doc.exists) {
                setCallCode(doc.data().callCode);
                setCountry(doc.data().country);
                setPhoneNumber(doc.data().phoneNumber);
                setName(auth.currentUser.displayName);
            }
            return () => {}
        })
    }

    useEffect(() => {(async () => loadProfileInformation())();},
        []);

    const toggleEditAndSaveInfo = async () => {
        const user = auth.currentUser;
        await user.updateProfile({displayName: name});
        await db.collection("User Profiles")
            .doc(auth.currentUser.uid)
            .update({
                callCode,
                country,
                phoneNumber
            }).then(() => {
                Alert.alert("Success",
                    "Details updated.",
                    [
                        {
                            text: "OK",
                            onPress: props.toggle,
                            style: 'default'
                        }
                    ]);
            })
            .catch(e => alert(e));
    }

    return (
        <Modal visible={props.visible}>
            <Header
                leftComponent={<Icon name={"closecircleo"}
                                     type={"antdesign"}
                                     onPress={props.toggle}/>}
                centerComponent={{text: 'Edit Details', style: styles.headerTitle}} />
            <SafeAreaView style={styles.container}>
                <View>
                    <Text style={styles.label}>Name</Text>
                    <Input placeholder={"Name"}
                           value={name}
                           leftIcon={<Icon name='account'
                                           type='material-community' />}
                           onChangeText={text => setName(text)}/>
                </View>
                <View>
                    <Text style={styles.label}>Phone Number</Text>
                    <View style={{flexDirection: 'row'}}>
                        <Input containerStyle={{width: 60}}
                               disabled={true}
                               placeholder={"Calling Code"}
                               value={callCode} />
                        <Input containerStyle={{width: '60%'}}
                               placeholder={"Phone Number"}
                               value={phoneNumber}
                               onChangeText={text => setPhoneNumber(text)}/>
                    </View>
                </View>
                <View style={styles.containerCountry}>
                    <Text style={styles.countryLabel}>Country</Text>
                    <Picker style={styles.picker}
                            itemStyle={styles.countryName}
                            selectedValue={country}
                            mode="dropdown"
                            onValueChange={(itemValue, itemIndex) => {
                                setCallCode(CallingCodes[itemIndex].dial_code);
                                setCountry(itemValue);
                            }}>
                        {CallingCodes.map(country => {
                            return (
                                <Picker.Item key={country.code}
                                             label={country.name + " " + country.dial_code}
                                             value={country.name}/>
                            )
                        })}
                    </Picker>
                </View>
                <AppButton title={"Update details"} handler={toggleEditAndSaveInfo}/>
            </SafeAreaView>
        </Modal>
    )
}

export default EditDetails;

const styles = StyleSheet.create({
    container: {
      margin: 20
    },
    containerCountry: {
        alignItems: "center",
        marginBottom: 50
    },
    countryLabel: {
        padding: 10,
        fontSize: 18,
        color: Colors.grey,
        alignSelf: "flex-start",
        fontWeight: 'bold'
    },
    countryName: {
        fontSize: 20,
    },
    headerTitle: {
        fontSize: 20,
        color: Colors.white
    },
    label: {
        fontSize: 16,
        padding: 8,
        color: Colors.grey,
        fontWeight: '400'
    },
    picker: {
        width: '100%',
        height: Platform.OS === 'android' ? 50 : 200
    }
})