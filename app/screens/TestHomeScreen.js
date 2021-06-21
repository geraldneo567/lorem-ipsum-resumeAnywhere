// Example of GridView using FlatList in React Native
// https://aboutreact.com/example-of-gridview-using-flatlist-in-react-native/

// import React in our code
import React, {useState} from 'react';

// import all the components we are going to use
import {
    SafeAreaView,
    StyleSheet,
    View,
    FlatList
} from 'react-native';
import {Icon} from "react-native-elements";

const App = () => {
    const [dataSource, setDataSource] = useState([]);

    useState(() => {
        let items = Array.apply(null, Array(8)).map((v, i) => {
            return {
                id: i,
                src: 'http://placehold.it/200x200?text=' + (i + 1)
            };
        });
        setDataSource(items);
    }, []);

    return (
        <SafeAreaView style={styles.container}>
            <FlatList
                data={dataSource}
                renderItem={({item}) => (
                    <View
                        style={{
                            flex: 1,
                            flexDirection: 'column',
                            margin: 1
                        }}>
                        <Icon name='home'
                              type='material-community'
                              size={100}
                              color={'black'}/>
                    </View>
                )}
                //Setting the number of column
                numColumns={4}
                keyExtractor={(item, index) => index}
            />
        </SafeAreaView>
    );
};
export default App;

const styles = StyleSheet.create({
    container: {
        flex: 1,
        justifyContent: 'center',
        backgroundColor: 'white',
    },
    imageThumbnail: {
        justifyContent: 'center',
        alignItems: 'center',
        height: 100,
    },
});