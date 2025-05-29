import { View, Text, TextInput, TouchableOpacity, KeyboardAvoidingView } from "react-native";
import { useState } from "react";
import { handleSignUp, GoogleSignInButton, AmazonSignInButton } from "../../components/authComponents";
import { Link } from "expo-router";
import { AuthStyles, Styles } from "../../constants/styles";
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
            style={[Styles.page, {justifyContent: 'center'}]}
        >
            <View style={Styles.container}>
                <Text style={Styles.title}>Sign Up</Text>
                <View style={Styles.inputContainer}>
                    <View style={Styles.inputWrapper}>
                        <Ionicons name='person' size={20} style={Styles.icon} />
                        <TextInput
                            placeholder="full name"
                            value={name}
                            onChangeText={setName}
                            style={Styles.input}
                        />
                    </View>
                    <View style={Styles.inputWrapper}>
                        <Ionicons name='call' size={20} style={Styles.icon} />
                        <TextInput
                            placeholder="phone number"
                            value={phoneNumber}
                            onChangeText={setPhoneNumber}
                            autoCapitalize="none"
                            keyboardType="phone-pad"
                            style={Styles.input}
                        />
                    </View>
                    <View style={Styles.inputWrapper}>
                        <Ionicons name='at' size={20} style={Styles.icon} />
                        <TextInput
                            placeholder="email"
                            value={email}
                            onChangeText={setEmail}
                            keyboardType="email-address"
                            autoCapitalize="none"
                            style={Styles.input}
                        />
                    </View>
                    <View style={Styles.inputWrapper}>
                        <Ionicons name='key' size={20} style={Styles.icon} />
                        <TextInput
                            placeholder="password"
                            value={password}
                            onChangeText={setPassword}
                            autoCapitalize="none"
                            secureTextEntry={true}
                            style={Styles.input}
                        />
                    </View>
                    <View style={Styles.inputWrapper}>
                        <Ionicons name="lock-open" size={20} style={Styles.icon} />
                        <TextInput
                            placeholder="confirm password"
                            value={confPassword}
                            onChangeText={setConfPassword}
                            autoCapitalize="none"
                            secureTextEntry={true}
                            style={Styles.input}
                        />
                    </View>
                </View>
                <TouchableOpacity
                    onPress={() => handleSignUp({name, email, password, confPassword, phoneNumber})}
                    style={Styles.actionButton}
                >
                    <Text style={Styles.actionText}>Sign Up</Text>
                </TouchableOpacity>
                <View style={Styles.hr} />
                <View style={AuthStyles.providerContainer}>
                    <GoogleSignInButton text='Sign Up'/>
                    <AmazonSignInButton text='Sign Up'/>
                </View>
                <Link href="/(auth)/signIn" style={AuthStyles.shiftButton}>Sign In</Link>
            </View>
        </KeyboardAvoidingView>
    );
};

export default signUp;