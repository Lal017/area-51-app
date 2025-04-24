import { View, Text, TouchableOpacity } from 'react-native';
import { router } from 'expo-router';
import { useApp } from '../../../components/context';
import { ProfileStyles } from '../../../constants/styles';
import { Ionicons } from '@expo/vector-icons';
import Colors from '../../../constants/colors';
import { handleCreateVehicle } from '../../../components/vehicleComponents';

const VehicleList = () =>
{
    const { client, vehicles, setVehicles } = useApp();

    return(
        <View style={ProfileStyles.page}>
            <View style={ProfileStyles.vehicleContainer}>
                {vehicles?.length > 0 ? (
                    vehicles.map((vehicle, index) => (
                        <View key={index} style={ProfileStyles.vehicleBox}>
                            <Text style={{color: Colors.text}}>
                                {vehicle.year} {vehicle.make} {vehicle.model}
                            </Text>
                            <Ionicons name='car' size={30} color={Colors.text} />
                        </View>
                    ))
                ) : (
                    <View style={ProfileStyles.vehicleBox}>
                        <Text style={{color: Colors.text}}>No Vehicles</Text>
                    </View>
                )}

                <TouchableOpacity
                    onPress={() => router.push('addVehicle')}
                    style={ProfileStyles.addVehicle}>
                    <Ionicons name="add-circle" size={50} color={Colors.text} />
                </TouchableOpacity>
            </View>
        </View>
    );
};

export default VehicleList;