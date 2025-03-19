import { View, Text, TextInput, TouchableOpacity } from 'react-native';
import { useState } from 'react';
import { ProfileStyles } from '../../../constants/styles';
import { handleUpdatePassword } from '../../../components/authComponents';

const changePassword = () =>
{
    const [oldPassword, setOldPassword] = useState();
    const [newPassword, setNewPassword] = useState();
    const [confNewPassword, setConfNewPassword] = useState();

    return(
        <View style={ProfileStyles.page}>
            <View style={ProfileStyles.changePassContainer}>
                <Text style={ProfileStyles.title}>Change Password</Text>
                <View style={ProfileStyles.inputContainer}>
                    <TextInput
                        placeholder='Old Password'
                        value={oldPassword}
                        onChangeText={setOldPassword}
                        secureTextEntry
                        autoCapitalize='none'
                        style={ProfileStyles.input}
                    />
                    <TextInput
                        placeholder='New Password'
                        value={newPassword}
                        onChangeText={setNewPassword}
                        secureTextEntry
                        autoCapitalize='none'
                        style={ProfileStyles.input}
                    />
                    <TextInput
                        placeholder='Confirm New Password'
                        value={confNewPassword}
                        onChangeText={setConfNewPassword}
                        secureTextEntry
                        autoCapitalize='none'
                        style={ProfileStyles.input}
                    />
                </View>
                <TouchableOpacity
                    onPress={() => handleUpdatePassword({oldPassword, newPassword, confNewPassword})}
                    style={ProfileStyles.actionButton}>
                    <Text style={{color: 'white', textAlign: 'center'}}>Change</Text>
                </TouchableOpacity>
            </View>
        </View>
    )
};

export default changePassword;