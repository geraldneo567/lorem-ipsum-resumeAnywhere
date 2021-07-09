import React, {useLayoutEffect, useState} from 'react';
import {
    StyleSheet,
    Platform,
    StatusBar,
    TouchableOpacity, FlatList, View, Text, Image, SafeAreaView, ImageBackground
} from 'react-native';
import {auth} from "../config/Database"
import Colors from '../config/colors'

export default function HomeScreen({navigation}) {

    const [data, setData] = useState(     [
        {id:1, title: "Resume Generator", image:"https://img.icons8.com/color/70/000000/resume.png",
            screenContainer: "Information Page", screenName: "Resume Generator"},
        {id:1, title: "PS Helper", image:"https://img.icons8.com/ios-filled/50/000000/facilitator.png"},
        {id:2, title: "Resume Guru", image:"https://img.icons8.com/color/70/000000/guru.png"} ,
        {id:3, title: "Edit Information", image:"https://img.icons8.com/color/70/000000/edit.png",
            screenContainer: "Personal Information", screenName: "Personal Information"} ,
    ])

    useLayoutEffect(() =>
            navigation.setOptions({
                headerTitle: "Welcome " + auth.currentUser.displayName
            })
        , [])


    return (
        <ImageBackground source={require('../assets/ImageBackground.png')}
                         imageStyle={{opacity: 0.75}}
                         style={styles.containerImage}>
            <SafeAreaView>
                <FlatList contentContainerStyle={{alignItems: "center", height: '90%'}}
                          data={data}
                          horizontal={false}
                          numColumns={2}
                          keyExtractor= {(item) => {
                              return item.id;
                          }}
                          renderItem={({item}) => {
                              return (
                                  <View>
                                      <TouchableOpacity style={styles.card} onPress={() => navigation.navigate(item.screenContainer, item.screenName)}>
                                          <Image style={styles.cardImage} source={{uri:item.image}}/>
                                      </TouchableOpacity>

                                      <View style={styles.cardHeader}>
                                          <View style={{alignItems:"center", justifyContent:"center"}}>
                                              <Text style={styles.title}>{item.title}</Text>
                                          </View>
                                      </View>

                                  </View>
                              )
                          }}/>
                <View style={{justifyContent: "flex-end"}}>
                    <Text style={{alignSelf: "center"}}> {'\u00A9'} Orbital 2021</Text>
                </View>
            </SafeAreaView>
        </ImageBackground>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        alignItems: 'center',
        justifyContent: 'center',
        marginTop: Platform.OS === "android" ? StatusBar.currentHeight : 0,
    },
    card:{
        shadowColor: Colors.grey,
        shadowOffset: {
            width: 5,
            height: 10,
        },
        shadowOpacity: 0.40,
        shadowRadius: 7.5,
        elevation: 15,
        marginVertical: 20,
        marginHorizontal: 20,
        backgroundColor:"#e2e2e2",
        width:140,
        height:140,
        borderRadius: 20,
        alignItems:'center',
        justifyContent:'center'
    },
    cardImage:{
        height: 50,
        width: 50,
        alignSelf:'center'
    },
    cardHeader: {
        paddingVertical: 0,
        paddingHorizontal: 10,
        borderTopLeftRadius: 1,
        borderTopRightRadius: 1,
        flexDirection: 'row',
        alignItems:"center",
        justifyContent:"center"
    },
    containerImage: {
        flex: 1,
        resizeMode: 'cover',
        justifyContent: 'center'
    },
    title:{
        fontSize:18,
        alignSelf:'center',
        color: Colors.textColor
    },
})