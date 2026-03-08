import Colors from '../../constants/colors';
import { Background } from '../../components/components';
import { ProfileStyles, Styles } from '../../constants/styles';
import { handleUpdatePassword } from '../../components/authComponents';
import { View, Text, TextInput, TouchableOpacity, KeyboardAvoidingView } from 'react-native';
import { useEffect, useState } from 'react';
import { Feather, FontAwesome, Ionicons, MaterialCommunityIcons, MaterialIcons } from '@expo/vector-icons';
import { RFValue } from 'react-native-responsive-fontsize';

const ResetPassword = () =>
{
    const [ oldPassword, setOldPassword ] = useState(undefined);
    const [ newPassword, setNewPassword ] = useState('');
    const [ confNewPassword, setConfNewPassword ] = useState(undefined);
    const [ loading, setLoading ] = useState(false);
    const [ showOldPassword, setShowOldPassword ] = useState(false);
    const [ showPassword, setShowPassword ] = useState(false);
    const [ showConfirmPassword, setShowConfirmPassword ] = useState(false);
    const [ hasEightChar, setHasEightChar ] = useState(false);
    const [ hasUppercase, setHasUppercase ] = useState(false);
    const [ hasLowercase, setHasLowercase ] = useState(false);
    const [ hasNumber, setHasNumber ] = useState(false);
    const [ errorMessage, setErrorMessage ] = useState(undefined);
    const [ errorCheck, setErrorCheck ] = useState(false);

    useEffect(() => {
        const checkPassword = () =>
        {
            if (newPassword?.length >= 8) setHasEightChar(true);
            else setHasEightChar(false);

            if (/[A-Z]/.test(newPassword)) setHasUppercase(true);
            else setHasUppercase(false);

            if (/[a-z]/.test(newPassword)) setHasLowercase(true);
            else setHasLowercase(false);

            if (/[0-9]/.test(newPassword)) setHasNumber(true);
            else setHasNumber(false);
        };

        checkPassword();
    }, [newPassword]);

    return(
        <KeyboardAvoidingView
            behavior='padding'
            style={{flex: 1}}
        >
            <Background>
                <View style={Styles.block}>
                    <View style={{rowGap: 5}}>
                        <Text style={[Styles.text, {paddingLeft: 20}]}>Current Password</Text>
                        <View>
                            <View style={Styles.inputWrapper}>
                                <Ionicons name='lock-open' size={20} style={Styles.icon} />
                                <TextInput
                                    placeholder='Current Password'
                                    placeholderTextColor={Colors.subText}
                                    value={oldPassword}
                                    onChangeText={setOldPassword}
                                    secureTextEntry={!showOldPassword}
                                    autoCapitalize='none'
                                    style={[Styles.input, !oldPassword && errorCheck && {borderColor: 'red'}]}
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
                            {errorCheck && !oldPassword && (<Text style={[Styles.text, {color: 'red', paddingLeft: 30, fontSize: RFValue(13)}]}>Missing Password</Text>)}
                        </View>
                    </View>
                    <View style={{rowGap: 5}}>
                        <Text style={[Styles.text, {paddingLeft: 20}]}>New Password</Text>
                        <View>
                            <View style={Styles.inputWrapper}>
                                <MaterialIcons name='lock-reset' size={20} style={Styles.icon} />
                                <TextInput
                                    placeholder='New Password'
                                    placeholderTextColor={Colors.subText}
                                    value={newPassword}
                                    onChangeText={setNewPassword}
                                    secureTextEntry={!showPassword}
                                    autoCapitalize='none'
                                    style={[Styles.input, !newPassword && errorCheck && {borderColor: 'red'}]}
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
                            {errorCheck && !newPassword && (<Text style={[Styles.text, {color: 'red', paddingLeft: 30, fontSize: RFValue(13)}]}>Missing New Password</Text>)}
                        </View>
                    </View>
                    <View style={ProfileStyles.requirementsContainer}>
                        <View style={ProfileStyles.requirementsWrapper}>
                            <Feather name={hasEightChar ? 'check' : 'x'} size={15} color={hasEightChar ? Colors.primary : 'red'}/>
                            <Text style={Styles.text}>8 characters</Text>
                        </View>
                        <View style={ProfileStyles.requirementsWrapper}>
                            <Feather name={hasUppercase ? 'check' : 'x'} size={15} color={hasUppercase ? Colors.primary : 'red'}/>
                            <Text style={Styles.text}>Uppercase character</Text>
                        </View>
                        <View style={ProfileStyles.requirementsWrapper}>
                            <Feather name={hasLowercase ? 'check' : 'x'} size={15} color={hasLowercase ? Colors.primary : 'red'}/>
                            <Text style={Styles.text}>Lowercase character</Text>
                        </View>
                        <View style={ProfileStyles.requirementsWrapper}>
                            <Feather name={hasNumber ? 'check' : 'x'} size={15} color={hasNumber ? Colors.primary : 'red'}/>
                            <Text style={Styles.text}>At least one number ( 0 - 9 )</Text>
                        </View>
                    </View>
                    <View style={{rowGap: 5}}>
                        <Text style={[Styles.text, {paddingLeft: 20}]}>Confirm New Password</Text>
                        <View>
                            <View style={Styles.inputWrapper}>
                                <MaterialCommunityIcons name='lock-check' size={20} style={Styles.icon} />
                                <TextInput
                                    placeholder='Confirm New Password'
                                    placeholderTextColor={Colors.subText}
                                    value={confNewPassword}
                                    onChangeText={setConfNewPassword}
                                    secureTextEntry={!showConfirmPassword}
                                    autoCapitalize='none'
                                    style={[Styles.input, !confNewPassword && errorCheck && {borderColor: 'red'}]}
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
                            {errorCheck && !confNewPassword && (<Text style={[Styles.text, {color: 'red', paddingLeft: 30, fontSize: RFValue(13)}]}>Missing New Password Confirmation</Text>)}
                        </View>
                    </View>
                </View>
                <View style={[Styles.block, {alignItems: 'center', paddingTop: 0}]}>
                    { errorMessage ? (
                        <View style={Styles.errorContainer}>
                            <FontAwesome name='exclamation-circle' size={20} style={[Styles.icon, {color: 'red'}]}/>
                            <Text style={Styles.errorText}>{errorMessage}</Text>
                        </View>
                    ) : null }
                    <TouchableOpacity
                        onPress={async () => {
                            if (loading) return;
                            setLoading(true);
                            setErrorCheck(true);
                            if (!oldPassword || !newPassword || !confNewPassword) { setLoading(false); return; }
                            setErrorMessage(await handleUpdatePassword(oldPassword, newPassword, confNewPassword));
                            setLoading(false);
                        }}
                        style={[Styles.actionButton, loading && { opacity: 0.5 }, {backgroundColor: Colors.primary}]}
                        disabled={loading}>
                        <Text style={Styles.actionText}>Reset</Text>
                    </TouchableOpacity>
                </View>
            </Background>
        </KeyboardAvoidingView>
    );
};

export default ResetPassword;