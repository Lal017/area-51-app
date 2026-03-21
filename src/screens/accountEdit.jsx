import Colors from "../../constants/colors";
import { Styles } from "../../constants/styles";
import { ActionButton, Background } from "../../components/components";
import { handleUpdateAttributes } from "../../components/authComponents";
import { useApp } from "../../components/context";
import { useState } from "react";
import { View, Text, TextInput, KeyboardAvoidingView } from "react-native";
import { FontAwesome, Ionicons } from "@expo/vector-icons";
import { textSize } from "../../constants/utils";

const AccountEdit = () =>
{
    const { firstName, lastName, email, phoneNumber, setFirstName, setLastName, setPhoneNumber, isMissingAttr, setIsMissingAttr } = useApp();
    
    const [ editFirstName, setEditFirstName ] = useState(firstName);
    const [ editLastName, setEditLastName ] = useState(lastName);
    const [ editEmail, setEditEmail ] = useState(email);
    const [ editPhone, setEditPhone ] = useState(phoneNumber?.slice(2,12));
    const [ errorMessage, setErrorMessage ] = useState(false);
    
    return(
        <KeyboardAvoidingView
            behavior="padding"
            style={{flex: 1}}
        >
            <Background>
                <View style={Styles.block}>
                    <View style={{rowGap: 5}}>
                        <Text style={[Styles.text, {paddingLeft: 20}]}>Name</Text>
                        <View>
                            <View style={Styles.inputWrapper}>
                                <Ionicons name="person" size={20} style={Styles.icon} />
                                <TextInput
                                    placeholder="first name"
                                    placeholderTextColor={Colors.grayText}
                                    value={editFirstName}
                                    onChangeText={setEditFirstName}
                                    style={[Styles.input, !editFirstName && {borderColor: 'red', borderBottomWidth: 2}]}
                                />
                            </View>
                            {!editFirstName && (<Text style={[Styles.text, {color: 'red', paddingLeft: 25, fontSize: textSize(13)}]}>Missing First Name</Text>)}
                        </View>
                        <View>
                            <View style={Styles.inputWrapper}>
                                <Ionicons name="person" size={20} style={Styles.icon} />
                                <TextInput
                                    placeholder="last name"
                                    placeholderTextColor={Colors.grayText}
                                    value={editLastName}
                                    onChangeText={setEditLastName}
                                    style={[Styles.input, !editLastName && {borderColor: 'red', borderBottomWidth: 2}]}
                                />
                            </View>
                            {!editLastName && (<Text style={[Styles.text, {color: 'red', paddingLeft: 25, fontSize: textSize(13)}]}>Missing Last Name</Text>)}
                        </View>
                    </View>
                    <View style={{rowGap: 5}}>
                        <Text style={[Styles.text, {paddingLeft: 20}]}>Email</Text>
                        <View>
                            <View style={Styles.inputWrapper}>
                                <Ionicons name="mail" size={20} style={Styles.icon} />
                                <TextInput
                                    placeholder="email"
                                    placeholderTextColor={Colors.grayText}
                                    value={editEmail}
                                    onChangeText={setEditEmail}
                                    autoCapitalize='none'
                                    style={[Styles.input, !editEmail && {borderColor: 'red', borderBottomWidth: 2}]}
                                />
                            </View>
                            {!editEmail && (<Text style={[Styles.text, {color: 'red', paddingLeft: 25, fontSize: textSize(13)}]}>Missing Email</Text>)}
                        </View>
                    </View>
                    <View style={{rowGap: 5}}>
                        <Text style={[Styles.text, {paddingLeft: 20}]}>Phone Number</Text>
                        <View>
                            <View style={Styles.inputWrapper}>
                                <Ionicons name="call" size={20} style={Styles.icon} />
                                <TextInput
                                    placeholder="phone number"
                                    placeholderTextColor={Colors.grayText}
                                    value={editPhone}
                                    onChangeText={setEditPhone}
                                    keyboardType="phone-pad"
                                    style={[Styles.input, !editPhone && {borderColor: 'red', borderBottomWidth: 2}]}
                                />
                            </View>
                            {!editPhone && (<Text style={[Styles.text, {color: 'red', paddingLeft: 25, fontSize: textSize(13)}]}>Missing Phone Number</Text>)}
                        </View>
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
                <View style={Styles.block}>
                    <ActionButton
                        text='Update'
                        primaryColor={Colors.primary}
                        secondaryColor={Colors.primaryShade}
                        onPress={async () => {
                            const errMsg = await handleUpdateAttributes(
                                isMissingAttr,
                                editEmail,
                                editFirstName,
                                editLastName,
                                editPhone.replace(/\D/g, ''),
                                setFirstName,
                                setLastName,
                                setPhoneNumber
                            );
                            if (!errMsg) setIsMissingAttr(false);
                            else setErrorMessage(errMsg);
                        }}
                    />
                </View>
            </Background>
        </KeyboardAvoidingView>
    );
};

export default AccountEdit;