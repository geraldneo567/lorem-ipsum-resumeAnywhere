import React from 'react';
import {Tooltip, Icon, Text} from 'react-native-elements';
import {StyleSheet} from "react-native";

import Colors from '../config/colors';

function InfoTooltip(props) {
    return (
        <Tooltip popover={
            <Text>
                Click outside of the box to add individual {props.input}
            </Text>}
        containerStyle={styles.containerTooltip}>
            <Icon name='information-outline'
                  type='material-community' />
        </Tooltip>
    )
}

const styles = StyleSheet.create({
    containerTooltip: {
        flexWrap: "wrap",
        backgroundColor: Colors.tooltipBackground,
        width: 200,
        height: 80,
    }
})

export default InfoTooltip;
