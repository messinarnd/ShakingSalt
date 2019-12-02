import React, { useState } from 'react';
import { View, TouchableOpacity, Text, StyleSheet, Platform } from "react-native";
import { ListItem } from 'react-native-elements';
import { Ionicons } from '@expo/vector-icons';

export default AccordionItem = (props) => {
    const { data, title } = props;

    const [isExpanded, setIsExpanded] = useState(false);

    return (
        <View style={{borderBottomColor:"lightgray", borderBottomWidth:1, paddingBottom:18}}>
            <TouchableOpacity style={styles.row} onPress={()=>setIsExpanded(!isExpanded)}>
                <Text style={[styles.title, styles.font]}>{title}</Text>
                {/* is expanded true -> want minus sign to show. is expanded false -> want plus sign to show */}
                <Ionicons style={{color:"gray"}} name={isExpanded ?
                    (Platform.OS === 'ios' ? 'ios-remove' : 'md-remove')
                    : (Platform.OS === 'ios' ? 'ios-add' : 'md-add')} size={20} />
            </TouchableOpacity>
            <View style={styles.parentHr}/>
            {
                isExpanded &&
                (<View style={styles.child}>
                    {Object.keys(data).map((nutrientName, index) => {
                        if (nutrientName != "Energy" && nutrientName != "Sodium, Na") {
                            return (<ListItem key={index} titleStyle={{ color: 'grey', fontSize: 14 }} rightSubtitleStyle={{ color: 'grey', fontSize: 14 }} title={nutrientName} rightSubtitle={(data[nutrientName]["amount"]).toFixed(2) + data[nutrientName]["unit"]} />)
                        }
                    })}
                </View>)
            }
       </View>
    )
}

AccordionItem.navigationOptions = {
    title: 'AccordionItem',
};

const styles = StyleSheet.create({
    title:{
        fontSize: 17,
    },
    row:{
        flexDirection: 'row',
        justifyContent:'space-between',
        height:30,
        paddingTop:12,
        paddingLeft:15,
        paddingRight:10,
        alignItems:'center',
    },
    parentHr:{
        height:1,
        width:'100%'
    },
    child:{
        padding:16,
    }
});