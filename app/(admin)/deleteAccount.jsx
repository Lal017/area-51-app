import { View, Text, TouchableOpacity, TextInput } from 'react-native';
import { useState } from 'react';
import { handleDeleteUser } from '../../components/authComponents';
import { ProfileStyles, Styles } from '../../constants/styles';
import { useApp } from '../../components/context';
import { Ionicons } from '@expo/vector-icons';

const DeleteAccount = () =>
{
    const { email } = useApp();
    const [ inputEmail, setInputEmail ] = useState();

    return (
        <View style={Styles.page}>
            <View style={[ProfileStyles.textContainer, {alignItems: 'center'}]}>
                <Text style={Styles.subTitle}>NOTICE</Text>
                <Text style={[Styles.text, {textAlign: 'center'}]}>
                    Deleting your account will remove all your data and settings.
                    Are you sure you want to delete your account?
                </Text>
                <Text style={[Styles.text, {fontWeight: 'bold'}]}>This action cannot be undone</Text>
                <View style={Styles.inputWrapper}>
                    <Ionicons name='mail' size={20} style={Styles.icon} />
                    <TextInput
                        placeholder='Enter your email'
                        value={inputEmail}
                        onChangeText={setInputEmail}
                        autoCapitalize='none'
                        style={Styles.input}
                    />
                </View>
            </View>
            <TouchableOpacity
                onPress={() => handleDeleteUser({email, inputEmail})}
                style={Styles.actionButton}    
            >
                <Text style={Styles.actionText}>Delete</Text>
            </TouchableOpacity>
        </View>
    )
};

export default DeleteAccount;