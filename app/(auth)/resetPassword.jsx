import { View, Text, TextInput, TouchableOpacity, Image } from "react-native";
import { Link } from "expo-router";
import { Styles, AuthStyles } from "../../constants/styles";
import { Ionicons } from '@expo/vector-icons';
import { useState } from "react";
import { handleResetPassword } from "../../components/authComponents";
import Colors from "../../constants/colors";

const resetPassword = () =>
{
    const [username, setUsername] = useState();

    return (
        <View style={Styles.page}>
            <View style={AuthStyles.imgContainer}>
                <Image
                    source={require('../../assets/images/a51-login-logo.png')}
                    style={AuthStyles.logoImg}
                />
            </View>
            <View style={[Styles.block, {alignItems: 'center', rowGap: 25}]}>
                <Text style={[Styles.title, {paddingLeft: 20}]}>Reset Password</Text>
                <Text style={Styles.text}>Enter your email to search for your account</Text>
                <View style={Styles.inputWrapper}>
                    <Ionicons name='mail' size={20} style={Styles.icon} />
                    <TextInput
                        placeholder="email"
                        placeholderTextColor={Colors.text}
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
                <Link href="/(auth)/signIn" style={[Styles.text, {textAlign: 'center'}]}>Sign In</Link>
            </View>
        </View>
    );
};

export default resetPassword;