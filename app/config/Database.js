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
const au = firebase.auth;

export { db, au, auth, fb };
