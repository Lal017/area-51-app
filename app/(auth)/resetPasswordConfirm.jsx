import { View, Text, TextInput, KeyboardAvoidingView, TouchableOpacity, StatusBar } from "react-native";
import { Styles } from "../../constants/styles";
import { useState } from "react";
import { useLocalSearchParams } from "expo-router";
import { handleConfirmResetPassword } from "../../components/authComponents";
import { Ionicons, MaterialIcons } from "@expo/vector-icons";

const resetPasswordConfirm = () =>
{
    const { username } = useLocalSearchParams();
    const [confirmationCode, setConfirmationCode] = useState();
    const [newPassword, setNewPassword] = useState();
    const [confNewPassword, setConfNewPassword] = useState();

    return (
        <KeyboardAvoidingView style={Styles.page} >
            <StatusBar barStyle="light-content" hidden={true}/>
            <View style={Styles.container}>
                <Text style={Styles.title}>Reset Password</Text>
                <Text style={[Styles.text, {width: '85%', textAlign: 'center'}]}>Check your email for your verification code!</Text>
                <View style={Styles.inputContainer}>
                    <View style={Styles.inputWrapper}>
                        <MaterialIcons name='numbers' size={20} style={Styles.icon} />
                        <TextInput
                            placeholder="Verification Code"
                            value={confirmationCode}
                            onChangeText={setConfirmationCode}
                            keyboardType="numeric"
                            autoCapitalize="none"
                            style={Styles.input}
                        />
                    </View>
                    <View style={Styles.inputWrapper}>
                        <Ionicons name='key' size={20} style={Styles.icon} />
                        <TextInput
                            placeholder="New Password"
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
                            value={confNewPassword}
                            onChangeText={setConfNewPassword}
                            secureTextEntry
                            autoCapitalize="none"
                            style={Styles.input}
                        />
                    </View>
                </View>
                <TouchableOpacity
                    onPress={() => handleConfirmResetPassword({username, confirmationCode, newPassword, confNewPassword})}
                    style={Styles.actionButton}
                >
                    <Text style={Styles.actionText}>Confirm</Text>
                </TouchableOpacity>
            </View>
        </KeyboardAvoidingView>
    );
};

export default resetPasswordConfirm;