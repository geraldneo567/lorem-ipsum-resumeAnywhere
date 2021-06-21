import React, { useState, useEffect } from 'react';
import {Image, StyleSheet, Text, View} from 'react-native';
import { Camera } from 'expo-camera';
import {Icon} from "react-native-elements";

const CameraScreen = ({navigation}) => {

    const [hasPermission, setHasPermission] = useState(null);
    const [type, setType] = useState(Camera.Constants.Type.back);
    const [image, setImage] = useState(null);
    const [camera, setCamera] = useState(null);

    useEffect(() => {
        (async () => {
            const { status } = await Camera.requestPermissionsAsync();
            setHasPermission(status === 'granted');
        })();
    }, []);

    const takePicture = async() => {
        if (camera) {
            const res = await camera.takePictureAsync(null);
            setImage(res.uri);
        }
    }

    if (hasPermission === null) {
        return <View />;
    }
    if (hasPermission === false) {
        return <Text>No access to camera</Text>;
    }

    return (
        <View style={styles.container}>
            <Camera style={styles.camera}
                    ref = {ref => setCamera(ref)}
                    type={type} />
            <View style={styles.buttonContainer}>
                <Icon
                    reverse
                    name='camera'
                    type='material-community'
                    onPress={() => takePicture()} />
                <Icon
                    reverse
                    name='sync'
                    type='material-community'
                    onPress={() => {
                        setType(
                            type === Camera.Constants.Type.back
                                ? Camera.Constants.Type.front
                                : Camera.Constants.Type.back
                        );
                    }} />
            </View>
            {image && <Image source={{uri: image}} style={styles.image} />}
        </View>
    );
}

const styles = StyleSheet.create({
    buttonContainer: {
        backgroundColor: 'transparent',
        flexDirection: 'row',
        justifyContent: 'space-around',
    },
    camera: {
        flex: 1,
    },
    container: {
        flex: 1,
    },
    image: {
        flex: 1
    }
});

export default CameraScreen;