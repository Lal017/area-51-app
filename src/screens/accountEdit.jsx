import { View, Text, TextInput, KeyboardAvoidingView, TouchableOpacity, BackHandler, Alert } from "react-native";
import { Styles } from "../../constants/styles";
import { handleUpdateAttributes } from "../../components/authComponents";
import { useState, useEffect } from "react";
import { useApp } from "../../components/context";
import { Ionicons } from "@expo/vector-icons";
import Colors from "../../constants/colors";
import { Background } from "../../components/components";

const AccountEdit = () =>
{
    const { firstName, lastName, email, phoneNumber, setFirstName, setLastName, setPhoneNumber, isStuck, setIsStuck } = useApp();

    const [ editFirstName, setEditFirstName ] = useState(firstName);
    const [ editLastName, setEditLastName ] = useState(lastName);
    const [ editEmail, setEditEmail ] = useState(email);
    const [ editPhone, setEditPhone ] = useState(phoneNumber?.slice(2,12));
    const [ loading, setLoading ] = useState(false);

    useEffect(() => {
        const onBackPress = () =>
        {
            if (isStuck) {
                Alert.alert(
                    'Notice',
                    'Please add missing attributes before continuing',
                    [
                        {
                            text: 'OK',
                        }
                    ]
                );
                return true;
            }

            return false;
        };

        const backHandler = BackHandler.addEventListener(
            'hardwareBackPress',
            onBackPress
        );

        return () => backHandler.remove();
    }, []);
    
    return(
        <KeyboardAvoidingView
            behavior="padding"
            style={{flex: 1}}
        >
            <Background>
                <View style={Styles.block}>
                    <Text style={[Styles.subTitle, {paddingLeft: 20}]}>Name</Text>
                    <View style={Styles.inputWrapper}>
                        <Ionicons name="person" size={20} style={Styles.icon} />
                        <TextInput
                            placeholder="first name"
                            placeholderTextColor={Colors.text}
                            value={editFirstName}
                            onChangeText={setEditFirstName}
                            style={Styles.input}
                        />
                    </View>
                    <View style={Styles.inputWrapper}>
                        <Ionicons name="person" size={20} style={Styles.icon} />
                        <TextInput
                            placeholder="last name"
                            placeholderTextColor={Colors.text}
                            value={editLastName}
                            onChangeText={setEditLastName}
                            style={Styles.input}
                        />
                    </View>
                    <Text style={[Styles.subTitle, {paddingLeft: 20}]}>Email</Text>
                    <View style={Styles.inputWrapper}>
                        <Ionicons name="mail" size={20} style={Styles.icon} />
                        <TextInput
                            placeholder="email"
                            placeholderTextColor={Colors.text}
                            value={editEmail}
                            onChangeText={setEditEmail}
                            autoCapitalize='none'
                            style={Styles.input}
                        />
                    </View>
                    <Text style={[Styles.subTitle, {paddingLeft: 20}]}>Phone Number</Text>
                    <View style={Styles.inputWrapper}>
                        <Ionicons name="call" size={20} style={Styles.icon} />
                        <TextInput
                            placeholder="phone number"
                            placeholderTextColor={Colors.text}
                            value={editPhone}
                            onChangeText={setEditPhone}
                            keyboardType="phone-pad"
                            style={Styles.input}
                        />
                    </View>
                </View>
                <TouchableOpacity
                    onPress={async () => {
                        if (loading) return;
                        setLoading(true);
                        try {
                            await handleUpdateAttributes(
                                editEmail,
                                editFirstName,
                                editLastName,
                                editPhone.replace(/\D/g, ''),
                                setFirstName,
                                setLastName,
                                setPhoneNumber
                            );
                            setIsStuck(false);
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
                    <Text style={Styles.actionText}>Change</Text>
                </TouchableOpacity>
            </Background>
        </KeyboardAvoidingView>
    );
};

export default AccountEdit;