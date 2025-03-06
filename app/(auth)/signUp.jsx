import { View, Text, TextInput, TouchableOpacity, KeyboardAvoidingView, StatusBar } from "react-native";
import { useState } from "react";
import { handleSignUp } from "../../components/authComponents";
import { Link, router } from "expo-router";
import { AuthStyles } from "../../constants/styles";

const signUp = () =>
{
    const [email, setEmail] = useState();
    const [password, setPassword] = useState();
    const [confPassword, setConfPassword] = useState();
    const [name, setName] = useState();

    return(
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
                <Text style={AuthStyles.title}>Sign Up</Text>
                <View style={AuthStyles.inputContainer}>
                    <TextInput
                        placeholder="name"
                        value={name}
                        onChangeText={setName}
                        style={AuthStyles.input}
                    />
                    <TextInput
                        placeholder="email"
                        value={email}
                        onChangeText={setEmail}
                        keyboardType="email-address"
                        autoCapitalize="none"
                        style={AuthStyles.input}
                    />
                    <TextInput
                        placeholder="password"
                        value={password}
                        onChangeText={setPassword}
                        autoCapitalize="none"
                        secureTextEntry={true}
                        style={AuthStyles.input}
                    />
                    <TextInput
                        placeholder="confirm password"
                        value={confPassword}
                        onChangeText={setConfPassword}
                        autoCapitalize="none"
                        secureTextEntry={true}
                        style={AuthStyles.input}
                    />
                </View>
                <TouchableOpacity
                    onPress={() => handleSignUp({name, email, password, confPassword})}
                    style={AuthStyles.actionButton}
                >
                    <Text style={{color: 'white', textAlign: 'center'}}>Sign Up</Text>
                </TouchableOpacity>
                <Link href="/signIn">Sign In</Link>
            </View>
        </KeyboardAvoidingView>
    );
};

export default signUp;