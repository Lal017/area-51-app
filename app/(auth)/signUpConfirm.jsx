import { View, Text, TextInput, TouchableOpacity, KeyboardAvoidingView} from 'react-native';
import { useState } from 'react';
import { useLocalSearchParams } from 'expo-router';
import { AuthStyles } from '../../constants/styles';
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
            style={AuthStyles.page}
        >
            <View style={AuthStyles.container}>
                <Text style={AuthStyles.title}>Confirm Sign Up</Text>
                <View style={AuthStyles.confirmContainer}>
                    <Text style={AuthStyles.description}>Check your email for your trop locksmith verification code!</Text>
                    <View style={AuthStyles.inputWrapper}>
                        <MaterialIcons name='numbers' size={20} style={AuthStyles.icon} />
                        <TextInput
                            placeholder='Verification Code'
                            value={confirmationCode}
                            onChangeText={setCode}
                            autoCapitalize='none'
                            keyboardType='number-pad'
                            style={AuthStyles.input}
                        />
                    </View>
                </View>
                <TouchableOpacity
                    onPress={() => handleSignUpConfirm({username, confirmationCode})}
                    style={AuthStyles.actionButton}
                >
                    <Text style={{color: 'white', textAlign: 'center'}}>Confirm</Text>
                </TouchableOpacity>
                <TouchableOpacity
                    onPress={() => handleResendSignUpCode({username})}
                >
                    <Text style={{textAlign: 'center', color: Colors.text}}>Resend Code</Text>
                </TouchableOpacity>
            </View>
        </KeyboardAvoidingView>
    );
};

export default signUpConfirm;