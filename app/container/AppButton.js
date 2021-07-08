import React from 'react';
import {StyleSheet} from "react-native";
import { Button } from 'react-native-elements';

import Colors from '../config/colors';

const AppButton = (props) => {
    return (
        <Button
            title={props.title}
            onPress={props.handler}
            buttonStyle={styles.button} />
    );
}

const styles = StyleSheet.create({
    button: {
        backgroundColor: Colors.placeholderColor,
    }
})

export default AppButton;