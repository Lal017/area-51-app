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
                        <View style={[Styles.infoContainer, {rowGap: 10}]}>
                            <Text style={Styles.headerTitle}>Note</Text>
                            <Text style={Styles.tabHeader}>Deleting your account will <Text style={Styles.text}>PERMANENTLY</Text> remove all your data and settings. This action <Text style={Styles.text}>CANNOT</Text> be undone. Are you sure you wish to continue?</Text>
                        </View>
                    </View>
                    <TouchableOpacity
                        style={[Styles.actionButton, {backgroundColor: 'rgba(0,0,0,0.25)', elevation: 0, alignSelf: 'center', borderWidth: 1, borderColor: 'red'}]}
                        onPress={() => setStep(2)}
                    >
                        <Text style={[Styles.actionText, {color: 'red'}]}>Continue</Text>
                    </TouchableOpacity>
                </>
            ) : step === 2 && !loading ? (
                <>
                    <View style={Styles.block}>
                        <View style={Styles.infoContainer}>
                            <Text style={Styles.headerTitle}>Confirmation</Text>
                            <Text style={Styles.tabHeader}>Enter your email to confirm account deletion</Text>
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
                        <View style={Styles.block}>
                            <View style={Styles.errorContainer}>
                                <FontAwesome name='exclamation-circle' size={20} style={[Styles.icon, {color: 'red'}]}/>
                                <Text style={Styles.errorText}>{errorMessage}</Text>
                            </View>
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