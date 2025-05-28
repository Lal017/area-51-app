import { View, Text, TextInput, TouchableOpacity } from 'react-native';
import { Styles } from '../../../constants/styles';
import { useState } from 'react';
import { handleConfirmUserAttribute } from '../../../components/authComponents';
import { MaterialIcons } from '@expo/vector-icons';

const ConfirmAttribute = () =>
{
    const [ code, setCode ] = useState();

    return(
        <View style={[Styles.page, {rowGap: 25}]}>
            <View style={[Styles.block, {paddingTop: '50%'}]}>
                <Text style={Styles.subTitle}>Confirm email</Text>
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
    );
};

export default ConfirmAttribute;