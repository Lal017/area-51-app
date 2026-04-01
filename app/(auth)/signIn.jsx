import Colors from '../../constants/colors';
import { AuthStyles, Styles } from '../../constants/styles';
import { ActionButton, AuthBackground, ErrorDisplay, GoogleSignInButton } from '../../components/components';
import { handleSignIn } from '../../services/authService';
import { Text, TextInput, View, TouchableOpacity, Image } from 'react-native';
import { useState } from 'react';
import { Ionicons } from '@expo/vector-icons';
import { Link } from 'expo-router';

const SignIn = () =>
{
    const [email, setEmail] = useState();
    const [password, setPassword] = useState();
    const [showPassword, setShowPassword] = useState(false);
    const [errorMessage, setErrorMessage] = useState(undefined);
    const [missingEmail, setMissingEmail] = useState(false);
    const [missingPassword, setMissingPassword] = useState(false);

    return (
        <AuthBackground>
            <View style={AuthStyles.imgContainer}>
                <Image
                    source={require('../../assets/images/a51-login-logo.png')}
                    style={AuthStyles.logoImg}
                />
            </View>
            <View style={Styles.block}>
                <View style={Styles.infoContainer}>
                    <Text style={Styles.title}>Sign In</Text>
                </View>
                <View style={Styles.inputWrapper}>
                    <Ionicons name='mail' size={20} style={Styles.inputIcon} />
                    <TextInput
                        placeholder='email'
                        placeholderTextColor={Colors.grayText}
                        value={email}
                        onChangeText={setEmail}
                        keyboardType='email-address'
                        autoCapitalize='none'
                        style={[Styles.input, missingEmail && {borderColor: 'red'}]}
                    />
                </View>
                <View style={Styles.inputWrapper}>
                    <Ionicons name='lock-closed' size={20} style={Styles.inputIcon} />
                    <TextInput
                        placeholder='password'
                        placeholderTextColor={Colors.grayText}
                        value={password}
                        onChangeText={setPassword}
                        autoCapitalize='none'
                        secureTextEntry={!showPassword}
                        style={[Styles.input, missingPassword && {borderColor: 'red'}]}
                    />
                    <TouchableOpacity
                        style={{padding: 10, position: 'absolute', right: 10}}
                        onPress={() => {
                            setShowPassword(prev => !prev);
                        }}
                    >
                        { showPassword ? (
                            <Ionicons name='eye-off' size={20} color={Colors.accent}/>
                        ) : <Ionicons name='eye' size={20} color={Colors.accent}/> }
                    </TouchableOpacity>
                </View>
            </View>
            { errorMessage && (
                <ErrorDisplay message={errorMessage}/>
            )}
            <View style={Styles.block}>
                <ActionButton
                    text='Login'
                    primaryColor={Colors.secondary}
                    secondaryColor={Colors.secondaryShade}
                    onPress={async () => {
                        try {
                            await handleSignIn(email, password);
                        } catch (error) {
                            setErrorMessage(error.message);
                            if (!email) setMissingEmail(true);
                            else setMissingEmail(false);
                            if (!password) setMissingPassword(true);
                            else setMissingPassword(false);
                        }
                    }}
                />
            </View>
            <View style={[Styles.block, {alignItems: 'center'}]}>
                <View style={Styles.hr}/>
            </View>
            <View style={Styles.block}>
                <View style={AuthStyles.providerContainer}>
                    <GoogleSignInButton text='Sign in with Google'/>
                </View>
                <View style={[Styles.infoContainer, {alignItems: 'center', rowGap: 20}]}>
                    <Link href="/(auth)/signUp" style={Styles.text}>Need an account? <Text style={{textDecorationLine: 'underline'}}>Sign Up</Text></Link>
                    <Link href="/(auth)/resetPassword" style={Styles.text}>Forgot Password?</Link>
                </View>
            </View>
        </AuthBackground>
    );
};

export default SignIn;