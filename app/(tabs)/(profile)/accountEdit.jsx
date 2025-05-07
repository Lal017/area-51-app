import { View, Text, TextInput, KeyboardAvoidingView, TouchableOpacity } from "react-native";
import { ProfileStyles, Styles } from "../../../constants/styles";
import { handleUpdateAttributes } from "../../../components/authComponents";
import { useState } from "react";
import { useApp } from "../../../components/context";
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
            style={Styles.page}
        >
            <View style={ProfileStyles.formContainer}>
                <View style={Styles.inputContainer}>
                    <View style={Styles.inputWrapper}>
                        <Ionicons name="person" size={20} style={Styles.icon} />
                        <TextInput
                            placeholder="name"
                            value={editName}
                            onChangeText={setEditName}
                            style={Styles.input}
                        />
                    </View>
                    <View style={Styles.inputWrapper}>
                        <Ionicons name="mail" size={20} style={Styles.icon} />
                        <TextInput
                            placeholder="email"
                            value={editEmail}
                            onChangeText={setEditEmail}
                            autoCapitalize='none'
                            style={Styles.input}
                        />
                    </View>
                    <View style={Styles.inputWrapper}>
                        <Ionicons name="call" size={20} style={Styles.icon} />
                        <TextInput
                            placeholder="phone number"
                            value={editPhone}
                            onChangeText={setEditPhone}
                            keyboardType="phone-pad"
                            style={Styles.input}
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
                    style={Styles.actionButton}
                >
                    <Text style={Styles.actionText}>Change</Text>
                </TouchableOpacity>
            </View>
        </KeyboardAvoidingView>
    );
};

export default AccountEdit;