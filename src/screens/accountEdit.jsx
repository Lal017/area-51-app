import Colors from "../../constants/colors";
import { Styles } from "../../constants/styles";
import { Background } from "../../components/components";
import { handleUpdateAttributes } from "../../components/authComponents";
import { useApp } from "../../components/context";
import { useState } from "react";
import { View, Text, TextInput, KeyboardAvoidingView, TouchableOpacity } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { useNavigation } from "@react-navigation/native";

const AccountEdit = () =>
{
    const { firstName, lastName, email, phoneNumber, setFirstName, setLastName, setPhoneNumber, isMissingAttr, setIsMissingAttr } = useApp();
    const navigate = useNavigation();
    
    const [ editFirstName, setEditFirstName ] = useState(firstName);
    const [ editLastName, setEditLastName ] = useState(lastName);
    const [ editEmail, setEditEmail ] = useState(email);
    const [ editPhone, setEditPhone ] = useState(phoneNumber?.slice(2,12));
    const [ loading, setLoading ] = useState(false);
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
                        <View style={Styles.inputWrapper}>
                            <Ionicons name="person" size={20} style={Styles.icon} />
                            <TextInput
                                placeholder="first name"
                                placeholderTextColor={Colors.subText}
                                value={editFirstName}
                                onChangeText={setEditFirstName}
                                style={[Styles.input, !editFirstName && {borderColor: 'red', borderWidth: 2}]}
                            />
                        </View>
                        <View style={Styles.inputWrapper}>
                            <Ionicons name="person" size={20} style={Styles.icon} />
                            <TextInput
                                placeholder="last name"
                                placeholderTextColor={Colors.subText}
                                value={editLastName}
                                onChangeText={setEditLastName}
                                style={[Styles.input, !editLastName && {borderColor: 'red', borderWidth: 2}]}
                            />
                        </View>
                    </View>
                    <View style={{rowGap: 5}}>
                        <Text style={[Styles.text, {paddingLeft: 20}]}>Email</Text>
                        <View style={Styles.inputWrapper}>
                            <Ionicons name="mail" size={20} style={Styles.icon} />
                            <TextInput
                                placeholder="email"
                                placeholderTextColor={Colors.subText}
                                value={editEmail}
                                onChangeText={setEditEmail}
                                autoCapitalize='none'
                                style={[Styles.input, !editEmail && {borderColor: 'red', borderWidth: 2}]}
                            />
                        </View>
                    </View>
                    <View style={{rowGap: 5}}>
                        <Text style={[Styles.text, {paddingLeft: 20}]}>Phone Number</Text>
                        <View style={Styles.inputWrapper}>
                            <Ionicons name="call" size={20} style={Styles.icon} />
                            <TextInput
                                placeholder="phone number"
                                placeholderTextColor={Colors.subText}
                                value={editPhone}
                                onChangeText={setEditPhone}
                                keyboardType="phone-pad"
                                style={[Styles.input, !editPhone && {borderColor: 'red', borderWidth: 2}]}
                            />
                        </View>
                    </View>
                </View>
                <View style={[Styles.block, {alignItems: 'center', paddingTop: 0}]}>
                    { errorMessage ? (
                        <View style={Styles.errorContainer}>
                            <Text style={[Styles.text, {color: 'red'}]}>{errorMessage}</Text>
                        </View>
                    ) : null}
                    <TouchableOpacity
                        onPress={async () => {
                            if (loading) return;
                            setLoading(true);
                            const errMsg = await handleUpdateAttributes(
                                navigate,
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
                            setLoading(false);
                        }}
                        style={[Styles.actionButton, loading && { opacity: 0.5 }, {backgroundColor: Colors.primary}]}
                        disabled={loading}
                    >
                        <Text style={Styles.actionText}>Update</Text>
                    </TouchableOpacity>
                </View>
            </Background>
        </KeyboardAvoidingView>
    );
};

export default AccountEdit;