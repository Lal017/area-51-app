import { View, Text, Alert } from 'react-native';
import { router } from 'expo-router';
import { Background, Tab } from '../../components/components';
import { useEffect, useState } from 'react';
import { useApp } from '../../components/context';
import { Styles } from '../../constants/styles';
import { Entypo, Ionicons } from '@expo/vector-icons';
import { handleUpdateVehicleStatus } from '../../components/vehicleComponents';
import Animated, { Easing , useAnimatedStyle, useSharedValue, withRepeat, withSequence, withTiming } from "react-native-reanimated";
import { useNavigation } from '@react-navigation/native';

const VehiclePickup = () =>
{
    const { client, vehicles, setVehicles, setVehiclePickup  } = useApp();
    const [ vehiclesToPickup, setVehiclesToPickup ] = useState();
    const [ loading, setLoading ] = useState(false);
    const navigate = useNavigation();

    const bounce = useSharedValue(0);
    useEffect(() => {
        bounce.value = withRepeat(
            withSequence(
            withTiming(-10, {
                duration: 500,
                easing: Easing.out(Easing.ease)
            }),
            withTiming(0, {
                duration: 500,
                easing: Easing.in(Easing.ease)
            })
            ),
            -1,     // infinite
            true,   // reverse
        );
    }, [vehiclesToPickup]);

        const animatedStyle = useAnimatedStyle(() => ({
        transform: [{ translateY: bounce.value }]
    }));

    useEffect(() => {
        const initVehicles = () =>
        {
            const getVehicles = vehicles?.filter(item => item.readyForPickup === true);
            setVehiclesToPickup(getVehicles);
        }

        initVehicles();
    }, [vehicles]);

    return(
        <Background>
            <View style={Styles.block}>
                <View style={[Styles.infoContainer, {rowGap: 5}]}>
                    <Text style={Styles.title}>Ready for Pickup</Text>
                    <Text style={Styles.subTitle}>Location</Text>
                    <Text style={Styles.text}>3120 W Sirius Ave. #103 Las Vegas, NV 89102</Text>
                    <Text style={Styles.subTitle}>Hours of operation</Text>
                    <Text style={Styles.text}>Mon - Fri | 9am - 5:30pm</Text>
                    <Text style={Styles.text}>The following vehicles are ready to be picked up.</Text>
                </View>
            </View>
            <View style={Styles.block}>
                { vehiclesToPickup?.map((vehicle, index) => (
                    <Tab
                        key={index}
                        text={`${vehicle.year} ${vehicle.make} ${vehicle.model}`}
                        action={() => Alert.alert(
                            'Confirm',
                            'Has your vehicle been picked up?',
                            [
                                { text: 'No'},
                                {
                                    text: 'Yes',
                                    onPress: async () => {
                                        if (loading) return;
                                        setLoading(true);
                                        await handleUpdateVehicleStatus(client, vehicle.id, setVehicles, setVehiclePickup);
                                        navigate.reset({
                                            index: 0,
                                            routes: [{ name: '(tabs)' }]
                                        });
                                        setLoading(false);
                                    }
                                }
                            ]
                        )}
                        leftIcon={<Ionicons name='car-sport' size={30} color='white' style={Styles.icon}/>}
                        rightIcon={
                            <Animated.View style={[Styles.rightIcon, animatedStyle, {paddingRight: 15}]}>
                                <Entypo name='thumbs-up' size={30} color='white' />
                            </Animated.View>
                        }
                    />
                ))}
            </View>
        </Background>
    );
};

export default VehiclePickup;