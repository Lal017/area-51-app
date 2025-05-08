import { View, Text, TouchableOpacity } from 'react-native';
import { Styles, AdminStyles } from "../../constants/styles";
import { router } from 'expo-router';
import LottieView from 'lottie-react-native';
import Colors from '../../constants/colors';

const AdminConsole = () =>
{
    return (
        <View style={[Styles.page, {rowGap: 5}]}>
            <TouchableOpacity style={AdminStyles.consoleBubble}>
                <Text style={[Styles.title, {position: 'absolute', top: 50, color: 'white'}]}>Users List</Text>
                <LottieView
                    source={require('../../assets/animations/astronaut.json')}
                    loop
                    autoPlay
                    style={{width: 100, height: 100, position: 'absolute', left: 20, top: 75}}
                    speed={0.5}
                />
            </TouchableOpacity>
            <TouchableOpacity style={[AdminStyles.consoleBubble, {backgroundColor: Colors.secondary}]}>
                <Text style={[Styles.title, {position: 'absolute', top: 50, color: 'white'}]}>Appointments</Text>
                <LottieView
                    source={require('../../assets/animations/calendar.json')}
                    loop
                    autoPlay
                    style={{width: 200, height: 200, position: 'absolute', right: 180, top: 20, marginRight: 50}}
                    speed={0.5}
                />
            </TouchableOpacity>
            <TouchableOpacity style={[AdminStyles.consoleBubble, {backgroundColor: Colors.primary}]}>
                <Text style={[Styles.title, {position: 'absolute', top: 50, color: 'white'}]}>Tow Requests</Text>
                <LottieView
                    source={require('../../assets/animations/planet.json')}
                    loop
                    autoPlay
                    style={{width: 100, height: 100, position: 'absolute', left: 10, top: 75, marginRight: 50}}
                    speed={0.5}
                />
            </TouchableOpacity>
            <TouchableOpacity
                style={[AdminStyles.consoleBubble, {backgroundColor: 'grey'}]}
                onPress={() => router.push('/(admin)/settings')}
            >
                <Text style={[Styles.title, {position: 'absolute', top: 50, color: 'white'}]}>Settings</Text>
                <LottieView
                    source={require('../../assets/animations/gear.json')}
                    loop
                    autoPlay
                    style={{width: 100, height: 100, position: 'absolute', left: 10, top: 75, marginRight: 50}}
                    speed={0.5}
                />
            </TouchableOpacity>
        </View>
    );
};

export default AdminConsole;