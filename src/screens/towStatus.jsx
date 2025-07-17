import { View, Text, TouchableOpacity, Alert } from 'react-native';
import LottieView from 'lottie-react-native';
import { Styles, ServiceStyles } from '../../constants/styles';
import { useApp } from "../../components/context";
import { Background, getRemainingETA, formatTime } from "../../components/components";
import { handleSendAdminNotif } from '../../components/notifComponents';
import { handleUpdateTowRequestStatus } from '../../components/scheduleComponents';
import { useEffect, useState } from "react";
import { useNavigation } from '@react-navigation/native';

const TowStatus = () =>
{
    const { userId, towRequest, client, setTowRequest } = useApp();
    const navigate = useNavigation();
    
    const [ timeLeft, setTimeLeft ] = useState();
    const [ refreshing, setRefreshing ] = useState();

    const onRefresh = async () =>
    {
        setRefreshing(true);

        const getTimeLeft = getRemainingETA(towRequest.updatedAt, parseMinutes(towRequest.waitTime));
        setTimeLeft(getTimeLeft);

        setRefreshing(false);
    }

    useEffect(() => {
        const getTimeLeft = getRemainingETA(towRequest.updatedAt, towRequest.waitTime);
        setTimeLeft(getTimeLeft);
    }, [towRequest]);

    return (
        <Background refreshing={refreshing} onRefresh={onRefresh}>
            { towRequest && towRequest.status === "REQUESTED" ? (
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
                    <Text style={Styles.text}>Your request is being processed. We'll notify you with a estimated wait time shortly.</Text>
                </View>
                <View style={Styles.block}>
                    <TouchableOpacity
                        style={[Styles.actionButton, {backgroundColor: 'red', alignSelf: 'center'}]}
                        onPress={() => Alert.alert(
                            'Cancel',
                            'Are you sure you want to cancel your tow request?',
                            [
                                { text: 'No' },
                                {
                                    text: 'Yes',
                                    onPress: async () => {
                                        handleSendAdminNotif('Tow Request Cancelled', 'Customer has cancelled the tow request');
                                        await handleUpdateTowRequestStatus(client, towRequest.id, userId, 'CANCELLED', setTowRequest);
                                        Alert.alert(
                                            'Cancelled',
                                            'Your tow request has been cancelled',
                                            [{ text: 'OK' }]
                                        );
                                        setTowRequest(undefined);
                                        navigate.reset({
                                            index: 0,
                                            routes: [{ name: '(tabs)' }]
                                        })
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