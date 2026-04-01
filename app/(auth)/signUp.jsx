import Colors from "../../constants/colors";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { ActionButton, AuthBackground, ErrorDisplay, GoogleSignInButton } from "../../components/components";
import { handleSignUp } from "../../services/authService";
import { AuthStyles, Styles } from "../../constants/styles";
import { View, Text, TextInput, TouchableOpacity, KeyboardAvoidingView, Image, Alert } from "react-native";
import { useState } from "react";
import { Link } from "expo-router";
import { Entypo, Ionicons } from "@expo/vector-icons";

const SignUp = () =>
{
    const [email, setEmail] = useState();
    const [password, setPassword] = useState();
    const [confPassword, setConfPassword] = useState();
    const [firstName, setFirstName] = useState();
    const [lastName, setLastName] = useState();
    const [phoneNumber, setPhoneNumber] = useState();
    const [check, setCheck] = useState(false);
    const [step, setStep] = useState(1);
    const [showPassword, setShowPassword] = useState(false);
    const [showConfirmPassword, setShowConfirmPassword] = useState(false);
    const [errorMessage, setErrorMessage] = useState(undefined);
    const [missingEmail, setMissingEmail] = useState(false);
    const [missingPassword, setMissingPassword] = useState(false);
    const [missingConfPassword, setMissingConfPassword] = useState(false);
    const [missingFirstName, setMissingFirstName] = useState(false);
    const [missingLastName, setMissingLastName] = useState(false);
    const [missingPhoneNumber, setMissingPhoneNumber] = useState(false);

    const continueButton = () =>
    {
        if (!email) setMissingEmail(true);
        else setMissingEmail(false);
        if (!password) setMissingPassword(true);
        else setMissingPassword(false);
        if (!confPassword) setMissingConfPassword(true);
        else setMissingConfPassword(false);
        
        if (password !== confPassword) {
            setErrorMessage('Passwords do not match');
            return;
        }
        if (email && password && confPassword && !check) {
            setErrorMessage(undefined);
            setStep(2);
        }
        else if (email && password && confPassword && check) {
            Alert.alert(
                'Confirmation',
                'Are you sure you want to sign up for a tow truck driver account?',
                [
                    { text: 'Back'},
                    {
                        text: 'Continue',
                        onPress: () => setStep(2)
                    }
                ]
            );
        }
        else {
            setErrorMessage('All fields are required to continue');
        }
    };

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
                    <View style={Styles.block}>
                        <Text style={[Styles.title, {paddingLeft: 20, width: '100%'}]}>Sign Up</Text>
                        <View style={Styles.inputWrapper}>
                            <Ionicons name='at' size={20} style={Styles.inputIcon} />
                            <TextInput
                                placeholder="email"
                                placeholderTextColor={Colors.grayText}
                                value={email}
                                onChangeText={setEmail}
                                keyboardType="email-address"
                                autoCapitalize="none"
                                style={[Styles.input, missingEmail && {borderColor: 'red'}]}
                            />
                        </View>
                        <View style={Styles.inputWrapper}>
                            <Ionicons name='key' size={20} style={Styles.inputIcon} />
                            <TextInput
                                placeholder="password"
                                placeholderTextColor={Colors.grayText}
                                value={password}
                                onChangeText={setPassword}
                                autoCapitalize="none"
                                secureTextEntry={!showPassword}
                                style={[Styles.input, missingPassword && {borderColor: 'red'}]}
                            />
                            <TouchableOpacity
                                style={{padding: 10, position: 'absolute', right: 10}}
                                onPress={() => {
                                    setShowPassword(prev => !prev);
                                }}
                            >
                                { showPassword ? (
                                    <Ionicons name='eye-off' size={20} color={Colors.accent}/>
                                ) : <Ionicons name='eye' size={20} color={Colors.accent}/> }
                            </TouchableOpacity>
                        </View>
                        <View style={Styles.inputWrapper}>
                            <Ionicons name="lock-open" size={20} style={Styles.inputIcon} />
                            <TextInput
                                placeholder="confirm password"
                                placeholderTextColor={Colors.grayText}
                                value={confPassword}
                                onChangeText={setConfPassword}
                                autoCapitalize="none"
                                secureTextEntry={!showConfirmPassword}
                                style={[Styles.input, missingConfPassword && {borderColor: 'red'}]}
                            />
                            <TouchableOpacity
                                style={{padding: 10, position: 'absolute', right: 10}}
                                onPress={() => {
                                    setShowConfirmPassword(prev => !prev);
                                }}
                            >
                                { showConfirmPassword ? (
                                    <Ionicons name='eye-off' size={20} color={Colors.accent}/>
                                ) : <Ionicons name='eye' size={20} color={Colors.accent}/> }
                            </TouchableOpacity>
                        </View>
                        <View style={{width: '90%', flexDirection: 'row', columnGap: 20, alignItems: 'center', alignSelf: 'center', justifyContent: 'flex-start'}}>
                            <TouchableOpacity
                                style={{
                                    width: 30, height: 30,
                                    backgroundColor: Colors.accent,
                                    borderRadius: 5,
                                    justifyContent: 'center', alignItems: 'center'
                                }}
                                onPress={() => setCheck(prev => !prev)}
                            >
                                { check && <Entypo name='check' size={25}/>}
                            </TouchableOpacity>
                            <Text style={Styles.text}>Request a tow truck driver account?</Text>
                        </View>
                        { errorMessage && step === 1 && (
                            <ErrorDisplay message={errorMessage}/>
                        )}
                        <ActionButton
                            text='Continue'
                            onPress={() => continueButton()}
                        />
                    </View>
                ) : step === 2 ? (
                    <>
                    <View style={Styles.block}>
                        <Text style={[Styles.title, {paddingLeft: 20, width: '100%'}]}>Sign Up</Text>
                        <View style={Styles.inputWrapper}>
                            <Ionicons name='person' size={20} style={Styles.inputIcon} />
                            <TextInput
                                placeholder="first name"
                                placeholderTextColor={Colors.grayText}
                                value={firstName}
                                onChangeText={setFirstName}
                                style={[Styles.input, missingFirstName && {borderColor: 'red'}]}
                            />
                        </View>
                        <View style={Styles.inputWrapper}>
                            <Ionicons name='person' size={20} style={Styles.inputIcon} />
                            <TextInput
                                placeholder="last name"
                                placeholderTextColor={Colors.grayText}
                                value={lastName}
                                onChangeText={setLastName}
                                style={[Styles.input, missingLastName && {borderColor: 'red'}]}
                            />
                        </View>
                        <View style={Styles.inputWrapper}>
                            <Ionicons name='call' size={20} style={Styles.inputIcon} />
                            <TextInput
                                placeholder="phone number"
                                placeholderTextColor={Colors.grayText}
                                value={phoneNumber}
                                onChangeText={setPhoneNumber}
                                autoCapitalize="none"
                                keyboardType="phone-pad"
                                style={[Styles.input, missingPhoneNumber && {borderColor: 'red'}]}
                            />
                        </View>
                    </View>
                    { errorMessage && step === 2 && (
                        <ErrorDisplay message={errorMessage}/>
                    )}
                    <View style={Styles.block}>
                        <ActionButton
                            text='Sign Up'
                            primaryColor={Colors.primary}
                            secondaryColor={Colors.primaryShade}
                            onPress={async () => {
                                try {                                
                                    await handleSignUp(firstName, lastName, email, password, phoneNumber);
                                    await AsyncStorage.setItem('wantsToBeTowDriver', JSON.stringify(check));
                                } catch (error) {
                                    if (!firstName) setMissingFirstName(true);
                                    else setMissingFirstName(false);
                                    if (!lastName) setMissingLastName(true);
                                    else setMissingLastName(false);
                                    if (!phoneNumber) setMissingPhoneNumber(true);
                                    else setMissingPhoneNumber(false);
                                    setErrorMessage(error.message);
                                }
                            }}
                        />
                    </View>
                    </>
                ) : null}
                <View style={[Styles.block, {alignItems: 'center'}]}>
                    <View style={Styles.hr} />
                </View>
                <View style={Styles.block}>
                    <View style={[AuthStyles.providerContainer, step === 1 ? {display: 'flex'} : {display: 'none'}]}>
                        <GoogleSignInButton text='Sign Up with Google'/>
                    </View>
                    <Link href="/(auth)/signIn" style={[Styles.text, {textAlign: 'center'}]}>{step === 1 ? 'Sign in' : 'Back to sign in'}</Link>
                </View>
            </AuthBackground>
        </KeyboardAvoidingView>
    );
};

export default SignUp;