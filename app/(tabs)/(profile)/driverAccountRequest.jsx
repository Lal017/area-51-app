import Colors from "../../../constants/colors";
import { handleDeleteAllAppointments } from "../../../components/appointmentComponents";
import { Background } from "../../../components/components";
import { useApp } from "../../../components/context";
import { handleDeleteAllTowRequests } from "../../../components/towComponents";
import { handleDeleteStorage, handleRequestDriverAccount } from "../../../components/userComponents";
import { handleDeleteAllVehicles } from "../../../components/vehicleComponents";
import { handleSendAdminNotif } from "../../../components/notifComponents";
import { Styles } from "../../../constants/styles";
import { router } from "expo-router";
import { View, Text, TouchableOpacity, Alert } from "react-native";
import { useState } from "react";
import { Ionicons } from "@expo/vector-icons";
import { RFValue } from "react-native-responsive-fontsize";

const DriverAccountRequest = () =>
{
    const { client, userId, identityId, setDriverId } = useApp();

    const [ loading, setLoading ] = useState(false);

    return (
        <Background>
            <View style={Styles.block}>
                <View style={Styles.infoContainer}>
                    <Text style={Styles.headerTitle}>Request</Text>
                    <Text style={Styles.tabHeader}>Are you a tow truck driver? Use this page to request a driver account.</Text>
                </View>
                    <View style={Styles.infoContainer}>
                        <View style={[Styles.infoContainer, {flexDirection: 'row', columnGap: 5}]}>
                            <Ionicons name='information-circle' size={18} color='white'/>
                            <Text style={[Styles.text, {fontSize: RFValue(10)}]}>Requesting a driver account will <Text style={{color: 'red', fontWeight: 'bold'}}>DELETE</Text> all your vehicles, requests, and documents. Are you sure you want to continue?</Text>
                        </View>
                    </View>
            </View>
            <TouchableOpacity
                style={[Styles.actionButton, loading && {opacity: 0.5}, {backgroundColor: Colors.primary}]}
                onPress={() => Alert.alert(
                    'Confirmation',
                    'Are you sure you want to request to convert your customer account to a driver account?',
                    [
                        { text: 'No' },
                        {
                            text: 'Yes',
                            onPress: async () => {
                                if (loading) return;
                                try {
                                    setLoading(true);
                                    setDriverId('1');
                                    await handleDeleteAllAppointments(client, userId);
                                    await handleDeleteAllTowRequests(client, userId);
                                    await handleDeleteAllVehicles(client, userId);
                                    await handleDeleteStorage(identityId);
                                    await handleRequestDriverAccount(client, userId);
                                    await handleSendAdminNotif('Tow Driver Account Request', 'A user is requesting to become a tow driver');
                                    if (router.canDismiss()) router.dismissAll();
                                    setLoading(false);
                                } catch (error) {
                                    console.log(error);
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