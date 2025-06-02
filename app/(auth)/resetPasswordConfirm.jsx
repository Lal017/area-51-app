import { View, Text, TextInput, KeyboardAvoidingView, TouchableOpacity, Image, ScrollView } from "react-native";
import { Styles, AuthStyles } from "../../constants/styles";
import { useState } from "react";
import { useLocalSearchParams } from "expo-router";
import { handleConfirmResetPassword } from "../../components/authComponents";
import { Ionicons, MaterialIcons } from "@expo/vector-icons";
import Colors from "../../constants/colors";
import { AuthBackground } from "../../components/components";

const ResetPasswordConfirm = () =>
{
    const { username } = useLocalSearchParams();
    const [confirmationCode, setConfirmationCode] = useState();
    const [newPassword, setNewPassword] = useState();
    const [confNewPassword, setConfNewPassword] = useState();
    const [loading, setLoading] = useState(false);

    return (
        <KeyboardAvoidingView behavior='height' style={{flex: 1}} >
            <AuthBackground>
                <View style={AuthStyles.imgContainer}>
                    <Image
                        source={require('../../assets/images/a51-login-logo.png')}
                        style={AuthStyles.logoImg}
                    />
                </View>
                <View style={[Styles.block, {alignItems: 'center', rowGap: 25}]}>
                    <View style={Styles.infoContainer}>
                        <Text style={Styles.title}>Reset Password</Text>
                        <Text style={Styles.text}>Check your email for your verification code!</Text>
                    </View>
                    <View style={Styles.inputContainer}>
                        <View style={Styles.inputWrapper}>
                            <MaterialIcons name='numbers' size={20} style={Styles.icon} />
                            <TextInput
                                placeholder="Verification Code"
                                placeholderTextColor={Colors.text}
                                value={confirmationCode}
                                onChangeText={setConfirmationCode}
                                keyboardType='number-pad'
                                autoCapitalize="none"
                                style={Styles.input}
                            />
                        </View>
                        <View style={Styles.inputWrapper}>
                            <Ionicons name='key' size={20} style={Styles.icon} />
                            <TextInput
                                placeholder="New Password"
                                placeholderTextColor={Colors.text}
                                value={newPassword}
                                onChangeText={setNewPassword}
                                secureTextEntry
                                autoCapitalize="none"
                                style={Styles.input}
                            />
                        </View>
                        <View style={Styles.inputWrapper}>
                            <Ionicons name="lock-open" size={20} style={Styles.icon} />
                            <TextInput
                                placeholder="Confirm New Password"
                                placeholderTextColor={Colors.text}
                                value={confNewPassword}
                                onChangeText={setConfNewPassword}
                                secureTextEntry
                                autoCapitalize="none"
                                style={Styles.input}
                            />
                        </View>
                    </View>
                    <TouchableOpacity
                        onPress={async () => {
                            if (loading) return;
                            setLoading(true);
                            await handleConfirmResetPassword({username, confirmationCode, newPassword, confNewPassword});
                            setLoading(false);
                        }}
                        style={[Styles.actionButton, loading && { opacity: 0.5 }]}
                        disabled={loading}
                    >
                        <Text style={Styles.actionText}>Confirm</Text>
                    </TouchableOpacity>
                </View>
            </AuthBackground>
        </KeyboardAvoidingView>
    );
};

export default ResetPasswordConfirm;