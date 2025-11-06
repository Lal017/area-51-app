import Colors from "../../constants/colors";
import { Styles } from "../../constants/styles";
import { Background } from "../../components/components";
import { handleUpdateAttributes } from "../../components/authComponents";
import { useApp } from "../../components/context";
import { useState } from "react";
import { View, Text, TextInput, KeyboardAvoidingView, TouchableOpacity, Alert } from "react-native";
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
    
    return(
        <KeyboardAvoidingView
            behavior="padding"
            style={{flex: 1}}
        >
            <Background>
                { isMissingAttr ? (
                    <View style={[Styles.block, {paddingTop: 25}]}>
                        <View style={Styles.infoContainer}>
                            <Text style={[Styles.subTitle, {color: 'red'}]}>NOTICE</Text>
                            <Text style={Styles.text}>Please add missing attributes</Text>
                        </View>
                    </View>
                ) : null}
                <View style={Styles.block}>
                    <Text style={[Styles.subTitle, {paddingLeft: 20}]}>Name</Text>
                    <View style={Styles.inputWrapper}>
                        <Ionicons name="person" size={20} style={Styles.icon} />
                        <TextInput
                            placeholder="first name"
                            placeholderTextColor={Colors.text}
                            value={editFirstName}
                            onChangeText={setEditFirstName}
                            style={[Styles.input, !editFirstName && {borderColor: 'red', borderWidth: 3}]}
                        />
                    </View>
                    <View style={Styles.inputWrapper}>
                        <Ionicons name="person" size={20} style={Styles.icon} />
                        <TextInput
                            placeholder="last name"
                            placeholderTextColor={Colors.text}
                            value={editLastName}
                            onChangeText={setEditLastName}
                            style={[Styles.input, !editLastName && {borderColor: 'red', borderWidth: 3}]}
                        />
                    </View>
                    { !isMissingAttr ? (
                        <>
                            <Text style={[Styles.subTitle, {paddingLeft: 20}]}>Email</Text>
                            <View style={Styles.inputWrapper}>
                                <Ionicons name="mail" size={20} style={Styles.icon} />
                                <TextInput
                                    placeholder="email"
                                    placeholderTextColor={Colors.text}
                                    value={editEmail}
                                    onChangeText={setEditEmail}
                                    autoCapitalize='none'
                                    style={[Styles.input, !editEmail && {borderColor: 'red', borderWidth: 3}]}
                                />
                            </View>
                        </>
                    ) : null }
                    <Text style={[Styles.subTitle, {paddingLeft: 20}]}>Phone Number</Text>
                    <View style={Styles.inputWrapper}>
                        <Ionicons name="call" size={20} style={Styles.icon} />
                        <TextInput
                            placeholder="phone number"
                            placeholderTextColor={Colors.text}
                            value={editPhone}
                            onChangeText={setEditPhone}
                            keyboardType="phone-pad"
                            style={[Styles.input, !editPhone && {borderColor: 'red', borderWidth: 3}]}
                        />
                    </View>
                </View>
                <TouchableOpacity
                    onPress={async () => {
                        if (loading) return;
                        setLoading(true);
                        try {
                            await handleUpdateAttributes(
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
                            setIsMissingAttr(false);
                        } catch (error) {
                            Alert.alert(
                                'Error',
                                'Invalid entry, please try again',
                                [{ text: 'OK'}]
                            )
                        }
                        setLoading(false);
                    }}
                    style={[Styles.actionButton, loading && { opacity: 0.5 }]}
                    disabled={loading}
                >
                    <Text style={Styles.actionText}>Update</Text>
                </TouchableOpacity>
            </Background>
        </KeyboardAvoidingView>
    );
};

export default AccountEdit;