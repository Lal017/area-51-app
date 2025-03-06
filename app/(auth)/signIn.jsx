import { Text, TextInput, View, TouchableOpacity, StatusBar, KeyboardAvoidingView } from 'react-native';
import { useState } from 'react';
import { handleGetCurrentUser, handleSignIn, handleSignOut } from '../../components/authComponents';
import { Link } from 'expo-router';
import { AuthStyles } from '../../constants/styles';

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
                <Link href="/signUp">Sign Up</Link>
            </View>
        </KeyboardAvoidingView>
    );
};

export default signIn;