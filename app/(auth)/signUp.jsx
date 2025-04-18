import { View, Text, TextInput, TouchableOpacity, KeyboardAvoidingView } from "react-native";
import { useState } from "react";
import { handleSignUp, GoogleSignInButton, AmazonSignInButton } from "../../components/authComponents";
import { Link } from "expo-router";
import { AuthStyles, Styles } from "../../constants/styles";
import Colors from "../../constants/colors";

const signUp = () =>
{
    const [email, setEmail] = useState();
    const [password, setPassword] = useState();
    const [confPassword, setConfPassword] = useState();
    const [name, setName] = useState();
    const [phoneNumber, setPhoneNumber] = useState();

    return(
        <KeyboardAvoidingView
            behavior='padding'
            style={AuthStyles.page}
        >
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
                        placeholder="full name"
                        value={name}
                        onChangeText={setName}
                        style={AuthStyles.input}
                    />
                    <TextInput
                        placeholder="phone number"
                        value={phoneNumber}
                        onChangeText={setPhoneNumber}
                        autoCapitalize="none"
                        keyboardType="phone-pad"
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
                    onPress={() => handleSignUp({name, email, password, confPassword, phoneNumber})}
                    style={AuthStyles.actionButton}
                >
                    <Text style={{color: 'white', textAlign: 'center'}}>Sign Up</Text>
                </TouchableOpacity>
                <View style={Styles.hr} />
                <View style={AuthStyles.providerContainer}>
                    <GoogleSignInButton text='Sign Up'/>
                    <AmazonSignInButton text='Sign Up'/>
                </View>
                <Link href="/signIn" style={{color: Colors.text}}>Sign In</Link>
            </View>
        </KeyboardAvoidingView>
    );
};

export default signUp;