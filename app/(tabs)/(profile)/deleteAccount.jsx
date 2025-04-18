import { View, Text, TouchableOpacity, TextInput } from 'react-native';
import { useState } from 'react';
import { useLocalSearchParams } from 'expo-router';
import { handleDeleteUser } from '../../../components/authComponents';
import { ProfileStyles } from '../../../constants/styles';

const DeleteAccount = () =>
{
    const { email } = useLocalSearchParams();
    const [ inputEmail, setInputEmail ] = useState();

    return (
        <View style={ProfileStyles.page}>
            <View style={ProfileStyles.textContainer}>
                <Text style={ProfileStyles.title}> Delete Account </Text>
                <Text style={ProfileStyles.subTitle}>
                    Are you sure you want to delete your account?{'\n'}
                    This action cannot be undone
                </Text>
                <TextInput
                    placeholder='Enter your email'
                    value={inputEmail}
                    onChangeText={setInputEmail}
                    autoCapitalize='none'
                    style={ProfileStyles.input}
                />
                <TouchableOpacity
                    onPress={() => handleDeleteUser({email, inputEmail})}
                    style={ProfileStyles.actionButton}    
                >
                    <Text style={{color: 'white', textAlign: 'center'}}>Delete</Text>
                </TouchableOpacity>
            </View>
        </View>
    )
};

export default DeleteAccount;