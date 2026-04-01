import { View, Text, TextInput, KeyboardAvoidingView, TouchableOpacity, Image } from "react-native";
import { Styles, AuthStyles } from "../../constants/styles";
import { useState } from "react";
import { useLocalSearchParams } from "expo-router";
import { handleConfirmResetPassword } from "../../components/authComponents";
import { Ionicons, MaterialIcons } from "@expo/vector-icons";
import Colors from "../../constants/colors";
import { ActionButton, AuthBackground, ErrorDisplay } from "../../components/components";

const ResetPasswordConfirm = () =>
{
    const { username } = useLocalSearchParams();
    const [confirmationCode, setConfirmationCode] = useState();
    const [newPassword, setNewPassword] = useState();
    const [confNewPassword, setConfNewPassword] = useState();
    const [showPassword, setShowPassword] = useState(false);
    const [showConfirmPassword, setShowConfirmPassword] = useState(false);
    const [errorMessage, setErrorMessage] = useState(undefined);
    const [missingConfCode, setMissingConfCode] = useState(false);
    const [missingNewPassword, setMissingNewPassword] = useState(false);
    const [missingConfNewPassword, setMissingConfNewPassword] = useState(false);

    return (
        <KeyboardAvoidingView behavior='height' style={{flex: 1}} >
            <AuthBackground>
                <View style={AuthStyles.imgContainer}>
                    <Image
                        source={require('../../assets/images/a51-login-logo.png')}
                        style={AuthStyles.logoImg}
                    />
                </View>
                <View style={Styles.block}>
                    <View style={Styles.infoContainer}>
                        <Text style={Styles.headerTitle}>Reset Password</Text>
                        <Text style={Styles.tabHeader}>Check your email for your verification code!</Text>
                    </View>
                    <View style={Styles.inputWrapper}>
                        <MaterialIcons name='numbers' size={20} style={Styles.inputIcon} />
                        <TextInput
                            placeholder="Verification Code"
                            placeholderTextColor={Colors.grayText}
                            value={confirmationCode}
                            onChangeText={setConfirmationCode}
                            keyboardType='number-pad'
                            autoCapitalize="none"
                            style={[Styles.input, missingConfCode && {borderColor: 'red'}]}
                        />
                    </View>
                    <View style={Styles.inputWrapper}>
                        <Ionicons name='key' size={20} style={Styles.inputIcon} />
                        <TextInput
                            placeholder="New Password"
                            placeholderTextColor={Colors.grayText}
                            value={newPassword}
                            onChangeText={setNewPassword}
                            secureTextEntry={!showPassword}
                            autoCapitalize="none"
                            style={[Styles.input, missingNewPassword && {borderColor: 'red'}]}
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
                            placeholder="Confirm New Password"
                            placeholderTextColor={Colors.grayText}
                            value={confNewPassword}
                            onChangeText={setConfNewPassword}
                            secureTextEntry={!showConfirmPassword}
                            autoCapitalize="none"
                            style={[Styles.input, missingConfNewPassword && {borderColor: 'red'}]}
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
                    { errorMessage && (
                        <ErrorDisplay message={errorMessage}/>
                    )}
                    <ActionButton
                        text='Reset'
                        onPress={async () => {
                            try {
                                await handleConfirmResetPassword(username, confirmationCode, newPassword, confNewPassword);
                            } catch (error) {
                                setErrorMessage(error.message);
                                if (!confirmationCode) setMissingConfCode(true);
                                else setMissingConfCode(false);
                                if (!newPassword) setMissingNewPassword(true);
                                else setMissingNewPassword(false);
                                if (!confNewPassword) setMissingConfNewPassword(true);
                                else setMissingConfNewPassword(false);
                            }
                        }}
                    />
                </View>
            </AuthBackground>
        </KeyboardAvoidingView>
    );
};

export default ResetPasswordConfirm;