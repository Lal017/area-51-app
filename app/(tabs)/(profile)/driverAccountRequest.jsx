import Colors from "../../../constants/colors";
import { handleDeleteAllAppointments } from "../../../components/appointmentComponents";
import { Background } from "../../../components/components";
import { useApp } from "../../../components/context";
import { handleDeleteAllTowRequests } from "../../../components/towComponents";
import { handleDeleteStorage, handleRequestDriverAccount } from "../../../components/userComponents";
import { handleDeleteAllVehicles } from "../../../components/vehicleComponents";
import { handleSendAdminNotif } from "../../../components/notifComponents";
import { Styles } from "../../../constants/styles";
import { useNavigation } from "@react-navigation/native";
import { View, Text, TouchableOpacity, Alert } from "react-native";
import { useState } from "react";

const DriverAccountRequest = () =>
{
    const { client, userId, identityId } = useApp();
    const navigate = useNavigation();

    const [ loading, setLoading ] = useState(false);

    return (
        <Background>
            <View style={Styles.block}>
                <View style={[Styles.infoContainer, {rowGap: 0}]}>
                    <Text style={Styles.subTitle}>Information</Text>
                    <Text style={Styles.text}>Are you a tow truck driver? Use this page to request a driver account. Once the request has been made, we will grant you access or deny you within 24 hours.</Text>
                </View>
                <View style={[Styles.infoContainer, {rowGap: 0}]}>
                    <Text style={[Styles.subTitle, {color: 'red'}]}>ALERT</Text>
                    <Text style={Styles.text}>Requesting a driver account will delete all of your appointments, tow requests, vehicles, and files. Are you sure you want to continue?</Text>
                </View>
            </View>
            <TouchableOpacity
                style={[Styles.actionButton, loading && {opacity: 0.5}, {backgroundColor: Colors.primary}]}
                onPress={() => Alert.alert(
                    'Confirmation',
                    'Are you sure you want to convert your account to a tow driver account?',
                    [
                        { text: 'No' },
                        {
                            text: 'Yes',
                            onPress: async () => {
                                if (loading) return;
                                try {
                                    setLoading(true);
                                    await handleDeleteAllAppointments(client, userId);
                                    await handleDeleteAllTowRequests(client, userId);
                                    await handleDeleteAllVehicles(client, userId);
                                    await handleDeleteStorage(identityId);
                                    await handleRequestDriverAccount(client, userId);
                                    await handleSendAdminNotif('Tow Driver Account Request', 'A user is requesting to become a tow driver');
                                    setLoading(false);
                                    navigate.reset({
                                        index: 0,
                                        routes: [{ name: '(tabs)'}]
                                    });
                                } catch (error) {
                                    Alert.alert('ERROR', 'Could not request a driver account');
                                } 
                            }
                        }
                    ]
                )}
                disabled={loading}
            >
                <Text style={Styles.actionText}>Request</Text>
            </TouchableOpacity>
        </Background>
    );
};

export default DriverAccountRequest;