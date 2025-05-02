import { Text, TextInput, View, TouchableOpacity, StatusBar, KeyboardAvoidingView, Image } from 'react-native';
import { useState } from 'react';
import { handleSignIn } from '../../components/authComponents';
import { Ionicons } from '@expo/vector-icons';
import { Link } from 'expo-router';
import { AuthStyles, Styles } from '../../constants/styles';
import { GoogleSignInButton, AmazonSignInButton } from '../../components/authComponents';

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
            <View style={{height: '100', borderWidth: 0, justifyContent: 'center', alignItems: 'center'}}>
                <Image
                    source={require('../../assets/images/icon.png')}
                    style={{resizeMode: 'contain', height: '300', transform: [{ translateY: -30}]}}    
                />
            </View>
            <View style={AuthStyles.container}>
                <Text style={AuthStyles.title}>Sign In</Text>
                <View style={AuthStyles.inputContainer}>
                    <View style={AuthStyles.inputWrapper}>
                        <Ionicons name='mail' size={20} style={AuthStyles.icon} />
                        <TextInput
                            placeholder='email'
                            value={email}
                            onChangeText={setEmail}
                            keyboardType='email-address'
                            autoCapitalize='none'
                            style={AuthStyles.input}
                        />
                    </View>
                    <View style={AuthStyles.inputWrapper}>
                        <Ionicons name='lock-closed' size={20} style={AuthStyles.icon} />
                        <TextInput
                            placeholder='password'
                            value={password}
                            onChangeText={setPassword}
                            autoCapitalize='none'
                            secureTextEntry
                            style={AuthStyles.input}
                        />
                    </View>
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
                    <Link href="/resetPassword" style={AuthStyles.shiftButton}>Forgot Password?</Link>
                    <Link href="/signUp" style={AuthStyles.shiftButton}>Sign Up</Link>
                </View>
            </View>
        </KeyboardAvoidingView>
    );
};

export default signIn;