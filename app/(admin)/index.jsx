import { Text, TouchableOpacity } from 'react-native';
import { Background } from '../../components/components';
import { Styles } from "../../constants/styles";
import { router } from 'expo-router';
import LottieView from 'lottie-react-native';
import Colors from '../../constants/colors';

const AdminConsole = () =>
{
    return (
        <Background>
            <TouchableOpacity
                style={[Styles.consoleBubble, {backgroundColor: Colors.tertiary}]}
                onPress={() => router.push('/(admin)/userList')}
            >
                <Text style={[Styles.title, {fontFamily: 'Roboto-Light', textAlign: 'center', position: 'absolute', top: 50}]}>Users List</Text>
                <LottieView
                    source={require('../../assets/animations/astronaut.json')}
                    loop
                    autoPlay
                    style={{width: 100, height: 100, position: 'absolute', left: 20, top: 75}}
                    speed={0.5}
                />
            </TouchableOpacity>
            <TouchableOpacity
                style={[Styles.consoleBubble, {backgroundColor: Colors.secondary}]}
                onPress={() => router.push('/(admin)/appointmentList')}    
            >
                <Text style={[Styles.title, {fontFamily: 'Roboto-Light', textAlign: 'center', position: 'absolute', top: 50}]}>Appointments</Text>
                <LottieView
                    source={require('../../assets/animations/calendar.json')}
                    loop
                    autoPlay
                    style={{width: 200, height: 200, position: 'absolute', right: 200, top: 20, marginRight: 50}}
                    speed={0.5}
                />
            </TouchableOpacity>
            <TouchableOpacity
                style={[Styles.consoleBubble, {backgroundColor: Colors.primary}]}
                onPress={() => router.push('/(admin)/towRequests')}
            >
                <Text style={[Styles.title, {fontFamily: 'Roboto-Light', textAlign: 'center', position: 'absolute', top: 50}]}>Tow Requests</Text>
                <LottieView
                    source={require('../../assets/animations/planet.json')}
                    loop
                    autoPlay
                    style={{width: 100, height: 100, position: 'absolute', left: 20, top: 70, marginRight: 50}}
                    speed={0.5}
                />
            </TouchableOpacity>
            <TouchableOpacity
                style={[Styles.consoleBubble, {backgroundColor: 'grey'}]}
                onPress={() => router.push('/(admin)/settings')}
            >
                <Text style={[Styles.title, {fontFamily: 'Roboto-Light', textAlign: 'center', position: 'absolute', top: 50}]}>Settings</Text>
                <LottieView
                    source={require('../../assets/animations/gear.json')}
                    loop
                    autoPlay
                    style={{width: 100, height: 100, position: 'absolute', left: 20, top: 50, marginRight: 50}}
                    speed={0.5}
                />
            </TouchableOpacity>
        </Background>
    );
};

export default AdminConsole;