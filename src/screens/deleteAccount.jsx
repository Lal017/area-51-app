import Colors from '../../constants/colors';
import { ActionButton, Background, ErrorDisplay } from '../../components/components';
import { handleDeleteAccount } from '../../components/authComponents';
import { Styles } from '../../constants/styles';
import { useApp } from '../../components/context';
import { View, Text, TouchableOpacity, TextInput } from 'react-native';
import { useState } from 'react';
import { Ionicons, FontAwesome } from '@expo/vector-icons';
import { textSize } from '../../constants/utils';

const DeleteAccount = () =>
{
    const { client, userId, identityId, email } = useApp();
    const [ inputEmail, setInputEmail ] = useState();
    const [ step, setStep ] = useState(1);
    const [ errorMessage, setErrorMessage ] = useState(undefined);
    const [ missingEmail, setMissingEmail ] = useState(false);

    return (
        <Background>
            { step === 1 ? (
                <>
                    <View style={Styles.block}>
                        <View style={[Styles.infoContainer, {rowGap: 10}]}>
                            <Text style={Styles.headerTitle}>Note</Text>
                            <Text style={Styles.tabHeader}>Deleting your account will <Text style={Styles.text}>PERMANENTLY</Text> remove all your data and settings. This action <Text style={Styles.text}>CANNOT</Text> be undone. Are you sure you wish to continue?</Text>
                        </View>
                    </View>
                    <TouchableOpacity
                        style={[Styles.actionButton, {backgroundColor: 'rgba(0,0,0,0.25)', borderWidth: 1, borderColor: 'red'}]}
                        onPress={() => setStep(2)}
                    >
                        <Text style={[Styles.actionText, {color: 'red'}]}>Continue</Text>
                    </TouchableOpacity>
                </>
            ) : step === 2 ? (
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
                                    placeholderTextColor={Colors.grayText}
                                    value={inputEmail}
                                    onChangeText={setInputEmail}
                                    autoCapitalize='none'
                                    style={[Styles.input, missingEmail && !inputEmail && {borderColor: 'red', borderBottomWidth: 2}]}
                                />
                            </View>
                            {missingEmail && !inputEmail && (<Text style={[Styles.text, {color: 'red', paddingLeft: 30, fontSize: textSize(13)}]}>Missing Email</Text>)}
                        </View>
                    </View>
                    { errorMessage && (
                        <ErrorDisplay message={errorMessage}/>
                    )}
                    <View style={Styles.block}>
                        <ActionButton
                            text='Delete'
                            primaryColor={Colors.error}
                            secondaryColor={Colors.errorShade}
                            onPress={async () => {
                                if (!inputEmail) { setMissingEmail(true); return; }
                                setErrorMessage(await handleDeleteAccount(client, userId, identityId, email, inputEmail));
                            }}
                        />
                    </View>
                </>
            ) : null }
        </Background>
    )
};

export default DeleteAccount;