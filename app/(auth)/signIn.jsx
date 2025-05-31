import { Text, TextInput, View, TouchableOpacity, KeyboardAvoidingView, Image, ScrollView } from 'react-native';
import { useState } from 'react';
import { handleSignIn } from '../../components/authComponents';
import { Ionicons } from '@expo/vector-icons';
import { Link } from 'expo-router';
import { AuthStyles, Styles } from '../../constants/styles';
import { GoogleSignInButton, AmazonSignInButton } from '../../components/authComponents';
import Colors from '../../constants/colors';

const SignIn = () =>
{
    const [email, setEmail] = useState();
    const [password, setPassword] = useState();

    return (
        <View style={Styles.page}>
            <View style={AuthStyles.imgContainer}>
                <Image
                    source={require('../../assets/images/a51-login-logo.png')}
                    style={AuthStyles.logoImg}
                />
            </View>
            <View style={[Styles.block, {alignItems: 'center', rowGap: 25}]}>
                <Text style={[Styles.title, { textAlign: 'left', paddingLeft: 20}]}>Sign In</Text>
                <View style={Styles.inputContainer}>
                    <View style={Styles.inputWrapper}>
                        <Ionicons name='mail' size={20} style={Styles.icon} />
                        <TextInput
                            placeholder='email'
                            placeholderTextColor={Colors.text}
                            value={email}
                            onChangeText={setEmail}
                            keyboardType='email-address'
                            autoCapitalize='none'
                            style={Styles.input}
                        />
                    </View>
                    <View style={Styles.inputWrapper}>
                        <Ionicons name='lock-closed' size={20} style={Styles.icon} />
                        <TextInput
                            placeholder='password'
                            placeholderTextColor={Colors.text}
                            value={password}
                            onChangeText={setPassword}
                            autoCapitalize='none'
                            secureTextEntry
                            style={Styles.input}
                        />
                    </View>
                </View>
                <TouchableOpacity
                    onPress={() => handleSignIn({ username: email, password })}
                    style={Styles.actionButton}
                >
                    <Text style={Styles.actionText}>Login</Text>
                </TouchableOpacity>
            </View>
            <View style={Styles.hr}/>
            <View style={[Styles.block, {rowGap: 25}]}>
                <View style={AuthStyles.providerContainer}>
                    <GoogleSignInButton text='Sign in'/>
                    <AmazonSignInButton text='Sign in'/>
                </View>
                <View style={[AuthStyles.providerContainer, {columnGap: 90}]}>
                    <Link href="/(auth)/resetPassword" style={Styles.text}>Forgot Password?</Link>
                    <Link href="/(auth)/signUp" style={[Styles.text, {paddingRight: 25}]}>Sign Up</Link>
                </View>
            </View>
        </View>
    );
};

export default SignIn;