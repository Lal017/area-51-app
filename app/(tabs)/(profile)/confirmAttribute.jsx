import { View, Text, TextInput, TouchableOpacity } from 'react-native';
import { ProfileStyles } from '../../../constants/styles';
import { useState } from 'react';
import { handleConfirmUserAttribute } from '../../../components/authComponents';

const ConfirmAttribute = () =>
{
    const [ code, setCode ] = useState();

    return(
        <View style={ProfileStyles.page}>
            <View style={ProfileStyles.textContainer}>
                <Text style={ProfileStyles.title}>Confirm email</Text>
                <TextInput
                    placeholder="code"
                    value={code}
                    onChangeText={setCode}
                    keyboardType='number-pad'
                    style={ProfileStyles.input}
                />
                <TouchableOpacity
                    onPress={() => handleConfirmUserAttribute({
                        userAttributeKey: 'email',
                        confirmationCode: code
                    })}
                    style={ProfileStyles.actionButton}>
                    <Text style={{color: 'white', textAlign: 'center'}}>Confirm</Text>
                </TouchableOpacity>
            </View>
        </View>
    );
};

export default ConfirmAttribute;