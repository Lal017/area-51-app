import { View, Text, TextInput, KeyboardAvoidingView, TouchableOpacity } from "react-native";
import { Styles } from "../../constants/styles";
import { Ionicons } from '@expo/vector-icons';
import { useState } from "react";
import { handleResetPassword } from "../../components/authComponents";

const resetPassword = () =>
{
    const [username, setUsername] = useState();

    return (
        <KeyboardAvoidingView style={Styles.page} >
            <View style={Styles.container}>
                <Text style={Styles.title}>Reset Password</Text>
                <View style={Styles.inputWrapper}>
                    <Ionicons name='mail' size={20} style={Styles.icon} />
                    <TextInput
                        placeholder="email"
                        value={username}
                        onChangeText={setUsername}
                        keyboardType="email-address"
                        autoCapitalize="none"
                        style={Styles.input}
                    />
                </View>
                <TouchableOpacity
                    onPress={() => handleResetPassword({username})}
                    style={Styles.actionButton}
                >
                    <Text style={Styles.actionText}>Reset</Text>
                </TouchableOpacity>
            </View>
        </KeyboardAvoidingView>
    );
};

export default resetPassword;