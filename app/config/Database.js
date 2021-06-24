import firebase from "firebase";
import "firebase/firestore";
import "firebase/auth";

require("firebase/firestore");
//require("firebase/firebase-storage");

const firebaseConfig = {
    apiKey: "AIzaSyBGy4cVSHSDfs-WcSEdzWh4FxwUFujZ-bQ",
    authDomain: "orbital-a9b3a.firebaseapp.com",
    projectId: "orbital-a9b3a",
    storageBucket: "orbital-a9b3a.appspot.com",
    messagingSenderId: "822441343178",
    appId: "1:822441343178:web:69aee3bc2275f4dd475c33",
    measurementId: "G-VEFT39NBRH,"
};

let app;

if (firebase.apps.length === 0) {
    app = firebase.initializeApp(firebaseConfig);
} else {
    app = firebase.app();
}

const db = app.firestore();
const auth = firebase.auth();
const fb = firebase.storage().ref();

const handleImageSave = (image) => {
    const uploadImage = async() => {
        const imageURI = image;
        const path = `post/$firebase.auth().currentUser.uid}/${Math.random().toString(36)}`;

        const response = await fetch(imageURI);
        const blob = await response.blob;

        const task = firebase.storage().ref().child(path).put(blob);
        const taskProgress = snapshot => {
            //For debugging
            console.log(`transferred: ${snapshot.bytesTransferred}`)
        }
        const taskCompleted = () => {
            task.snapshot.ref.getDownloadURL().then((snapshot) => {
                saveImage(snapshot);
                console.log(snapshot);
            })
        }

        const taskError = (snapshot) => {
            console.log(snapshot);
        }

        task.on('state_changes', taskProgress, taskError, taskCompleted);
    }

    const saveImage = (downloadURL) => {
        firebase.firestore()
            .collection('images')
            .doc(firebase.auth().currentUser.uid)
            .collection('userImages')
            .add({
                downloadURL,
                creation: firebase.firestore.FieldValue.serverTimestamp()
            }).then((function () {
                props.navigation.popToTop()
        }))
    }

    return (
        <View style={{flex:1}}>
            <Image source={{uri: image}} />
            <Button title='Upload' onPress={uploadImage} />
        </View>
    )
}

export { db, auth, fb };
