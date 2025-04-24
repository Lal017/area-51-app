import { View, Text, TextInput, KeyboardAvoidingView, TouchableOpacity } from "react-native";
import { AuthStyles } from "../../constants/styles";
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
        <KeyboardAvoidingView style={AuthStyles.page} >
            <View style={AuthStyles.container}>
                <Text style={AuthStyles.title}>Reset Password</Text>
                <View style={AuthStyles.inputContainer}>
                    <View style={AuthStyles.inputWrapper}>
                        <MaterialIcons name='numbers' size={20} style={AuthStyles.icon} />
                        <TextInput
                            placeholder="Verification Code"
                            value={confirmationCode}
                            onChangeText={setConfirmationCode}
                            keyboardType="numeric"
                            autoCapitalize="none"
                            style={AuthStyles.input}
                        />
                    </View>
                    <View style={AuthStyles.inputWrapper}>
                        <Ionicons name='key' size={20} style={AuthStyles.icon} />
                        <TextInput
                            placeholder="New Password"
                            value={newPassword}
                            onChangeText={setNewPassword}
                            secureTextEntry
                            autoCapitalize="none"
                            style={AuthStyles.input}
                        />
                    </View>
                    <View style={AuthStyles.inputWrapper}>
                        <Ionicons name="lock-open" size={20} style={AuthStyles.icon} />
                        <TextInput
                            placeholder="Confirm New Password"
                            value={confNewPassword}
                            onChangeText={setConfNewPassword}
                            secureTextEntry
                            autoCapitalize="none"
                            style={AuthStyles.input}
                        />
                    </View>
                </View>
                <TouchableOpacity
                    onPress={() => handleConfirmResetPassword({username, confirmationCode, newPassword, confNewPassword})}
                    style={AuthStyles.actionButton}
                >
                    <Text style={{color: 'white', textAlign: 'center'}}>Confirm</Text>
                </TouchableOpacity>
            </View>
        </KeyboardAvoidingView>
    );
};

export default resetPasswordConfirm;