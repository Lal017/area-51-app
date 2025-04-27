import { View, Text, TouchableOpacity, TextInput } from 'react-native';
import { useState } from 'react';
import { handleDeleteUser } from '../../../components/authComponents';
import { ProfileStyles } from '../../../constants/styles';
import { useApp } from '../../../components/context';
import { Ionicons } from '@expo/vector-icons';

const DeleteAccount = () =>
{
    const { email } = useApp();
    const [ inputEmail, setInputEmail ] = useState();

    return (
        <View style={ProfileStyles.page}>
            <View style={[ProfileStyles.textContainer, {alignItems: 'center'}]}>
                <Text style={ProfileStyles.description}>
                    Are you sure you want to delete your account?
                </Text>
                <Text style={ProfileStyles.description}>This action cannot be undone</Text>
                <View style={ProfileStyles.inputWrapper}>
                    <Ionicons name='mail' size={20} style={ProfileStyles.icon} />
                    <TextInput
                        placeholder='Enter your email'
                        value={inputEmail}
                        onChangeText={setInputEmail}
                        autoCapitalize='none'
                        style={ProfileStyles.input}
                    />
                </View>
            </View>
            <TouchableOpacity
                onPress={() => handleDeleteUser({email, inputEmail})}
                style={ProfileStyles.actionButton}    
            >
                <Text style={{color: 'white', textAlign: 'center'}}>Delete</Text>
            </TouchableOpacity>
        </View>
    )
};

export default DeleteAccount;