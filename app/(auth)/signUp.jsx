import { View, Text, TextInput, TouchableOpacity, KeyboardAvoidingView, Image, Alert } from "react-native";
import { useState } from "react";
import { handleSignUp, GoogleSignInButton, AmazonSignInButton } from "../../components/authComponents";
import { Link } from "expo-router";
import { AuthStyles, Styles } from "../../constants/styles";
import { Ionicons } from "@expo/vector-icons";
import Colors from "../../constants/colors";
import { AuthBackground } from "../../components/components";

const SignUp = () =>
{
    const [email, setEmail] = useState();
    const [password, setPassword] = useState();
    const [confPassword, setConfPassword] = useState();
    const [firstName, setFirstName] = useState();
    const [lastName, setLastName] = useState();
    const [phoneNumber, setPhoneNumber] = useState();
    const [step, setStep] = useState(1);
    const [loading, setLoading] = useState(false);

    return(
        <KeyboardAvoidingView
            behavior='height'
            style={{flex: 1}}
        >
            <AuthBackground>
                <View style={AuthStyles.imgContainer}>
                    <Image
                        source={require('../../assets/images/a51-login-logo.png')}
                        style={AuthStyles.logoImg}    
                    />
                </View>
                { step === 1 ? (
                    <View style={[Styles.block, {alignItems: 'center'}]}>
                        <Text style={[Styles.title, {paddingLeft: 20, width: '100%'}]}>Sign Up</Text>
                        <View style={Styles.inputWrapper}>
                            <Ionicons name='at' size={20} style={Styles.icon} />
                            <TextInput
                                placeholder="email"
                                placeholderTextColor={Colors.text}
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
                                placeholderTextColor={Colors.text}
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
                                placeholderTextColor={Colors.text}
                                value={confPassword}
                                onChangeText={setConfPassword}
                                autoCapitalize="none"
                                secureTextEntry={true}
                                style={Styles.input}
                            />
                        </View>
                        <TouchableOpacity
                            onPress={() => {
                                if (password !== confPassword)
                                {
                                    Alert.alert(
                                        "Error",
                                        "Passwords do not match",
                                        [
                                            { text: "Ok" }
                                        ]
                                    );
                                    return;
                                }
                                if (email && password && confPassword) { setStep(2) }
                                else { Alert.alert(
                                    'Error',
                                    'Required fields cannot be empty',
                                    [{ text: 'OK' }]
                                )}
                            }}
                            style={Styles.actionButton}
                        >
                            <Text style={Styles.actionText}>Continue</Text>
                        </TouchableOpacity>
                    </View>
                ) : step === 2 ? (
                    <View style={[Styles.block, {alignItems: 'center'}]}>
                        <Text style={[Styles.title, {paddingLeft: 20, width: '100%'}]}>Sign Up</Text>
                        <View style={Styles.inputWrapper}>
                            <Ionicons name='person' size={20} style={Styles.icon} />
                            <TextInput
                                placeholder="first name"
                                placeholderTextColor={Colors.text}
                                value={firstName}
                                onChangeText={setFirstName}
                                style={Styles.input}
                            />
                        </View>
                        <View style={Styles.inputWrapper}>
                            <Ionicons name='person' size={20} style={Styles.icon} />
                            <TextInput
                                placeholder="last name"
                                placeholderTextColor={Colors.text}
                                value={lastName}
                                onChangeText={setLastName}
                                style={Styles.input}
                            />
                        </View>
                        <View style={Styles.inputWrapper}>
                            <Ionicons name='call' size={20} style={Styles.icon} />
                            <TextInput
                                placeholder="phone number"
                                placeholderTextColor={Colors.text}
                                value={phoneNumber}
                                onChangeText={setPhoneNumber}
                                autoCapitalize="none"
                                keyboardType="phone-pad"
                                style={Styles.input}
                            />
                        </View>
                        <TouchableOpacity
                            onPress={async () => {
                                if (loading) return;
                                setLoading(true);
                                await handleSignUp(firstName, lastName, email, password, phoneNumber);
                                setLoading(false);
                            }}
                            style={[Styles.actionButton, loading && { opacity: 0.5 }]}
                            disabled={loading}
                        >
                            <Text style={Styles.actionText}>Sign Up</Text>
                        </TouchableOpacity>
                    </View>
                ) : null}
                <View style={Styles.hr} />
                <View style={Styles.block}>
                    <View style={AuthStyles.providerContainer}>
                        <GoogleSignInButton text='Sign Up'/>
                        <AmazonSignInButton text='Sign Up'/>
                    </View>
                    <Link href="/(auth)/signIn" style={[Styles.text, {textAlign: 'center'}]}>Sign In</Link>
                </View>
            </AuthBackground>
        </KeyboardAvoidingView>
    );
};

export default SignUp;