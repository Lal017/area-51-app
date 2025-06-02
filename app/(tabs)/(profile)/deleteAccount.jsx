import { View, Text, TouchableOpacity, TextInput } from 'react-native';
import { useState } from 'react';
import { handleDeleteUser } from '../../../components/authComponents';
import { ServiceStyles, Styles } from '../../../constants/styles';
import { useApp } from '../../../components/context';
import { Ionicons } from '@expo/vector-icons';
import { Background } from '../../../components/components';
import Colors from '../../../constants/colors';

const DeleteAccount = () =>
{
    const { email } = useApp();
    const [ inputEmail, setInputEmail ] = useState();
    const [ step, setStep ] = useState(1);

    return (
        <Background>
            { step === 1 ? (
                <>
                    <View style={Styles.block}>
                        <View style={Styles.infoContainer}>
                            <Text style={[Styles.title, {textAlign: 'left', color: 'red', fontWeight: 'bold'}]}>CAUTION</Text>
                            <Text style={Styles.text}>
                                Deleting your account will remove all your data and settings.
                                Are you sure you want to delete your account?
                            </Text>
                            <Text style={[Styles.text, {fontWeight: 'bold'}]}>THIS ACTION CANNOT BE UNDONE</Text>
                        </View>
                    </View>
                    <View style={[Styles.block, {alignItems: 'center'}]}>
                        <TouchableOpacity
                            style={[ServiceStyles.directionButton, {backgroundColor: 'red'}]}
                            onPress={() => setStep(2)}
                        >
                            <Text style={Styles.actionText}>Continue</Text>
                        </TouchableOpacity>
                    </View>
                </>
            ) : step === 2 ? (
                <>
                    <View style={Styles.block}>
                        <View style={Styles.infoContainer}>
                            <Text style={Styles.subTitle}>Confirm</Text>
                            <Text style={Styles.text}>Enter your email to confirm account deletion</Text>
                        </View>
                        <View style={Styles.inputWrapper}>
                            <Ionicons name='mail' size={20} style={Styles.icon} />
                            <TextInput
                                placeholder='email'
                                placeholderTextColor={Colors.text}
                                value={inputEmail}
                                onChangeText={setInputEmail}
                                autoCapitalize='none'
                                style={Styles.input}
                            />
                        </View>
                    </View>
                    <TouchableOpacity
                        onPress={() => handleDeleteUser({email, inputEmail})}
                        style={[Styles.actionButton, {backgroundColor: 'red'}]}
                    >
                        <Text style={Styles.actionText}>Delete</Text>
                    </TouchableOpacity>
                </>
            ) : null }
        </Background>
    )
};

export default DeleteAccount;