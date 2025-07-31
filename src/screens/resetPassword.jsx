import Colors from '../../constants/colors';
import { Background } from '../../components/components';
import { Styles } from '../../constants/styles';
import { handleUpdatePassword } from '../../components/authComponents';
import { View, Text, TextInput, TouchableOpacity, KeyboardAvoidingView } from 'react-native';
import { useState } from 'react';
import { Ionicons, MaterialCommunityIcons, MaterialIcons } from '@expo/vector-icons';
import { useNavigation } from '@react-navigation/native';

const ResetPassword = () =>
{
    const navigate = useNavigation();
    const [ oldPassword, setOldPassword ] = useState();
    const [ newPassword, setNewPassword ] = useState();
    const [ confNewPassword, setConfNewPassword ] = useState();
    const [ loading, setLoading ] = useState(false);
    const [ showOldPassword, setShowOldPassword ] = useState(false);
    const [ showPassword, setShowPassword ] = useState(false);
    const [ showConfirmPassword, setShowConfirmPassword ] = useState(false);

    return(
        <KeyboardAvoidingView
            behavior='padding'
            style={{flex: 1}}
        >
            <Background>
                <View style={Styles.block}>
                    <Text style={[Styles.subTitle, {paddingLeft: 20}]}>Old Password</Text>
                    <View style={Styles.inputWrapper}>
                        <Ionicons name='lock-open' size={20} style={Styles.icon} />
                        <TextInput
                            placeholder='Old Password'
                            placeholderTextColor={Colors.text}
                            value={oldPassword}
                            onChangeText={setOldPassword}
                            secureTextEntry={!showOldPassword}
                            autoCapitalize='none'
                            style={Styles.input}
                        />
                        <TouchableOpacity
                            style={{padding: 10, position: 'absolute', right: 10}}
                            onPress={() => {
                                setShowOldPassword(prev => !prev);
                            }}
                        >
                            { showOldPassword ? (
                                <Ionicons name='eye-off' size={20} color={Colors.backDropAccent}/>
                            ) : <Ionicons name='eye' size={20} color={Colors.backDropAccent}/> }
                        </TouchableOpacity>
                    </View>
                    <Text style={[Styles.subTitle, {paddingLeft: 20}]}>New Password</Text>
                    <View style={Styles.inputWrapper}>
                        <MaterialIcons name='lock-reset' size={20} style={Styles.icon} />
                        <TextInput
                            placeholder='New Password'
                            placeholderTextColor={Colors.text}
                            value={newPassword}
                            onChangeText={setNewPassword}
                            secureTextEntry={!showPassword}
                            autoCapitalize='none'
                            style={Styles.input}
                        />
                        <TouchableOpacity
                            style={{padding: 10, position: 'absolute', right: 10}}
                            onPress={() => {
                                setShowPassword(prev => !prev);
                            }}
                        >
                            { showPassword ? (
                                <Ionicons name='eye-off' size={20} color={Colors.backDropAccent}/>
                            ) : <Ionicons name='eye' size={20} color={Colors.backDropAccent}/> }
                        </TouchableOpacity>
                    </View>
                    <Text style={[Styles.subTitle, {paddingLeft: 20}]}>Confirm New Password</Text>
                    <View style={Styles.inputWrapper}>
                        <MaterialCommunityIcons name='lock-check' size={20} style={Styles.icon} />
                        <TextInput
                            placeholder='Confirm New Password'
                            placeholderTextColor={Colors.text}
                            value={confNewPassword}
                            onChangeText={setConfNewPassword}
                            secureTextEntry={!showConfirmPassword}
                            autoCapitalize='none'
                            style={Styles.input}
                        />
                        <TouchableOpacity
                            style={{padding: 10, position: 'absolute', right: 10}}
                            onPress={() => {
                                setShowConfirmPassword(prev => !prev);
                            }}
                        >
                            { showConfirmPassword ? (
                                <Ionicons name='eye-off' size={20} color={Colors.backDropAccent}/>
                            ) : <Ionicons name='eye' size={20} color={Colors.backDropAccent}/> }
                        </TouchableOpacity>
                    </View>
                </View>
                <TouchableOpacity
                    onPress={async () => {
                        if (loading) return;
                        setLoading(true);
                        await handleUpdatePassword(navigate, oldPassword, newPassword, confNewPassword);
                        setLoading(false);
                    }}
                    style={[Styles.actionButton, loading && { opacity: 0.5 }]}
                    disabled={loading}>
                    <Text style={Styles.actionText}>Change</Text>
                </TouchableOpacity>
            </Background>
        </KeyboardAvoidingView>
    );
};

export default ResetPassword;