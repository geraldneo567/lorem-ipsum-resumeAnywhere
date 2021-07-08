import React from 'react';
import {View} from "react-native";
import {Chip} from 'react-native-elements';
import Colors from "../config/colors";

function ProficiencyChip(props) {
    return (
        <View style={{padding: 5}}>
            <Chip
                title={props.title}
                buttonStyle={{backgroundColor: Colors.placeholderColor}}
                icon={{
                    name: "close",
                    type: "font-awesome",
                    size: 20,
                    color: Colors.menu,
                    onPress: () => props.remove(props.toRemove)
                }}
                iconRight
            />
        </View>
    );
}

export default ProficiencyChip;