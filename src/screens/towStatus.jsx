import { View, Text, TouchableOpacity } from 'react-native';
import LottieView from 'lottie-react-native';
import { Styles, ServiceStyles } from '../../constants/styles';
import { FontAwesome } from '@expo/vector-icons';
import { useApp } from "../../components/context";
import { Background, getRemainingETA, formatTime } from "../../components/components";
import { useEffect, useState } from "react";

const TowStatus = () =>
{
    const { towRequest, client, setTowRequest } = useApp();
    const [ timeLeft, setTimeLeft ] = useState();

    useEffect(() => {
        const parseMinutes = (waitTime) => {
            console.log(waitTime);
            if (!waitTime) return 1;

            // Extract the first number found in the string
            const match = waitTime.match(/\d+/);
            if (match) {
                return parseInt(match[0], 10);
            }

            return 0; // fallback if no number found
        };

        const getTimeLeft = getRemainingETA(towRequest.updatedAt, parseMinutes(towRequest.waitTime));
        setTimeLeft(getTimeLeft);
    }, []);

    return (
        <Background>
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
                        source={require('../../assets/animations/gear.json')}
                        loop
                        autoPlay
                        style={{width: 50, height: 50}}
                    />
                    </View>
                    <Text style={Styles.text}>Your request is being processed. We'll notify you with a price and estimated wait time shortly.</Text>
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
                        source={require('../../assets/animations/truck.json')}
                        loop
                        autoPlay
                        style={{width: 75, height: 75}}
                    />
                </View>
                { timeLeft > 0 ? (
                    <>
                    <Text style={Styles.text}>Your driver is on route! Estimated Wait time is {timeLeft} minutes.</Text>
                    <Text style={Styles.text}>Requested at: {formatTime(towRequest.updatedAt)}</Text>
                    </>
                ) : (
                    <Text style={Styles.text}>Your driver is running late. we are sorry for the inconvenience</Text>
                )}
            </View>
            ) : null}
        </Background>
    );
};

const TowStatusComponent = ({towRequest, client, setTowRequest}) =>
{


};
export default TowStatus;