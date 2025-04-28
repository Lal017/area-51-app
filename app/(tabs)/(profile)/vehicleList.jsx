import { View, Text, TouchableOpacity } from 'react-native';
import { router } from 'expo-router';
import { useApp } from '../../../components/context';
import { ProfileStyles } from '../../../constants/styles';
import { Ionicons } from '@expo/vector-icons';

const VehicleList = () =>
{
    const { vehicles } = useApp();

    return(
        <View style={ProfileStyles.page}>
            <View style={ProfileStyles.vehicleContainer}>
                {vehicles?.length > 0 ? (
                    vehicles.map((vehicle, index) => (
                        <TouchableOpacity
                            key={index}
                            onPress={() => router.push({
                                pathname: 'vehicleEdit',
                                params: { vehicleId: vehicle.id }
                            })}
                            style={ProfileStyles.vehicleBox}>
                            <Text style={{textAlign: 'center'}}>
                                {vehicle.year} {vehicle.make} {vehicle.model}
                            </Text>
                            <Ionicons name='car-sport' size={30} />
                        </TouchableOpacity>
                    ))
                ) : (
                    <View style={ProfileStyles.vehicleBox}>
                        <Text>No Vehicles</Text>
                    </View>
                )}

                <TouchableOpacity
                    onPress={() => router.push('vehicleAdd')}
                    style={ProfileStyles.addVehicle}>
                    <Ionicons name="add-circle" size={50} />
                </TouchableOpacity>
            </View>
        </View>
    );
};

export default VehicleList;