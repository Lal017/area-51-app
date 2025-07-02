import { View, Text } from 'react-native';
import Colors from '../../constants/colors';
import { router } from 'expo-router';
import { useEffect } from 'react';
import { Background, Tab } from '../../components/components';
import { useApp } from '../../components/context';
import { ProfileStyles, Styles } from '../../constants/styles';
import { Ionicons, AntDesign, MaterialCommunityIcons } from '@expo/vector-icons';
import Animated, { Easing , useAnimatedStyle, useSharedValue, withRepeat, withSequence, withTiming } from "react-native-reanimated";

const VehicleList = () =>
{
    const { vehicles } = useApp();

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
    }, [vehicles]);

    const animatedStyle = useAnimatedStyle(() => ({
        transform: [{ translateY: bounce.value }]
    }));

    return(
        <Background>
            {vehicles?.length > 0 ? (
                vehicles.map((vehicle, index) => (
                    <View style={ProfileStyles.tabContainer} key={index}>
                        { vehicle.readyForPickup ? (
                            <Animated.View style={[ProfileStyles.activityContainer, animatedStyle, {backgroundColor: Colors.tertiary}]}>
                                <Text style={[Styles.subTitle, {fontSize: 20, textAlign: 'center'}]}>!</Text>
                            </Animated.View>
                        ) : null }
                        <Tab
                            text={`${vehicle.year} ${vehicle.make} ${vehicle.model}`}
                            action={() => {
                                if (vehicle.readyForPickup) {
                                    router.push('vehiclePickup');
                                } else {
                                    router.push({
                                        pathname: 'vehicleEdit',
                                        params: { vehicleParam: JSON.stringify(vehicle) }
                                    });
                                }
                            }}
                            leftIcon={<Ionicons name='car-sport' size={30} style={Styles.icon} />}
                            rightIcon={<AntDesign name="right" size={25} style={Styles.rightIcon} />}
                        />
                    </View>
                ))
            ) : (
                <Tab
                    text='No Vehicles'
                    leftIcon={<MaterialCommunityIcons name="cancel" size={30} style={Styles.icon} />}    
                />
            )}
            <Tab
                text='Add'
                action={() => router.push('vehicleAdd')}
                leftIcon={<Ionicons name="add-circle" size={30} style={Styles.icon} />}
                rightIcon={<AntDesign name="right" size={25} style={Styles.rightIcon} />}  
            />
        </Background>
    );
};

export default VehicleList;