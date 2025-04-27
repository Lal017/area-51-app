import { View, Text, TextInput, TouchableOpacity, KeyboardAvoidingView } from 'react-native';
import { useState } from 'react';
import { ProfileStyles } from '../../../constants/styles';
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
            style={ProfileStyles.page}>
            <View style={ProfileStyles.formContainer}>
                <View style={ProfileStyles.inputContainer}>
                    <View style={ProfileStyles.inputWrapper}>
                        <Ionicons name='lock-open' size={20} style={ProfileStyles.icon} />
                        <TextInput
                            placeholder='Old Password'
                            value={oldPassword}
                            onChangeText={setOldPassword}
                            secureTextEntry
                            autoCapitalize='none'
                            style={ProfileStyles.input}
                        />
                    </View>
                    <View style={ProfileStyles.inputWrapper}>
                        <MaterialIcons name='lock-reset' size={20} style={ProfileStyles.icon} />
                        <TextInput
                            placeholder='New Password'
                            value={newPassword}
                            onChangeText={setNewPassword}
                            secureTextEntry
                            autoCapitalize='none'
                            style={ProfileStyles.input}
                        />
                    </View>
                    <View style={ProfileStyles.inputWrapper}>
                        <MaterialCommunityIcons name='lock-check' size={20} style={ProfileStyles.icon} />
                        <TextInput
                            placeholder='Confirm New Password'
                            value={confNewPassword}
                            onChangeText={setConfNewPassword}
                            secureTextEntry
                            autoCapitalize='none'
                            style={ProfileStyles.input}
                        />
                    </View>
                </View>
                <TouchableOpacity
                    onPress={() => handleUpdatePassword({oldPassword, newPassword, confNewPassword})}
                    style={ProfileStyles.actionButton}>
                    <Text style={{color: 'white', textAlign: 'center'}}>Change</Text>
                </TouchableOpacity>
            </View>
        </KeyboardAvoidingView>
    );
};

export default changePassword;