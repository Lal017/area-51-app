import { View, Text, TextInput, TouchableOpacity } from 'react-native';
import { Styles } from '../../constants/styles';
import { useState } from 'react';
import { handleConfirmUserAttribute } from '../../components/authComponents';
import { MaterialIcons } from '@expo/vector-icons';

const ConfirmAttribute = () =>
{
    const [ code, setCode ] = useState();

    return(
        <View style={Styles.page}>
            <View style={Styles.container}>
                <Text style={Styles.title}>Confirm email</Text>
                <View style={Styles.inputWrapper}>
                    <MaterialIcons name='numbers' size={20} style={Styles.icon} />
                    <TextInput
                        placeholder="code"
                        value={code}
                        onChangeText={setCode}
                        keyboardType='number-pad'
                        style={Styles.input}
                    />
                </View>
                <TouchableOpacity
                    onPress={() => handleConfirmUserAttribute({
                        userAttributeKey: 'email',
                        confirmationCode: code
                    })}
                    style={Styles.actionButton}>
                    <Text style={Styles.actionText}>Confirm</Text>
                </TouchableOpacity>
            </View>
        </View>
    );
};

export default ConfirmAttribute;