import Colors from '../../constants/colors';
import { AuthStyles, Styles } from '../../constants/styles';
import { GoogleSignInButton } from '../../components/authComponents';
import { AuthBackground } from '../../components/components';
import { handleSignIn } from '../../components/authComponents';
import { Text, TextInput, View, TouchableOpacity, Image } from 'react-native';
import { useState } from 'react';
import { FontAwesome, Ionicons } from '@expo/vector-icons';
import { Link } from 'expo-router';
import { useNavigation } from '@react-navigation/native';

const SignIn = () =>
{
    const navigate = useNavigation();
    const [email, setEmail] = useState();
    const [password, setPassword] = useState();
    const [loading, setLoading] = useState(false);
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
            <View style={[Styles.block, {alignItems: 'center'}]}>
                <Text style={[Styles.title, { paddingLeft: 20, width: '100%'}]}>Sign In</Text>
                <View style={Styles.inputContainer}>
                    <View style={Styles.inputWrapper}>
                        <Ionicons name='mail' size={20} style={Styles.icon} />
                        <TextInput
                            placeholder='email'
                            placeholderTextColor={Colors.subText}
                            value={email}
                            onChangeText={setEmail}
                            keyboardType='email-address'
                            autoCapitalize='none'
                            style={[Styles.input, missingEmail && {borderColor: 'red'}]}
                        />
                    </View>
                    <View style={Styles.inputWrapper}>
                        <Ionicons name='lock-closed' size={20} style={Styles.icon} />
                        <TextInput
                            placeholder='password'
                            placeholderTextColor={Colors.subText}
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
                                <Ionicons name='eye-off' size={20} color={Colors.backDropAccent}/>
                            ) : <Ionicons name='eye' size={20} color={Colors.backDropAccent}/> }
                        </TouchableOpacity>
                    </View>
                </View>
                { errorMessage ? (
                    <View style={Styles.errorContainer}>
                        <FontAwesome name='exclamation-circle' size={20} style={[Styles.icon, {color: 'red'}]}/>
                        <Text style={[Styles.text, {color: 'red'}]}>{errorMessage}</Text>
                    </View>
                ) : null }
                <TouchableOpacity
                    onPress={async () => {
                        if (loading) return;
                        setLoading(true);
                        setErrorMessage(await handleSignIn(email, password));
                        if (!email) setMissingEmail(true);
                        else setMissingEmail(false);
                        if (!password) setMissingPassword(true);
                        else setMissingPassword(false);
                        setLoading(false);
                    }}
                    style={[Styles.actionButton, {backgroundColor: Colors.secondary}, loading && { opacity: 0.5 }]}
                    disabled={loading}
                >
                    <Text style={Styles.actionText}>Login</Text>
                </TouchableOpacity>
            </View>
            <View style={[Styles.block, {alignItems: 'center'}]}>
                <View style={Styles.hr}/>
            </View>
            <View style={Styles.block}>
                <View style={AuthStyles.providerContainer}>
                    <GoogleSignInButton text='Sign in with Google' navigate={navigate}/>
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