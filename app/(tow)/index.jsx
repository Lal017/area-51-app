import Colors from "../../constants/colors";
import LottieView from "lottie-react-native";
import { Background } from "../../components/components";
import { Styles, AdminStyles } from "../../constants/styles";
import { router } from 'expo-router';
import { Text, TouchableOpacity, Alert, Linking, View } from 'react-native';
import { requestBackgroundPermissionsAsync, requestForegroundPermissionsAsync } from 'expo-location';
import { useApp } from "../../components/context";
import { LinearGradient } from "expo-linear-gradient";

const Index = () =>
{
    const { firstName, lastName, email } = useApp();

    return(
        <Background style={{rowGap: 5}} hasTab={false}>
            <View style={Styles.block}>
                <View style={Styles.infoContainer}>
                    <Text style={Styles.headerTitle}>{firstName} {lastName}</Text>
                    <Text style={Styles.tabHeader}>{email}</Text>
                </View>
            </View>
            <TouchableOpacity
                style={Styles.consoleBubble}
                onPress={async () => {
                    const { status } = await requestForegroundPermissionsAsync();
                    if (status !== 'granted') {
                        Alert.alert(
                            'NOTICE',
                            'You must give location permissions to accept a tow request',
                            [
                                {
                                    text: 'Settings',
                                    onPress: () => Linking.openSettings()
                                }
                            ]
                        );
                        return;
                    } else {
                        const { status } = await requestBackgroundPermissionsAsync();
                        if (status !== 'granted') {
                            Alert.alert(
                                'NOTICE',
                                'You must give background location permissions to accept a tow request',
                                [
                                    {
                                        text: 'Settings',
                                        onPress: () => Linking.openSettings()
                                    }
                                ]
                            );
                            return;
                        }
                    }
                    router.push('(requests)');
                }}
            >
                <LinearGradient
                    colors={[Colors.secondary, Colors.secondaryShade]}
                    start={{ x: 0, y: 0}}
                    end={{ x: 0, y: 1}}
                    style={{ position: 'absolute', top: 0, bottom: 0, left: 0, right: 0}}
                />
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
                <LinearGradient
                    colors={[Colors.button, Colors.buttonShade]}
                    start={{ x: 0, y: 0}}
                    end={{ x: 0, y: 1}}
                    style={{ position: 'absolute', top: 0, bottom: 0, left: 0, right: 0}}
                />
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