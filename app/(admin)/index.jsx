import LottieView from 'lottie-react-native';
import Colors from '../../constants/colors';
import { Background } from '../../components/components';
import { AdminStyles, Styles } from "../../constants/styles";
import { requestForegroundPermissionsAsync } from 'expo-location';
import { Text, TouchableOpacity, View, Alert, Linking } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { router } from 'expo-router';

const AdminConsole = () =>
{
    return (
        <Background style={{rowGap: 2}} hasTab={false}>
            <View style={{flexDirection: 'row', flexWrap: 'wrap', flex: 1, gap: 5, justifyContent: 'center'}}>
                <TouchableOpacity
                    style={Styles.consoleBubbleAlt}
                    onPress={() => router.push('/(admin)/(users)')}
                >
                    <LinearGradient
                        colors={[Colors.tertiary, Colors.tertiaryShade]}
                        start={{ x: 0, y: 1}}
                        end={{ x: 1, y: 0}}
                        style={{ position: 'absolute', top: 0, bottom: 0, left: 0, right: 0}}
                    />
                    <Text style={Styles.headerTitle}>User List</Text>
                    <LottieView
                        source={require('../../assets/animations/astronaut.json')}
                        loop
                        autoPlay
                        style={AdminStyles.lottieAnim}
                        speed={0.5}
                    />
                </TouchableOpacity>
                <TouchableOpacity
                    style={Styles.consoleBubbleAlt}
                    onPress={() => router.push('/(admin)/vehicleList')}
                >
                    <LinearGradient
                        colors={[Colors.secondary, Colors.secondaryShade2]}
                        start={{ x: 0, y: 1}}
                        end={{ x: 1, y: 0}}
                        style={{ position: 'absolute', top: 0, bottom: 0, left: 0, right: 0}}
                    />
                    <Text style={Styles.headerTitle}>Vehicle List</Text>
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
                    style={Styles.consoleBubbleAlt}
                    onPress={() => router.push('/(admin)/(appointments)')}
                >
                    <LinearGradient
                        colors={[Colors.secondary, Colors.secondaryShade2]}
                        start={{ x: 0, y: 1}}
                        end={{ x: 1, y: 0}}
                        style={{ position: 'absolute', top: 0, bottom: 0, left: 0, right: 0}}
                    />
                    <Text style={Styles.headerTitle}>Appointments</Text>
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
                    style={Styles.consoleBubbleAlt}
                    onPress={async () => {
                        const { status } = await requestForegroundPermissionsAsync();
                        if (status !== 'granted') {
                            Alert.alert(
                            'NOTICE',
                            'You must give location permissions to view tow requests',
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
                    <LinearGradient
                        colors={[Colors.tertiary, Colors.tertiaryShade]}
                        start={{ x: 0, y: 1}}
                        end={{ x: 1, y: 0}}
                        style={{ position: 'absolute', top: 0, bottom: 0, left: 0, right: 0}}
                    />
                    <Text style={Styles.headerTitle}>Tow Requests</Text>
                    <LottieView
                        source={require('../../assets/animations/planet.json')}
                        loop
                        autoPlay
                        style={AdminStyles.lottieAnim}
                        speed={0.5}
                    />
                </TouchableOpacity>
                <TouchableOpacity
                    style={Styles.consoleBubbleAlt}
                    onPress={() => router.push('/(admin)/homeSettings')}
                >
                    <LinearGradient
                        colors={[Colors.tertiary, Colors.tertiaryShade]}
                        start={{ x: 0, y: 1}}
                        end={{ x: 1, y: 0}}
                        style={{ position: 'absolute', top: 0, bottom: 0, left: 0, right: 0}}
                    />
                    <Text style={Styles.headerTitle}>Home Page</Text>
                    <LottieView
                        source={require('../../assets/animations/house.json')}
                        loop
                        autoPlay
                        style={AdminStyles.lottieAnim}
                        speed={0.2}
                    />
                </TouchableOpacity>
                <TouchableOpacity
                    style={Styles.consoleBubbleAlt}
                    onPress={() => router.push('/(admin)/(settings)')}
                >
                    <LinearGradient
                        colors={[Colors.button, Colors.buttonShade]}
                        start={{ x: 0, y: 1}}
                        end={{ x: 1, y: 0}}
                        style={{ position: 'absolute', top: 0, bottom: 0, left: 0, right: 0}}
                    />
                    <Text style={Styles.headerTitle}>Settings</Text>
                    <LottieView
                        source={require('../../assets/animations/gear.json')}
                        loop
                        autoPlay
                        style={AdminStyles.lottieAnim}
                        speed={0.5}
                    />
                </TouchableOpacity>
            </View>
        </Background>
    );
};

export default AdminConsole;