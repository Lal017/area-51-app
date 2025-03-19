import { View, Text, TextInput, KeyboardAvoidingView, TouchableOpacity } from "react-native";
import { AuthStyles } from "../../constants/styles";
import { useState } from "react";
import { handleResetPassword } from "../../components/authComponents";

const resetPassword = () =>
{
    const [username, setUsername] = useState();

    return (
        <KeyboardAvoidingView style={AuthStyles.page} >
            <View style={AuthStyles.backgroundContainer}>
                <View style={AuthStyles.background} />
                <View style={AuthStyles.background} />
                <View style={AuthStyles.background} />
                <View style={AuthStyles.background} />
            </View>
            <View style={AuthStyles.container}>
                <Text style={AuthStyles.title}>Reset Password</Text>
                <TextInput
                    placeholder="email"
                    value={username}
                    onChangeText={setUsername}
                    keyboardType="email-address"
                    autoCapitalize="none"
                    style={AuthStyles.input}
                />
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