import { Background } from "../../components/components";
import { router } from 'expo-router';
import { View, Text, TouchableOpacity } from 'react-native';
import { Styles, AdminStyles } from "../../constants/styles";
import Colors from "../../constants/colors";
import LottieView from "lottie-react-native";

const Index = () =>
{
    return(
        <Background style={{justifyContent: 'center', rowGap: 2}}>
            <TouchableOpacity
                style={[Styles.consoleBubble, {backgroundColor: Colors.secondary}]}
            >
                <Text style={Styles.title}>View Requests</Text>
                <LottieView
                    source={require('../../assets/animations/astronaut.json')}
                    loop
                    autoPlay
                    style={AdminStyles.lottieAnim}
                    speed={0.5}
                />
            </TouchableOpacity>
            <TouchableOpacity
                style={[Styles.consoleBubble, {backgroundColor: 'gray'}]}
                onPress={() => router.push('/(tow)/(settings)')}
            >
                <Text style={Styles.title}>Settings</Text>
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

export default Index;