import { View, Text, TextInput, TouchableOpacity, KeyboardAvoidingView, StatusBar} from 'react-native';
import { useState } from 'react';
import { useLocalSearchParams } from 'expo-router';
import { Styles } from '../../constants/styles';
import { handleSignUpConfirm, handleResendSignUpCode } from '../../components/authComponents';
import Colors from '../../constants/colors';
import { MaterialIcons } from '@expo/vector-icons';

const signUpConfirm = () =>
{
    const { username } = useLocalSearchParams();
    const [confirmationCode, setCode] = useState();

    return (
        <KeyboardAvoidingView
            behavior='padding'
            style={[Styles.page, {justifyContent: 'center'}]}
        >
            <View style={Styles.container}>
                <Text style={Styles.title}>Confirm Sign Up</Text>
                <Text style={[Styles.text, {width: '85%', textAlign: 'center'}]}>Check your email for your verification code!</Text>
                <View style={Styles.inputWrapper}>
                    <MaterialIcons name='numbers' size={20} style={Styles.icon} />
                    <TextInput
                        placeholder='Verification Code'
                        value={confirmationCode}
                        onChangeText={setCode}
                        autoCapitalize='none'
                        keyboardType='number-pad'
                        style={Styles.input}
                    />
                </View>
                <TouchableOpacity
                    onPress={() => handleSignUpConfirm({username, confirmationCode})}
                    style={Styles.actionButton}
                >
                    <Text style={Styles.actionText}>Confirm</Text>
                </TouchableOpacity>
                <TouchableOpacity
                    onPress={() => handleResendSignUpCode({username})}
                    style={[Styles.actionButton, {backgroundColor: Colors.secondary}]}
                >
                    <Text style={Styles.actionText}>Resend Code</Text>
                </TouchableOpacity>
            </View>
        </KeyboardAvoidingView>
    );
};

export default signUpConfirm;