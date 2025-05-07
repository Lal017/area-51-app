import { View, Text, TextInput, TouchableOpacity, KeyboardAvoidingView } from 'react-native';
import { useState } from 'react';
import { ProfileStyles, Styles } from '../../../constants/styles';
import { handleUpdatePassword } from '../../../components/authComponents';
import { Ionicons, MaterialCommunityIcons, MaterialIcons } from '@expo/vector-icons';

const changePassword = () =>
{
    const [oldPassword, setOldPassword] = useState();
    const [newPassword, setNewPassword] = useState();
    const [confNewPassword, setConfNewPassword] = useState();

    return(
        <KeyboardAvoidingView
            enabled={true}
            behavior='padding'
            style={Styles.page}>
            <View style={ProfileStyles.formContainer}>
                <View style={Styles.inputContainer}>
                    <View style={Styles.inputWrapper}>
                        <Ionicons name='lock-open' size={20} style={Styles.icon} />
                        <TextInput
                            placeholder='Old Password'
                            value={oldPassword}
                            onChangeText={setOldPassword}
                            secureTextEntry
                            autoCapitalize='none'
                            style={Styles.input}
                        />
                    </View>
                    <View style={Styles.inputWrapper}>
                        <MaterialIcons name='lock-reset' size={20} style={Styles.icon} />
                        <TextInput
                            placeholder='New Password'
                            value={newPassword}
                            onChangeText={setNewPassword}
                            secureTextEntry
                            autoCapitalize='none'
                            style={Styles.input}
                        />
                    </View>
                    <View style={Styles.inputWrapper}>
                        <MaterialCommunityIcons name='lock-check' size={20} style={Styles.icon} />
                        <TextInput
                            placeholder='Confirm New Password'
                            value={confNewPassword}
                            onChangeText={setConfNewPassword}
                            secureTextEntry
                            autoCapitalize='none'
                            style={Styles.input}
                        />
                    </View>
                </View>
                <TouchableOpacity
                    onPress={() => handleUpdatePassword({oldPassword, newPassword, confNewPassword})}
                    style={Styles.actionButton}>
                    <Text style={Styles.actionText}>Change</Text>
                </TouchableOpacity>
            </View>
        </KeyboardAvoidingView>
    );
};

export default changePassword;