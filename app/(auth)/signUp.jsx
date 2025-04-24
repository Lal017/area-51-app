import { View, Text, TextInput, TouchableOpacity, KeyboardAvoidingView } from "react-native";
import { useState } from "react";
import { handleSignUp, GoogleSignInButton, AmazonSignInButton } from "../../components/authComponents";
import { Link } from "expo-router";
import { AuthStyles, Styles } from "../../constants/styles";
import Colors from "../../constants/colors";
import { Ionicons } from "@expo/vector-icons";

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
            <View style={AuthStyles.container}>
                <Text style={AuthStyles.title}>Sign Up</Text>
                <View style={AuthStyles.inputContainer}>
                    <View style={AuthStyles.inputWrapper}>
                        <Ionicons name='person' size={20} style={AuthStyles.icon} />
                        <TextInput
                            placeholder="full name"
                            value={name}
                            onChangeText={setName}
                            style={AuthStyles.input}
                        />
                    </View>
                    <View style={AuthStyles.inputWrapper}>
                        <Ionicons name='call' size={20} style={AuthStyles.icon} />
                        <TextInput
                            placeholder="phone number"
                            value={phoneNumber}
                            onChangeText={setPhoneNumber}
                            autoCapitalize="none"
                            keyboardType="phone-pad"
                            style={AuthStyles.input}
                        />
                    </View>
                    <View style={AuthStyles.inputWrapper}>
                        <Ionicons name='at' size={20} style={AuthStyles.icon} />
                        <TextInput
                            placeholder="email"
                            value={email}
                            onChangeText={setEmail}
                            keyboardType="email-address"
                            autoCapitalize="none"
                            style={AuthStyles.input}
                        />
                    </View>
                    <View style={AuthStyles.inputWrapper}>
                        <Ionicons name='key' size={20} style={AuthStyles.icon} />
                        <TextInput
                            placeholder="password"
                            value={password}
                            onChangeText={setPassword}
                            autoCapitalize="none"
                            secureTextEntry={true}
                            style={AuthStyles.input}
                        />
                    </View>
                    <View style={AuthStyles.inputWrapper}>
                        <Ionicons name="lock-open" size={20} style={AuthStyles.icon} />
                        <TextInput
                            placeholder="confirm password"
                            value={confPassword}
                            onChangeText={setConfPassword}
                            autoCapitalize="none"
                            secureTextEntry={true}
                            style={AuthStyles.input}
                        />
                    </View>
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
                <Link href="/signIn" style={AuthStyles.shiftButton}>Sign In</Link>
            </View>
        </KeyboardAvoidingView>
    );
};

export default signUp;