import Colors from '../../constants/colors';
import { Background } from '../../components/components';
import { handleDeleteAccount } from '../../components/authComponents';
import { Styles } from '../../constants/styles';
import { useApp } from '../../components/context';
import { View, Text, TouchableOpacity, TextInput, ActivityIndicator } from 'react-native';
import { useState } from 'react';
import { Ionicons, FontAwesome } from '@expo/vector-icons';
import { RFValue } from 'react-native-responsive-fontsize';

const DeleteAccount = () =>
{
    const { client, userId, identityId, email } = useApp();
    const [ inputEmail, setInputEmail ] = useState();
    const [ step, setStep ] = useState(1);
    const [ loading, setLoading ] = useState(false);
    const [ errorMessage, setErrorMessage ] = useState(undefined);
    const [ missingEmail, setMissingEmail ] = useState(false);

    return (
        <Background>
            { step === 1 && !loading ? (
                <>
                    <View style={Styles.block}>
                        <View style={Styles.infoContainer}>
                            <Text style={[Styles.subTitle, {textAlign: 'left', color: 'red', fontWeight: 'bold'}]}>CAUTION</Text>
                            <Text style={Styles.text}>
                                Deleting your account will remove all your data and settings.
                                Are you sure you want to continue?
                            </Text>
                            <Text style={[Styles.text, {fontWeight: 'bold'}]}>THIS ACTION CANNOT BE UNDONE</Text>
                        </View>
                    </View>
                    <TouchableOpacity
                        style={Styles.actionButton}
                        onPress={() => setStep(2)}
                    >
                        <Text style={Styles.actionText}>Continue</Text>
                    </TouchableOpacity>
                </>
            ) : step === 2 && !loading ? (
                <>
                    <View style={Styles.block}>
                        <View style={Styles.infoContainer}>
                            <Text style={[Styles.subTitle, {color: 'red', fontWeight: 'bold'}]}>CONFIRM DELETION</Text>
                            <Text style={Styles.text}>Enter your email to confirm account deletion</Text>
                        </View>
                        <View>
                            <View style={Styles.inputWrapper}>
                                <Ionicons name='mail' size={20} style={Styles.icon} />
                                <TextInput
                                    placeholder='email'
                                    placeholderTextColor={Colors.subText}
                                    value={inputEmail}
                                    onChangeText={setInputEmail}
                                    autoCapitalize='none'
                                    style={[Styles.input, missingEmail && !inputEmail && {borderColor: 'red', borderBottomWidth: 2}]}
                                />
                            </View>
                            {missingEmail && !inputEmail && (<Text style={[Styles.text, {color: 'red', paddingLeft: 30, fontSize: RFValue(13)}]}>Missing Email</Text>)}
                        </View>
                    </View>
                    { errorMessage && (
                        <View style={Styles.errorContainer}>
                            <FontAwesome name='exclamation-circle' size={20} style={[Styles.icon, {color: 'red'}]}/>
                            <Text style={Styles.errorText}>{errorMessage}</Text>
                        </View>
                    )}
                    <View style={[Styles.block, {alignItems: 'center'}]}>
                        <TouchableOpacity
                            onPress={async () => {
                                if (loading || !inputEmail) { setMissingEmail(true); return;}
                                setLoading(true);
                                setErrorMessage(await handleDeleteAccount(client, userId, identityId, email, inputEmail));
                                setLoading(false);
                            }}
                            style={[Styles.actionButton, loading && { opacity: 0.5 }, {backgroundColor: Colors.redButton}]}
                            disabled={loading}
                        >
                            <Text style={Styles.actionText}>Delete</Text>
                        </TouchableOpacity>
                    </View>
                </>
            ) : loading ? (
                <View style={{flex: 1, justifyContent: 'center', alignItems: 'center'}}>
                    <ActivityIndicator size="large" color={Colors.secondary} />
                </View>
            ) : null }
        </Background>
    )
};

export default DeleteAccount;