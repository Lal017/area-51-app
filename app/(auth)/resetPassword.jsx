import { View, Text, TextInput, KeyboardAvoidingView, TouchableOpacity } from "react-native";
import { AuthStyles } from "../../constants/styles";
import { Ionicons } from '@expo/vector-icons';
import { useState } from "react";
import { handleResetPassword } from "../../components/authComponents";

const resetPassword = () =>
{
    const [username, setUsername] = useState();

    return (
        <KeyboardAvoidingView style={AuthStyles.page} >
            <View style={AuthStyles.container}>
                <Text style={AuthStyles.title}>Reset Password</Text>
                <View style={AuthStyles.inputWrapper}>
                    <Ionicons name='mail' size={20} style={AuthStyles.icon} />
                    <TextInput
                        placeholder="email"
                        value={username}
                        onChangeText={setUsername}
                        keyboardType="email-address"
                        autoCapitalize="none"
                        style={AuthStyles.input}
                    />
                </View>
                <TouchableOpacity
                    onPress={() => handleResetPassword({username})}
                    style={AuthStyles.actionButton}
                >
                    <Text style={{color: 'white', textAlign: 'center'}}>Reset</Text>
                </TouchableOpacity>
            </View>
        </KeyboardAvoidingView>
    );
};

export default resetPassword;