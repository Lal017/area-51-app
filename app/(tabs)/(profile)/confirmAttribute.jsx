import { View, Text, TextInput, TouchableOpacity } from 'react-native';
import { Styles } from '../../../constants/styles';
import { useState } from 'react';
import { handleConfirmUserAttribute } from '../../../components/authComponents';
import { MaterialIcons } from '@expo/vector-icons';
import Colors from '../../../constants/colors';
import { Background } from '../../../components/components';

const ConfirmAttribute = () =>
{
    const [ code, setCode ] = useState();

    return(
        <Background>
            <View style={Styles.block}>
                <View style={Styles.infoContainer}>
                    <Text style={Styles.subTitle}>Confirm Email</Text>
                    <Text style={Styles.text}>Check your email for your verification code</Text>
                </View>
                <View style={Styles.inputWrapper}>
                    <MaterialIcons name='numbers' size={20} style={Styles.icon} />
                    <TextInput
                        placeholder="code"
                        placeholderTextColor={Colors.text}
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
        </Background>
    );
};

export default ConfirmAttribute;