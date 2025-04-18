import { Text, TextInput, View, TouchableOpacity, StatusBar, KeyboardAvoidingView } from 'react-native';
import { useState } from 'react';
import { handleSignIn } from '../../components/authComponents';
import { Link } from 'expo-router';
import { AuthStyles, Styles } from '../../constants/styles';
import { GoogleSignInButton, AmazonSignInButton } from '../../components/authComponents';
import Colors from '../../constants/colors';

const signIn = () =>
{
    const [email, setEmail] = useState();
    const [password, setPassword] = useState();

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
                <Text style={AuthStyles.title}>Sign In</Text>
                <View style={AuthStyles.inputContainer}>
                    <TextInput
                        placeholder='Email'
                        value={email}
                        onChangeText={setEmail}
                        keyboardType='email-address'
                        autoCapitalize='none'
                        style={AuthStyles.input}
                    />
                    <TextInput
                        placeholder='password'
                        value={password}
                        onChangeText={setPassword}
                        autoCapitalize='none'
                        secureTextEntry
                        style={AuthStyles.input}
                    />
                </View>

                <TouchableOpacity
                    onPress={() => handleSignIn({ username: email, password })}
                    style={AuthStyles.actionButton}
                >
                    <Text style={{color: 'white', textAlign: 'center'}}>Login</Text>
                </TouchableOpacity>
                <View style={Styles.hr}/>
                <View style={AuthStyles.providerContainer}>
                    <GoogleSignInButton text='Sign In'/>
                    <AmazonSignInButton text='Sign In'/>
                </View>
                <View style={AuthStyles.linkContainer}>
                    <Link href="/resetPassword" style={{color: Colors.text}}>Forgot Password?</Link>
                    <Link href="/signUp" style={{color: Colors.text}}>Sign Up</Link>
                </View>
            </View>
        </KeyboardAvoidingView>
    );
};

export default signIn;