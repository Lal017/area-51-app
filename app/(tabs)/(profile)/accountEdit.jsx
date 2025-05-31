import { View, Text, TextInput, KeyboardAvoidingView, TouchableOpacity } from "react-native";
import { Styles } from "../../../constants/styles";
import { handleUpdateAttributes } from "../../../components/authComponents";
import { useState } from "react";
import { useApp } from "../../../components/context";
import { Ionicons } from "@expo/vector-icons";
import Colors from "../../../constants/colors";

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
            <View style={[Styles.block, {paddingTop: '25%', paddingBottom: 30}]}>
                <Text style={[Styles.subTitle, {paddingLeft: 20}]}>Name</Text>
                <View style={Styles.inputWrapper}>
                    <Ionicons name="person" size={20} style={Styles.icon} />
                    <TextInput
                        placeholder="name"
                        placeholderTextColor={Colors.text}
                        value={editName}
                        onChangeText={setEditName}
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
        </KeyboardAvoidingView>
    );
};

export default AccountEdit;