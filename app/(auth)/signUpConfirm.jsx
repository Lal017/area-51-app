import Colors from '../../constants/colors';
import { Styles, AuthStyles } from '../../constants/styles';
import { handleSignUpConfirm, handleResendSignUpCode } from '../../components/authComponents';
import { AuthBackground } from '../../components/components';
import { View, Text, TextInput, TouchableOpacity, Image, Alert} from 'react-native';
import { useState, useEffect } from 'react';
import { useLocalSearchParams } from 'expo-router';
import { FontAwesome, MaterialIcons } from '@expo/vector-icons';

const SignUpConfirm = () =>
{
    const { username, password } = useLocalSearchParams();
    const [confirmationCode, setCode] = useState();
    const [loading, setLoading] = useState(false);
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
                        placeholderTextColor={Colors.subText}
                        value={confirmationCode}
                        onChangeText={setCode}
                        autoCapitalize='none'
                        keyboardType='number-pad'
                        style={[Styles.input, !confirmationCode && errorMessage && {borderColor: 'red'}]}
                    />
                </View>
                { errorMessage ? (
                    <View style={Styles.errorContainer}>
                        <FontAwesome name='exclamation-circle' size={20} style={[Styles.icon, {color: 'red'}]}/>
                        <Text style={[Styles.text, {color: 'red'}]}>{errorMessage}</Text>
                    </View>
                ) : null}
                { resendMessage ? (
                    <View style={Styles.errorContainer}>
                        <FontAwesome name='check-circle' size={20} style={[Styles.icon, {color: Colors.primary}]}/>
                        <Text style={[Styles.text, {color: Colors.primary}]}>{resendMessage}</Text>
                    </View>
                ) : null}
                <TouchableOpacity
                    onPress={async () => {
                        if (loading) return;
                        setLoading(true);

                        setResendMessage(undefined);

                        setErrorMessage(await handleSignUpConfirm(username, confirmationCode, password));
                        setLoading(false);
                    }}
                    style={[Styles.actionButton, loading && { opacity: 0.5 }]}
                    disabled={loading}
                >
                    <Text style={Styles.actionText}>Confirm</Text>
                </TouchableOpacity>
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