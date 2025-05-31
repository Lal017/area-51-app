import { View, Text, TextInput, TouchableOpacity, KeyboardAvoidingView, ScrollView, Image } from "react-native";
import { useState } from "react";
import { handleSignUp, GoogleSignInButton, AmazonSignInButton } from "../../components/authComponents";
import { Link } from "expo-router";
import { AuthStyles, Styles } from "../../constants/styles";
import { Ionicons } from "@expo/vector-icons";
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
            behavior='height'
            style={{flex: 1}}
        >
            <ScrollView contentContainerStyle={[Styles.scrollPage, {justifyContent: 'center', paddingBottom: 20}]}>
                <View style={AuthStyles.imgContainer}>
                    <Image
                        source={require('../../assets/images/a51-login-logo.png')}
                        style={AuthStyles.logoImg}    
                    />
                </View>
                <View style={[Styles.block, {alignItems: 'center', rowGap: 25}]}>
                    <Text style={[Styles.title, {paddingLeft: 20}]}>Sign Up</Text>
                    <View style={Styles.inputContainer}>
                        <View style={Styles.inputWrapper}>
                            <Ionicons name='person' size={20} style={Styles.icon} />
                            <TextInput
                                placeholder="full name"
                                placeholderTextColor={Colors.text}
                                value={name}
                                onChangeText={setName}
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
                    </View>
                    <TouchableOpacity
                        onPress={() => handleSignUp({name, email, password, confPassword, phoneNumber})}
                        style={Styles.actionButton}
                    >
                        <Text style={Styles.actionText}>Sign Up</Text>
                    </TouchableOpacity>
                </View>
                <View style={Styles.hr} />
                <View style={[Styles.block, {rowGap: 25}]}>
                    <View style={AuthStyles.providerContainer}>
                        <GoogleSignInButton text='Sign Up'/>
                        <AmazonSignInButton text='Sign Up'/>
                    </View>
                    <Link href="/(auth)/signIn" style={[Styles.text, {textAlign: 'center'}]}>Sign In</Link>
                </View>
            </ScrollView>
        </KeyboardAvoidingView>
    );
};

export default signUp;