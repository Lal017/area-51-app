import { Text, TouchableOpacity, View } from 'react-native';
import { Background } from '../../components/components';
import { AdminStyles, Styles } from "../../constants/styles";
import { router } from 'expo-router';
import LottieView from 'lottie-react-native';
import Colors from '../../constants/colors';

const AdminConsole = () =>
{
    return (
        <Background>
            <View style={{width: '100%', height: '100%'}}>
                <TouchableOpacity
                    style={[Styles.consoleBubble, {backgroundColor: Colors.tertiary}]}
                    onPress={() => router.push('/(admin)/userList')}
                >
                    <Text style={[Styles.title, {fontFamily: 'Roboto-Light', textAlign: 'center'}]}>User List</Text>
                    <LottieView
                        source={require('../../assets/animations/astronaut.json')}
                        loop
                        autoPlay
                        style={AdminStyles.lottieAnim}
                        speed={0.5}
                    />
                </TouchableOpacity>
                <TouchableOpacity
                    style={[Styles.consoleBubble, {backgroundColor: Colors.backgroundAccent}]}
                    onPress={() => router.push('/(admin)/vehicleList')}
                >
                    <Text style={[Styles.title, {fontFamily: 'Roboto-Light', textAlign: 'center'}]}>Vehicle List</Text>
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
                    style={[Styles.consoleBubble, {backgroundColor: Colors.secondary}]}
                    onPress={() => router.push('/(admin)/appointmentList')}
                >
                    <Text style={[Styles.title, {fontFamily: 'Roboto-Light', textAlign: 'center'}]}>Appointments</Text>
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
                    style={[Styles.consoleBubble, {backgroundColor: Colors.primary}]}
                    onPress={() => router.push('/(admin)/towRequests')}
                >
                    <Text style={[Styles.title, {fontFamily: 'Roboto-Light', textAlign: 'center'}]}>Tow Requests</Text>
                    <LottieView
                        source={require('../../assets/animations/planet.json')}
                        loop
                        autoPlay
                        style={AdminStyles.lottieAnim}
                        speed={0.5}
                    />
                </TouchableOpacity>
                <TouchableOpacity
                    style={[Styles.consoleBubble, {backgroundColor: 'tan'}]}
                    onPress={() => router.push('/(admin)/homeSettings')}
                >
                    <Text style={[Styles.title, {fontFamily: 'Roboto-Light', textAlign: 'center'}]}>Home Page</Text>
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
                    onPress={() => router.push('/(admin)/settings')}
                >
                    <Text style={[Styles.title, {fontFamily: 'Roboto-Light', textAlign: 'center'}]}>Settings</Text>
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