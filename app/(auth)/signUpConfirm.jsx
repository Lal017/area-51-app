import { View, Text, TextInput, TouchableOpacity, Image} from 'react-native';
import { useState } from 'react';
import { useLocalSearchParams } from 'expo-router';
import { Styles, AuthStyles } from '../../constants/styles';
import { handleSignUpConfirm, handleResendSignUpCode } from '../../components/authComponents';
import Colors from '../../constants/colors';
import { MaterialIcons } from '@expo/vector-icons';

const signUpConfirm = () =>
{
    const { username } = useLocalSearchParams();
    const [confirmationCode, setCode] = useState();

    return (
        <View style={Styles.page}>
            <View style={AuthStyles.imgContainer}>
                <Image
                    source={require('../../assets/images/a51-login-logo.png')}
                    style={AuthStyles.logoImg}
                />
            </View>
            <View style={[Styles.block, {alignItems: 'center', rowGap: 25}]}>
                <View style={Styles.infoContainer}>
                    <Text style={Styles.title}>Confirm Sign Up</Text>
                    <Text style={Styles.text}>Check your email for your verification code!</Text>
                </View>
                <View style={Styles.inputWrapper}>
                    <MaterialIcons name='numbers' size={20} style={Styles.icon} />
                    <TextInput
                        placeholder='Verification Code'
                        placeholderTextColor={Colors.text}
                        value={confirmationCode}
                        onChangeText={setCode}
                        autoCapitalize='none'
                        keyboardType='number-pad'
                        style={Styles.input}
                    />
                </View>
                <TouchableOpacity
                    onPress={() => handleSignUpConfirm({username, confirmationCode})}
                    style={Styles.actionButton}
                >
                    <Text style={Styles.actionText}>Confirm</Text>
                </TouchableOpacity>
                <TouchableOpacity
                    onPress={() => handleResendSignUpCode({username})}
                >
                    <Text style={Styles.actionText}>Resend Code</Text>
                </TouchableOpacity>
            </View>
        </View>
    );
};

export default signUpConfirm;