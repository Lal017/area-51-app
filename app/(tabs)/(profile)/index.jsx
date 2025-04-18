import { View, Text, TouchableOpacity } from "react-native";
import { ProfileStyles } from "../../../constants/styles";
import { SettingsTab, websiteRedirect } from "../../../components/components";
import { handleSignOut } from "../../../components/authComponents";
import { router } from "expo-router";
import { useEffect, useState } from "react";
import { useApp } from "../../../components/context";
import Colors from '../../../constants/colors';

// Profile page
const Profile = () =>
{
    const { email, name, phoneNumber } = useApp();

    // Set a readable phone number for the user
    const [ phoneNumberDisplay, setPhoneNumberDisplay ] = useState();

    useEffect(() => {
        const countryCode = phoneNumber.slice(0, 2);
        const areaCode = phoneNumber.slice(2,5);
        const firstPart = phoneNumber.slice(5, 8);
        const secondPart = phoneNumber.slice(8, 12);
        setPhoneNumberDisplay(`${countryCode} (${areaCode}) ${firstPart} - ${secondPart}`)
    }, [phoneNumber]);

    return(
        <View style={ProfileStyles.page}>
            <View style={ProfileStyles.accountCard}>
                <View style={ProfileStyles.accountText}>
                    <Text style={{color: Colors.text}}>{name}</Text>
                    <Text style={{color: Colors.text}}>{email}</Text>
                    <Text style={{color: Colors.text}}>{phoneNumberDisplay}</Text>
                </View>
                <View style={ProfileStyles.editAccount}>
                    <TouchableOpacity
                        onPress={() => router.push({
                            pathname: 'accountEdit',
                            params: {
                                name: name,
                                email: email,
                                phoneNumber: phoneNumber
                            }
                        })}
                        style={ProfileStyles.editButton}
                    >
                        <Text style={{textAlign: 'center'}}>Edit</Text>
                    </TouchableOpacity>
                </View>
            </View>
            <View style={ProfileStyles.tabContainer}>
                <SettingsTab text="Account Settings" action={() => router.push({
                    pathname: 'settings',
                    params: {
                        email: email
                    }
                })}/>
                <SettingsTab text="Contact us" action={() => router.push('contact')}/>
                <SettingsTab text="Website" action={websiteRedirect}/>
            </View>
            <TouchableOpacity
                onPress={() => handleSignOut()}
                style={ProfileStyles.actionButton}
            >
                <Text style={{color: 'white' , textAlign: 'center'}}>Sign Out</Text>
            </TouchableOpacity>
        </View>
    );
};

export default Profile;