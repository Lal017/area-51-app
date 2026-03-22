import Colors from '../../constants/colors';
import { Styles, AuthStyles } from '../../constants/styles';
import { handleSignUpConfirm, handleResendSignUpCode } from '../../components/authComponents';
import { ActionButton, AuthBackground, ErrorDisplay } from '../../components/components';
import { View, Text, TextInput, TouchableOpacity, Image} from 'react-native';
import { useState, useEffect } from 'react';
import { useLocalSearchParams } from 'expo-router';
import { FontAwesome, MaterialIcons } from '@expo/vector-icons';

const SignUpConfirm = () =>
{
    const { username, password } = useLocalSearchParams();
    const [confirmationCode, setCode] = useState();
    const [cooldown, setCooldown] = useState(30);
    const [errorMessage, setErrorMessage] = useState(undefined);
    const [resendMessage, setResendMessage] = useState(undefined);

    useEffect(() => {
        if (cooldown === 0) return;
        const timer = setInterval(() => {
            setCooldown(prev => prev - 1);
        }, 1000);

        return () => clearInterval(timer);
    }, [cooldown])

    return (
        <AuthBackground>
            <View style={AuthStyles.imgContainer}>
                <Image
                    source={require('../../assets/images/a51-login-logo.png')}
                    style={AuthStyles.logoImg}
                />
            </View>
            <View style={[Styles.block, {alignItems: 'center'}]}>
                <View style={Styles.infoContainer}>
                    <Text style={Styles.headerTitle}>Confirm Sign Up</Text>
                    <Text style={Styles.tabHeader}>Check your email for your verification code!</Text>
                </View>
                <View style={Styles.inputWrapper}>
                    <MaterialIcons name='numbers' size={20} style={Styles.icon} />
                    <TextInput
                        placeholder='Verification Code'
                        placeholderTextColor={Colors.grayText}
                        value={confirmationCode}
                        onChangeText={setCode}
                        autoCapitalize='none'
                        keyboardType='number-pad'
                        style={[Styles.input, !confirmationCode && errorMessage && {borderColor: 'red'}]}
                    />
                </View>
                { errorMessage && (
                    <ErrorDisplay message={errorMessage}/>
                )}
                { resendMessage && (
                    <View style={Styles.errorContainer}>
                        <FontAwesome name='check-circle' size={20} style={[Styles.icon, {color: Colors.primary}]}/>
                        <Text style={[Styles.text, {color: Colors.primary}]}>{resendMessage}</Text>
                    </View>
                )}
                <ActionButton
                    text='Confirm'
                    onPress={async () => {
                        setResendMessage(undefined);
                        setErrorMessage(await handleSignUpConfirm(username, confirmationCode, password));
                    }}
                />
                <TouchableOpacity
                    onPress={async () => {
                        if (cooldown > 0) {
                            setErrorMessage(`Please wait ${cooldown} seconds before requesting a new code`);
                            setResendMessage(undefined);
                            return;
                        }

                        const err = await handleResendSignUpCode(username);
                        setErrorMessage(err);

                        if (err) {
                            setErrorMessage(undefined);
                            setResendMessage('Code has been Resent!');
                            setCooldown(30);
                        } else {
                            setResendMessage(undefined);
                        }
                    }}
                >
                    <Text style={Styles.actionText}>Resend Code</Text>
                </TouchableOpacity>
            </View>
        </AuthBackground>
    );
};

export default SignUpConfirm;