import { View, Text, TouchableOpacity, TextInput } from 'react-native';
import { useState } from 'react';
import { handleDeleteUser } from '../../../components/authComponents';
import { Styles } from '../../../constants/styles';
import { useApp } from '../../../components/context';
import { Ionicons } from '@expo/vector-icons';

const DeleteAccount = () =>
{
    const { email } = useApp();
    const [ inputEmail, setInputEmail ] = useState();

    return (
        <View style={[Styles.page, {rowGap: 25}]}>
            <View style={[Styles.infoContainer, {paddingTop: '25%'}]}>
                <Text style={Styles.subTitle}>CAUTION</Text>
                <Text style={Styles.text}>
                    Deleting your account will remove all your data and settings.
                    Are you sure you want to delete your account?
                </Text>
                <Text style={[Styles.text, {fontWeight: 'bold'}]}>This action cannot be undone</Text>
            </View>
            <View style={Styles.inputContainer}>
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
                <TouchableOpacity
                    onPress={() => handleDeleteUser({email, inputEmail})}
                    style={[Styles.actionButton, {backgroundColor: 'red'}]}
                >
                    <Text style={Styles.actionText}>Delete</Text>
                </TouchableOpacity>
            </View>
        </View>
    )
};

export default DeleteAccount;