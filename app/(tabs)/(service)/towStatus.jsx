import { View, Text, TouchableOpacity, Alert } from "react-native";
import { router } from "expo-router";
import { Styles, ServiceStyles } from "../../../constants/styles";
import { useApp } from "../../../components/context";
import { FontAwesome } from "@expo/vector-icons";
import LottieView from "lottie-react-native";
import { handleUpdateTowRequestStatus } from "../../../components/scheduleComponents";
import { handleSendAdminNotif } from "../../../components/notifComponents";
import { Background } from "../../../components/components";

const TowStatus = () =>
{
    const { towRequest, client, setTowRequest } = useApp();

    return (
        <Background style={{paddingTop: 20}}>
            { towRequest && towRequest.status === "PENDING"? (
            <>
                <View style={Styles.infoContainer}>
                    <View style={ServiceStyles.titleWrapper}>
                        <Text style={[Styles.title, {textAlign: 'left'}]}>Tow Request</Text>
                        <FontAwesome name="check" size={30} color='white'/>
                    </View>
                    <Text style={Styles.subTitle}>Price:</Text>
                    <Text style={Styles.text}>{towRequest.price}</Text>
                    <Text style={Styles.subTitle}>Wait Time:</Text>
                    <Text style={Styles.text}>{towRequest.waitTime}</Text>
                </View>
                <View style={[Styles.block, {alignItems: 'center'}]}>
                    <TouchableOpacity
                        style={Styles.actionButton}
                        onPress={() => Alert.alert(
                            'Confirm',
                            'Are you sure you want to accept this tow request?',
                            [
                                { text: 'No' },
                                {
                                    text: 'Yes',
                                    onPress: async () => {
                                        handleSendAdminNotif('Tow Request Confirmed', 'Customer has been confirmed for towing!');
                                        handleUpdateTowRequestStatus(client, towRequest.id, 'IN_PROGRESS', setTowRequest);
                                        Alert.alert(
                                            'Confirmed',
                                            'Your tow request has been confirmed',
                                            [{ text: 'OK' }]
                                        );
                                    }
                                }
                            ]
                        )}
                    >
                        <Text style={Styles.actionText}>Accept</Text>
                    </TouchableOpacity>
                    <TouchableOpacity
                        style={[Styles.actionButton, {backgroundColor: 'red'}]}
                        onPress={() => Alert.alert(
                            'Cancel',
                            'Are you sure you want to cancel this tow request?',
                            [
                                { text: 'No' },
                                {
                                    text: 'Yes',
                                    onPress: async () => {
                                        handleSendAdminNotif('Tow Request Cancelled', 'Customer has cancelled the tow request');
                                        handleUpdateTowRequestStatus(client, towRequest.id, 'CANCELLED', setTowRequest);
                                        Alert.alert(
                                            'Cancelled',
                                            'Your tow request has been cancelled',
                                            [{ text: 'OK' }]
                                        );
                                        setTowRequest(undefined);
                                        router.replace('/(tabs)');
                                    }
                                }
                            ]
                        )}
                    >
                        <Text style={Styles.actionText}>Cancel</Text>
                    </TouchableOpacity>
                </View>
            </>
            ) : towRequest && towRequest.status === "REQUESTED" ? (
            <>
                <View style={Styles.infoContainer}>
                    <View style={ServiceStyles.titleWrapper}>
                    <Text style={Styles.subTitle}>Tow Request</Text>
                    <LottieView
                        source={require('../../../assets/animations/gear.json')}
                        loop
                        autoPlay
                        style={{width: 50, height: 50}}
                    />
                    </View>
                    <Text style={Styles.text}>
                    Your request is being processed.
                    We'll notify you with a price and estimated wait time shortly.
                    </Text>
                </View>
                <View style={Styles.block}>
                    <TouchableOpacity
                        style={[Styles.actionButton, {backgroundColor: 'red', alignSelf: 'center'}]}
                        onPress={() => Alert.alert(
                            'Cancel',
                            'Are you sure you want to cancel your tow request?',
                            [
                                { text: 'NO' },
                                {
                                    text: 'Yes',
                                    onPress: async () => {
                                        handleSendAdminNotif('Tow Request Cancelled', 'Customer has cancelled the tow request');
                                        await handleUpdateTowRequestStatus(client, towRequest.id, 'CANCELLED', setTowRequest);
                                        Alert.alert(
                                            'Cancelled',
                                            'Your tow request has been cancelled',
                                            [{ text: 'OK' }]
                                        );
                                        setTowRequest(undefined);
                                        router.replace('/(tabs)');
                                    }
                                }
                            ]
                        )}
                    >
                        <Text style={Styles.actionText}>Cancel</Text>
                    </TouchableOpacity>
                </View>
            </>
            ) : towRequest?.status === "IN_PROGRESS" ? (
            <View style={Styles.infoContainer}>
                <View style={ServiceStyles.titleWrapper}>
                    <Text style={Styles.subTitle}>Tow Request</Text>
                    <LottieView
                        source={require('../../../assets/animations/truck.json')}
                        loop
                        autoPlay
                        style={{width: 75, height: 75}}
                    />
                </View>
                <Text style={Styles.text}>
                Your driver is on the way!
                Estimated Wait time is {towRequest.waitTime}.
                </Text>
            </View>
            ) : null}
        </Background>
    );
};

export default TowStatus;