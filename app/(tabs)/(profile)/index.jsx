import { View, Text, TouchableOpacity } from "react-native";
import { ProfileStyles } from "../../../constants/styles";
import { SettingsTab, websiteRedirect } from "../../../components/components";
import { handleSignOut } from "../../../components/authComponents";
import { router, useNavigation } from "expo-router";
import { useEffect, useState } from "react";
import { fetchUserAttributes } from "aws-amplify/auth";

// Profile page
const Profile = () =>
{
    const navigation = useNavigation();
    const [ email, setEmail ] = useState();
    const [ name, setName ] = useState();
    const [ phoneNumber, setPhoneNumber ] = useState();
    const [ phoneNumberDisplay, setPhoneNumberDisplay ] = useState();

    useEffect(() => {
        const unsubscribe = navigation.addListener('focus', () => {
            const fetchUserData = async() => {
                try {
                    const user = await fetchUserAttributes();
                    setEmail(user?.email);
                    setName(user?.name);
                    setPhoneNumber(user?.phone_number);
                    const phoneNumber = user?.phone_number
                    const countryCode = phoneNumber.slice(0, 2);
                    const areaCode = phoneNumber.slice(2,5);
                    const firstPart = phoneNumber.slice(5, 8);
                    const secondPart = phoneNumber.slice(8, 12);
                    setPhoneNumberDisplay(`${countryCode} (${areaCode}) ${firstPart} - ${secondPart}`)
                } catch (error) {
                    console.log(error);
                }
            }

            fetchUserData();
        });

        return unsubscribe;
    }, [navigation]);

    return(
        <View style={ProfileStyles.page}>
            <View style={ProfileStyles.accountCard}>
                <View style={ProfileStyles.accountText}>
                    <Text>{name}</Text>
                    <Text>{email}</Text>
                    <Text>{phoneNumberDisplay}</Text>
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
                        <Text style={{color: 'white', textAlign: 'center'}}>Edit</Text>
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
                <Text style={{color: 'white', textAlign: 'center'}}>Sign Out</Text>
            </TouchableOpacity>
        </View>
    );
};

export default Profile;