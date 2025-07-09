import { View, Text, TextInput, TouchableOpacity, Image, Alert} from 'react-native';
import { useState, useEffect } from 'react';
import { useLocalSearchParams } from 'expo-router';
import { Styles, AuthStyles } from '../../constants/styles';
import { handleSignUpConfirm, handleResendSignUpCode } from '../../components/authComponents';
import Colors from '../../constants/colors';
import { MaterialIcons } from '@expo/vector-icons';
import { AuthBackground } from '../../components/components';

const SignUpConfirm = () =>
{
    const { username } = useLocalSearchParams();
    const [confirmationCode, setCode] = useState();
    const [loading, setLoading] = useState(false);
    const [cooldown, setCooldown] = useState(30);

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
                        style={Styles.input}
                    />
                </View>
                <TouchableOpacity
                    onPress={async () => {
                        if (loading) return;
                        setLoading(true);
                        await handleSignUpConfirm({username, confirmationCode});
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
                            Alert.alert(
                                'Cooldown',
                                `Please wait ${cooldown} seconds before requesting a new code.`,
                                [{ text: 'OK' }]
                            );
                            return;
                        }
                        handleResendSignUpCode({username});
                        Alert.alert(
                            'Code Resent',
                            'Check your email for your verification code',
                            [
                                { text: "Ok" }
                            ]
                        );
                        setCooldown(30);
                    }}
                >
                    <Text style={Styles.actionText}>Resend Code</Text>
                </TouchableOpacity>
            </View>
        </AuthBackground>
    );
};

export default SignUpConfirm;