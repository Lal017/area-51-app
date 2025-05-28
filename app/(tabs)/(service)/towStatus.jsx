import { View, Text, TouchableOpacity, Alert } from "react-native";
import { HomeStyles, Styles, ServiceStyles } from "../../../constants/styles";
import { useApp } from "../../../components/context";
import { FontAwesome } from "@expo/vector-icons";
import LottieView from "lottie-react-native";
import { handleUpdateTowRequestStatus } from "../../../components/scheduleComponents";
import { handleSendAdminNotif } from "../../../components/notifComponents";

const TowStatus = () =>
{
    const { towRequest, client, setTowRequest } = useApp();

    return (
        <View>
            { towRequest && towRequest.status === "PENDING"? (
            <View style={HomeStyles.requestWrapper}>
                <View style={HomeStyles.titleWrapper}>
                <Text style={[Styles.title, {textAlign: 'left'}]}>Tow Request</Text>
                <FontAwesome name="check" size={25} color='black'/>
                </View>
                <Text style={Styles.subTitle}>Price:</Text>
                <Text style={Styles.text}>{towRequest.price}</Text>
                <Text style={Styles.subTitle}>Wait Time:</Text>
                <Text style={Styles.text}>{towRequest.waitTime}</Text>
                <TouchableOpacity
                    style={Styles.actionButton}
                    onPress={() => {
                        handleSendAdminNotif('Tow Request Confirmed', 'Customer has been confirmed for towing!');
                        handleUpdateTowRequestStatus(client, towRequest.id, 'IN_PROGRESS', setTowRequest);
                        Alert.alert(
                            'Confirmed',
                            'Your tow request has been confirmed',
                            [{ text: 'OK' }]
                        );
                    }}
                >
                    <Text style={Styles.actionText}>Accept</Text>
                </TouchableOpacity>
                <TouchableOpacity
                    style={[Styles.actionButton, {backgroundColor: 'red'}]}
                    onPress={() => {
                        handleSendAdminNotif('Tow Request Cancelled', 'Customer has cancelled the tow request');
                        handleUpdateTowRequestStatus(client, towRequest.id, 'CANCELLED', setTowRequest);
                        Alert.alert(
                            'Cancelled',
                            'Your tow request has been cancelled',
                            [{ text: 'OK' }]
                        );
                        router.replace('/(tabs)');
                    }}  
                >
                    <Text style={Styles.actionText}>Cancel</Text>
                </TouchableOpacity>
            </View>
            ) : towRequest && towRequest.status === "REQUESTED" ? (
            <View style={ServiceStyles.requestWrapper}>
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
                <TouchableOpacity
                    style={[Styles.actionButton, {backgroundColor: 'red', alignSelf: 'center'}]}
                    onPress={() => {
                        handleSendAdminNotif('Tow Request Cancelled', 'Customer has cancelled the tow request');
                        handleUpdateTowRequestStatus(client, towRequest.id, 'CANCELLED', setTowRequest);
                        Alert.alert(
                            'Cancelled',
                            'Your tow request has been cancelled',
                            [{ text: 'OK' }]
                        );
                        router.replace('/(tabs)');
                    }}  
                >
                    <Text style={Styles.actionText}>Cancel</Text>
                </TouchableOpacity>
            </View>
            ) : towRequest?.status === "IN_PROGRESS" ? (
            <View style={HomeStyles.requestWrapper}>
                <View style={HomeStyles.titleWrapper}>
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
        </View>
    );
};

export default TowStatus;