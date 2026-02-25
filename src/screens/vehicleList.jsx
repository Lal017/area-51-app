import Colors from '../../constants/colors';
import { BackgroundAlt, Tab } from '../../components/components';
import { handleDeleteVehicle } from '../../components/vehicleComponents';
import { useApp } from '../../components/context';
import { Styles } from '../../constants/styles';
import { Ionicons, AntDesign, MaterialCommunityIcons, Entypo, Feather, FontAwesome } from '@expo/vector-icons';
import { router } from 'expo-router';
import { View, FlatList, TouchableOpacity, Alert } from 'react-native';
import Animated, { useAnimatedStyle, useSharedValue, withSpring } from "react-native-reanimated";
import { useNavigation } from '@react-navigation/native';

const VehicleList = () =>
{
    const { client, vehicles, setVehicles } = useApp();
    const navigate = useNavigation();

    const VehicleItem = ({item}) =>
    {
        const expandedHeight = useSharedValue(0);
        const toggleExpand = () => expandedHeight.value = expandedHeight.value === 0 ? 500 : 0;

        const dropStyle = useAnimatedStyle(() => ({
            maxHeight: withSpring(expandedHeight.value),
            overflow: 'hidden'
        }));

        return (
            <>
                <Tab
                    header={`${item.year}`}
                    text={`${item.make} ${item.model}`}
                    action={toggleExpand}
                    leftIcon={<Ionicons name='car-sport' size={30} style={Styles.icon} />}
                    rightIcon={
                        <View style={[Styles.rightIcon, {flexDirection: 'row', columnGap: 10}]}>
                            <TouchableOpacity
                                style={{backgroundColor: Colors.button, padding: 10, borderRadius: 10}}
                                onPress={() => {
                                    if (item.readyForPickup) {
                                        router.push('vehiclePickup');
                                    } else {
                                        router.push({
                                            pathname: 'vehicleEdit',
                                            params: { vehicleParam: JSON.stringify(item) }
                                        });
                                    }
                                }}
                            >
                                <Entypo name='edit' size={25} color={Colors.backDropAccent}/>
                            </TouchableOpacity>
                            <TouchableOpacity
                                style={{backgroundColor: Colors.redButton, padding: 10, borderRadius: 10}}
                                onPress={() => {
                                    Alert.alert(
                                        'Delete Vehicle',
                                        'Are you sure you want to delete this vehicle?',
                                        [
                                            { text: 'No' },
                                            {
                                                text: 'Yes',
                                                onPress: async () => {
                                                    await handleDeleteVehicle(client, item.id, setVehicles);
                                                    navigate.reset({
                                                        index: 1,
                                                        routes: [
                                                            { name: 'index' },
                                                            { name: 'vehicleList' }
                                                        ]
                                                    });
                                            }}
                                        ]
                                    );
                                }}
                            >
                                <Feather name='x' size={25} color={Colors.backDropAccent}/>
                            </TouchableOpacity>
                        </View>
                    }
                />
                <Animated.View style={dropStyle}>
                    <>
                        <Tab
                            header='Vehicle Color'
                            text={`${item.color}`}
                            rightIcon={<FontAwesome name='paint-brush' size={25} style={Styles.rightIcon}/> }
                            style={{height: 'none', padding: 5}}
                        />
                        { item.plate && (
                            <Tab
                                header='License Plate #'
                                text={`${item.plate}`}
                                rightIcon={<FontAwesome name='id-card' size={25} style={Styles.rightIcon}/>}
                                style={{height: 'none', padding: 5}}
                            />
                        )}
                        { item.vin && (
                            <Tab
                                header='VIN'
                                text={`${item.vin}`}
                                rightIcon={<FontAwesome name='barcode' size={25} style={Styles.rightIcon}/> }
                                style={{height: 'none', padding: 5}}
                            />
                        )}
                    </>
                </Animated.View>
            </>
        );
    }

    return(
        <BackgroundAlt>
            {vehicles?.length > 0 ? (
                <FlatList
                    data={vehicles}
                    keyExtractor={item => item.id}
                    renderItem={({item}) => <VehicleItem item={item}/>}
                    style={{flexGrow: 0}}
                />
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
        </BackgroundAlt>
    );
};

export default VehicleList;