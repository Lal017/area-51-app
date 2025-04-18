import { View, Text, TextInput, KeyboardAvoidingView, ScrollView, TouchableOpacity } from "react-native";
import { ProfileStyles } from "../../../constants/styles";
import { handleUpdateAttributes } from "../../../components/authComponents";
import { useState } from "react";
import { useApp } from "../../../components/context";
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
            style={ProfileStyles.page}
        >
            <ScrollView>
                <View style={ProfileStyles.textContainer}>
                    <Text style={ProfileStyles.title}>Edit account</Text>
                    <View style={ProfileStyles.inputContainer}>
                        <TextInput
                            placeholder="name"
                            value={editName}
                            onChangeText={setEditName}
                            style={ProfileStyles.input}
                        />
                        <TextInput
                            placeholder="email"
                            value={editEmail}
                            onChangeText={setEditEmail}
                            autoCapitalize='none'
                            style={ProfileStyles.input}
                        />
                        <TextInput
                            placeholder="phone number"
                            value={editPhone}
                            onChangeText={setEditPhone}
                            keyboardType="phone-pad"
                            style={ProfileStyles.input}
                        /> 
                    </View>
                    <TouchableOpacity
                        onPress={() => handleUpdateAttributes(
                            editEmail,
                            editName,
                            editPhone.replace(/\D/g, ''),
                            setName,
                            setPhoneNumber
                        )}
                    >
                        <Text style={{color: Colors.text}}>Change</Text>
                    </TouchableOpacity>
                </View>
            </ScrollView>
        </KeyboardAvoidingView>
    );
};

export default AccountEdit;