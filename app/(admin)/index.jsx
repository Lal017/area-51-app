import LottieView from 'lottie-react-native';
import Colors from '../../constants/colors';
import { Background } from '../../components/components';
import { AdminStyles, ServiceStyles, Styles } from "../../constants/styles";
import { requestForegroundPermissionsAsync } from 'expo-location';
import { Text, TouchableOpacity, View, Alert, Linking } from 'react-native';
import { router } from 'expo-router';

const AdminConsole = () =>
{
    return (
        <Background style={{rowGap: 2}}>
            <TouchableOpacity
                style={[Styles.consoleBubble, {backgroundColor: Colors.tertiary}]}
                onPress={() => router.push('/(admin)/(users)')}
            >
                <Text style={ServiceStyles.title}>User List</Text>
                <LottieView
                    source={require('../../assets/animations/astronaut.json')}
                    loop
                    autoPlay
                    style={AdminStyles.lottieAnim}
                    speed={0.5}
                />
            </TouchableOpacity>
            <TouchableOpacity
                style={[Styles.consoleBubble, {backgroundColor: Colors.secondary}]}
                onPress={() => router.push('/(admin)/vehicleList')}
            >
                <Text style={ServiceStyles.title}>Vehicle List</Text>
                <View style={[AdminStyles.lottieAnim, {justifyContent: 'center', alignItems: 'center'}]}>
                    <LottieView
                        source={require('../../assets/animations/car.json')}
                        loop
                        autoPlay
                        style={{width: 150, height: 150}}
                        speed={0.4}
                    />
                </View>
            </TouchableOpacity>
            <TouchableOpacity
                style={[Styles.consoleBubble, {backgroundColor: Colors.primary}]}
                onPress={() => router.push('/(admin)/(appointments)')}
            >
                <Text style={ServiceStyles.title}>Appointments</Text>
                <View style={[AdminStyles.lottieAnim, {justifyContent: 'center', alignItems: 'center'}]}>
                    <LottieView
                        source={require('../../assets/animations/calendar.json')}
                        loop
                        autoPlay
                        style={{width: 175, height: 175}}
                        speed={0.5}
                    />
                </View>
            </TouchableOpacity>
            <TouchableOpacity
                style={[Styles.consoleBubble, {backgroundColor: Colors.secondary}]}
                onPress={async () => {
                    const { status } = await requestForegroundPermissionsAsync();
                    if (status !== 'granted') {
                        Alert.alert(
                        'NOTICE',
                        'You must give location permissions to make a tow request',
                        [
                            {
                            text: 'Settings',
                            onPress: () => Linking.openSettings()
                            }
                        ]
                        );
                        return;
                    }
                    router.push('/(admin)/towRequestList');
                }}
            >
                <Text style={ServiceStyles.title}>Tow Requests</Text>
                <LottieView
                    source={require('../../assets/animations/planet.json')}
                    loop
                    autoPlay
                    style={AdminStyles.lottieAnim}
                    speed={0.5}
                />
            </TouchableOpacity>
            <TouchableOpacity
                style={[Styles.consoleBubble, {backgroundColor: Colors.tertiary}]}
                onPress={() => router.push('/(admin)/homeSettings')}
            >
                <Text style={ServiceStyles.title}>Home Page</Text>
                <LottieView
                    source={require('../../assets/animations/house.json')}
                    loop
                    autoPlay
                    style={AdminStyles.lottieAnim}
                    speed={0.2}
                />
            </TouchableOpacity>
            <TouchableOpacity
                style={[Styles.consoleBubble, {backgroundColor: 'grey'}]}
                onPress={() => router.push('/(admin)/(settings)')}
            >
                <Text style={ServiceStyles.title}>Settings</Text>
                <LottieView
                    source={require('../../assets/animations/gear.json')}
                    loop
                    autoPlay
                    style={AdminStyles.lottieAnim}
                    speed={0.5}
                />
            </TouchableOpacity>
        </Background>
    );
};

export default AdminConsole;