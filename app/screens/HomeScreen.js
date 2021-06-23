import React, {useLayoutEffect} from 'react';
import {
    StyleSheet,
    SafeAreaView,
    ImageBackground,
    Platform,
    StatusBar,
    Button
} from 'react-native';
import {auth} from "../config/Database"

export default function HomeScreen({navigation}) {

<<<<<<< HEAD

    const [data, setData] = useState(     [
        {id:1, title: "Resume Generator", image:"https://img.icons8.com/color/70/000000/resume.png",
            screenContainer: "Information Page", screenName: "Resume Generator"},
        {id:1, title: "PS Helper", image:"https://img.icons8.com/ios-filled/50/000000/facilitator.png"},
        {id:2, title: "Resume Guru", image:"https://img.icons8.com/color/70/000000/guru.png"} ,
        {id:3, title: "Edit Information", image:"https://img.icons8.com/color/70/000000/edit.png",
            screenContainer: "Personal Information", screenName: "Personal Information"} ,
    ])

=======
>>>>>>> 2d756d5 (Revert "Merge 2 branches on document tests")
    useLayoutEffect(() =>
        navigation.setOptions({
            headerTitle: "Welcome " + auth.currentUser.displayName
        })
    , [])

    return (
        <ImageBackground style={styles.background}
                         source={require('../assets/background.jpg')}
                         opacity={0.3}
                         blurRadius={8} >
            <SafeAreaView style={styles.container}>
                <Button title={"Resume Generator"}
                        onPress={() => navigation.navigate("Information Page", {screen: 'Resume Generator'})}/>
            </SafeAreaView>
        </ImageBackground>
    );
}

const styles = StyleSheet.create({
    background: {
        width: '100%',
        height: '100%'
    },
    container: {
        flex: 1,
        alignItems: 'center',
        justifyContent: 'center',
        marginTop: Platform.OS === "android" ? StatusBar.currentHeight : 0
    }
})