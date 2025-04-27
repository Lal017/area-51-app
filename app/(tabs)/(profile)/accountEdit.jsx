import { View, Text, TextInput, KeyboardAvoidingView, ScrollView, TouchableOpacity } from "react-native";
import { ProfileStyles } from "../../../constants/styles";
import { handleUpdateAttributes } from "../../../components/authComponents";
import { useState } from "react";
import { useApp } from "../../../components/context";
import Colors from "../../../constants/colors";
import { Ionicons } from "@expo/vector-icons";

const AccountEdit = () =>
{
    const { name, email, phoneNumber, setName, setPhoneNumber } = useApp();

    const [ editName, setEditName ] = useState(name);
    const [ editEmail, setEditEmail ] = useState(email);
    const [ editPhone, setEditPhone ] = useState(phoneNumber?.slice(2,12));
    
    return(
        <KeyboardAvoidingView
            behavior="padding"
            style={ProfileStyles.page}
        >
            <View style={ProfileStyles.formContainer}>
                <View style={ProfileStyles.inputContainer}>
                    <View style={ProfileStyles.inputWrapper}>
                        <Ionicons name="person" size={20} style={ProfileStyles.icon} />
                        <TextInput
                            placeholder="name"
                            value={editName}
                            onChangeText={setEditName}
                            style={ProfileStyles.input}
                        />
                    </View>
                    <View style={ProfileStyles.inputWrapper}>
                        <Ionicons name="mail" size={20} style={ProfileStyles.icon} />
                        <TextInput
                            placeholder="email"
                            value={editEmail}
                            onChangeText={setEditEmail}
                            autoCapitalize='none'
                            style={ProfileStyles.input}
                        />
                    </View>
                    <View style={ProfileStyles.inputWrapper}>
                        <Ionicons name="call" size={20} style={ProfileStyles.icon} />
                        <TextInput
                            placeholder="phone number"
                            value={editPhone}
                            onChangeText={setEditPhone}
                            keyboardType="phone-pad"
                            style={ProfileStyles.input}
                        />
                    </View>
                </View>
                <TouchableOpacity
                    onPress={() => handleUpdateAttributes(
                        editEmail,
                        editName,
                        editPhone.replace(/\D/g, ''),
                        setName,
                        setPhoneNumber
                    )}
                    style={ProfileStyles.actionButton}
                >
                    <Text style={{color: 'white', textAlign: 'center'}}>Change</Text>
                </TouchableOpacity>
            </View>
        </KeyboardAvoidingView>
    );
};

export default AccountEdit;