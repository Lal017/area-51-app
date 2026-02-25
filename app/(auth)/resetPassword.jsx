import Colors from "../../constants/colors";
import { Styles, AuthStyles } from "../../constants/styles";
import { handleResetPassword } from "../../components/authComponents";
import { AuthBackground } from "../../components/components";
import { FontAwesome, Ionicons } from '@expo/vector-icons';
import { useState } from "react";
import { View, Text, TextInput, TouchableOpacity, Image } from "react-native";
import { Link } from "expo-router";

const ResetPassword = () =>
{
    const [email, setEmail] = useState();
    const [loading, setLoading] = useState(false);
    const [errorMessage, setErrorMessage] = useState(undefined);
    const [missingEmail, setMissingEmail] = useState(false);
    return (
        <AuthBackground>
            <View style={AuthStyles.imgContainer}>
                <Image
                    source={require('../../assets/images/a51-login-logo.png')}
                    style={AuthStyles.logoImg}
                />
            </View>
            <View style={[Styles.block, {alignItems: 'center'}]}>
                <View style={Styles.infoContainer}>
                    <Text style={Styles.headerTitle}>Reset Password</Text>
                    <Text style={Styles.tabHeader}>Enter your email to search for your account</Text>
                </View>
                <View style={Styles.inputWrapper}>
                    <Ionicons name='mail' size={20} style={Styles.icon} />
                    <TextInput
                        placeholder="email"
                        placeholderTextColor={Colors.subText}
                        value={email}
                        onChangeText={setEmail}
                        keyboardType="email-address"
                        autoCapitalize="none"
                        style={[Styles.input, missingEmail && {borderColor: 'red'}]}
                    />
                </View>
                { errorMessage ? (
                    <View style={Styles.errorContainer}>
                        <FontAwesome name='exclamation-circle' size={20} style={[Styles.icon, {color: 'red'}]}/>
                        <Text style={[Styles.text, {color: 'red'}]}>{errorMessage}</Text>
                    </View>
                ) : null}
                <TouchableOpacity
                    onPress={async () => {
                        if (loading) return;
                        setLoading(true);

                        setErrorMessage(await handleResetPassword(email));
                        if (!email) setMissingEmail(true);
                        else setMissingEmail(false);
                        
                        setLoading(false);
                    }}
                    style={[Styles.actionButton, loading && { opacity: 0.5 }]}
                    disabled={loading}
                >
                    <Text style={Styles.actionText}>Continue</Text>
                </TouchableOpacity>
                <Link href="/(auth)/signIn" style={[Styles.text, {textAlign: 'center'}]}>Sign In</Link>
            </View>
        </AuthBackground>
    );
};

export default ResetPassword;