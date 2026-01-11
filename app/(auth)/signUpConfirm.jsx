import Colors from '../../constants/colors';
import { Styles, AuthStyles } from '../../constants/styles';
import { handleSignUpConfirm, handleResendSignUpCode } from '../../components/authComponents';
import { AuthBackground } from '../../components/components';
import { View, Text, TextInput, TouchableOpacity, Image, Alert} from 'react-native';
import { useState, useEffect } from 'react';
import { useLocalSearchParams } from 'expo-router';
import { MaterialIcons } from '@expo/vector-icons';
import { useNavigation } from '@react-navigation/native';

const SignUpConfirm = () =>
{
    const { username, password } = useLocalSearchParams();
    const [confirmationCode, setCode] = useState();
    const [loading, setLoading] = useState(false);
    const [cooldown, setCooldown] = useState(30);
    const [errorMessage, setErrorMessage] = useState(undefined);
    const [resendMessage, setResendMessage] = useState(undefined);
    const [missingConfirmationCode, setMissingConfirmationCode] = useState(false);

    const navigate = useNavigation();

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
                    <Text style={Styles.title}>Confirm Sign Up</Text>
                    <Text style={Styles.text}>Check your email for your verification code!</Text>
                </View>
                <View style={Styles.inputWrapper}>
                    <MaterialIcons name='numbers' size={20} style={Styles.icon} />
                    <TextInput
                        placeholder='Verification Code'
                        placeholderTextColor={Colors.text}
                        value={confirmationCode}
                        onChangeText={setCode}
                        autoCapitalize='none'
                        keyboardType='number-pad'
                        style={[Styles.input, missingConfirmationCode && {borderColor: 'red'}]}
                    />
                </View>
                { errorMessage ? (
                    <View style={Styles.errorContainer}>
                        <Text style={[Styles.text, {color: 'red'}]}>{errorMessage}</Text>
                    </View>
                ) : null}
                { resendMessage ? (
                    <View style={Styles.errorContainer}>
                        <Text style={[Styles.text, {color: Colors.primary}]}>{resendMessage}</Text>
                    </View>
                ) : null}
                <TouchableOpacity
                    onPress={async () => {
                        if (loading) return;
                        setLoading(true);

                        if (!confirmationCode) setMissingConfirmationCode(true);
                        else setMissingConfirmationCode(false);
                        setResendMessage(undefined);

                        setErrorMessage(await handleSignUpConfirm(navigate, username, confirmationCode, password));
                        setLoading(false);
                    }}
                    style={[Styles.actionButton, loading && { opacity: 0.5 }]}
                    disabled={loading}
                >
                    <Text style={Styles.actionText}>Confirm</Text>
                </TouchableOpacity>
                <TouchableOpacity
                    onPress={() => {
                        if (cooldown > 0) {
                            setErrorMessage(`Please wait ${cooldown} seconds before requesting a new code`);
                            setResendMessage(undefined);
                            return;
                        }
                        setErrorMessage(handleResendSignUpCode(username));

                        if (!errorMessage) {
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