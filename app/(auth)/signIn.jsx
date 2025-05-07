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
            style={Styles.page}
        >
            <StatusBar barStyle="light-content" hidden={true}/>
            <View style={{height: '100', borderWidth: 0, justifyContent: 'center', alignItems: 'center'}}>
                <Image
                    source={require('../../assets/images/icon.png')}
                    style={{resizeMode: 'contain', height: '300', transform: [{ translateY: -30}]}}    
                />
            </View>
            <View style={Styles.container}>
                <Text style={Styles.title}>Sign In</Text>
                <View style={Styles.inputContainer}>
                    <View style={Styles.inputWrapper}>
                        <Ionicons name='mail' size={20} style={Styles.icon} />
                        <TextInput
                            placeholder='email'
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
                <View style={Styles.hr}/>
                <View style={AuthStyles.providerContainer}>
                    <GoogleSignInButton text='Sign In'/>
                    <AmazonSignInButton text='Sign In'/>
                </View>
                <View style={[AuthStyles.providerContainer, {gap: 125}]}>
                    <Link href="/resetPassword">Forgot Password?</Link>
                    <Link href="/signUp">Sign Up</Link>
                </View>
            </View>
        </KeyboardAvoidingView>
    );
};

export default signIn;