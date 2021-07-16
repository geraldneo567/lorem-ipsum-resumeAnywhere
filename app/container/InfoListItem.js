import React, {useState} from 'react';
import {StyleSheet, Text, View} from "react-native";
import {Icon, Input} from "react-native-elements";
import Colors from "../config/colors";
import {auth, db} from "../config/Database";

const InfoListItem = (props) => {
    const [editMode, setEditMode] = useState(false);
    const [change, setChange] = useState(props.data);

    const toggleEdit = () => {
        setEditMode(!editMode);
    }

    const toggleEditAndSaveInfo = async () => {
        if (props.title === "Email") {
            await auth.currentUser.updateEmail(change.toString() || props.data)
                .then(toggleEdit);
        } else {
            await db.collection("User Profiles")
                .doc(auth.currentUser.uid)
                .update({phoneNumber: change})
                .then(toggleEdit)
                .catch(e => alert(e));
        }
    }

    return (
        <View style={styles.containerInfoWithImg}>
            <Icon name={props.iconName}
                  size={45}
                  type="material-community" />
            <View style={{flexDirection: "row"}}>
                <View style={styles.containerInfo}>
                    {!editMode
                        ? <Text style={styles.info}>{change || props.data}</Text>
                        : <Input value={change || props.data}
                                 onChangeText={text => setChange(text)}/> }
                    <Text style={styles.label}>{props.title}</Text>
                </View>
                {!editMode
                    ? <Icon style={styles.edit}
                            name="pencil"
                            type="material-community"
                            onPress={toggleEdit} />
                    : <Icon style={styles.edit}
                            name="check"
                            type="material-community"
                            onPress={toggleEditAndSaveInfo} /> }
            </View>
        </View>
    )
}

export default InfoListItem;

const styles = StyleSheet.create({
    containerInfo: {
        marginHorizontal: 20,
        width: "75%"
    },
    containerInfoWithImg: {
        flexDirection: "row",
        marginHorizontal: 20,
        marginTop: 15
    },
    edit: {
        alignSelf: "flex-end"
    },
    info: {
        fontSize: 22
    },
    label: {
        fontSize: 16,
        paddingVertical: 8,
        color: Colors.grey,
        fontWeight: '400'
    }
})