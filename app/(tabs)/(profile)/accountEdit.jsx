import { View, Text, TextInput, KeyboardAvoidingView, ScrollView, TouchableOpacity } from "react-native";
import { useLocalSearchParams } from "expo-router";
import { ProfileStyles } from "../../../constants/styles";
import { handleUpdateAttributes } from "../../../components/authComponents";
import { useState } from "react";

const AccountEdit = () =>
{
    const { name, email, phoneNumber } = useLocalSearchParams();

    const [ editName, setName ] = useState(name);
    const [ editEmail, setEmail ] = useState(email);
    const [ phone, setPhone ] = useState(phoneNumber?.slice(2,12));
    
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
                            onChangeText={setName}
                            style={ProfileStyles.input}
                        />
                        <TextInput
                            placeholder="email"
                            value={editEmail}
                            onChangeText={setEmail}
                            autoCapitalize='none'
                            style={ProfileStyles.input}
                        />
                        <TextInput
                            placeholder="phone number"
                            value={phone}
                            onChangeText={setPhone}
                            keyboardType="phone-pad"
                            style={ProfileStyles.input}
                        /> 
                    </View>
                    <TouchableOpacity
                        onPress={() => handleUpdateAttributes(
                            editEmail,
                            editName,
                            phone.replace(/\D/g, '')
                        )}
                    >
                        <Text>Change</Text>
                    </TouchableOpacity>
                </View>
            </ScrollView>
        </KeyboardAvoidingView>
    );
};

export default AccountEdit;