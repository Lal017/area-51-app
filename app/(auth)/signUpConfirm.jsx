import { View, Text, TextInput, StatusBar, TouchableOpacity, KeyboardAvoidingView} from 'react-native';
import { useState } from 'react';
import { useLocalSearchParams } from 'expo-router';
import { AuthStyles } from '../../constants/styles';
import { handleSignUpConfirm, handleResendSignUpCode } from '../../components/authComponents';

const signUpConfirm = () =>
{
    const { username } = useLocalSearchParams();
    const [confirmationCode, setCode] = useState();

    return (
        <KeyboardAvoidingView
            behavior='padding'
            style={AuthStyles.page}
        >
            <StatusBar barStyle="light-content" hidden={true}/>
            <View style={AuthStyles.backgroundContainer}>
                <View style={AuthStyles.background} />
                <View style={AuthStyles.background} />
                <View style={AuthStyles.background} />
                <View style={AuthStyles.background} />
            </View>
            <View style={AuthStyles.container}>
                <Text style={AuthStyles.title}>Confirm Sign Up</Text>
                <View style={AuthStyles.confirmContainer}>
                    <Text style={AuthStyles.description}>Check your email for your trop locksmith verification code!</Text>
                    <TextInput
                        placeholder='Verification Code'
                        value={confirmationCode}
                        onChangeText={setCode}
                        autoCapitalize='none'
                        style={AuthStyles.input}
                    />
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
                    <Text style={{textAlign: 'center'}}>Resend Code</Text>
                </TouchableOpacity>
            </View>
        </KeyboardAvoidingView>
    );
};

export default signUpConfirm;