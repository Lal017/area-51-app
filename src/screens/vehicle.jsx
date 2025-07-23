import Colors from '../../constants/colors';
import { Styles } from '../../constants/styles';
import { Background } from '../../components/components';
import { handleCreateVehicle, handleDeleteVehicle, handleUpdateVehicle } from '../../components/vehicleComponents';
import { useApp } from '../../components/context';
import { useLocalSearchParams } from 'expo-router';
import { AntDesign, FontAwesome, Ionicons, MaterialCommunityIcons } from '@expo/vector-icons';
import { TextInput, View, Text, TouchableOpacity, Alert, KeyboardAvoidingView } from 'react-native';
import { useState } from 'react';
import { useNavigation } from '@react-navigation/native';

const Vehicle = () =>
{   
    const { client, userId, setVehicles } = useApp();
    const navigate = useNavigation();

    const { vehicleParam } = useLocalSearchParams();
    const vehicle = vehicleParam ? JSON.parse(vehicleParam) : null;

    const [ year, setYear ] = useState(vehicle?.year?.toString() ?? undefined);
    const [ make, setMake ] = useState(vehicle?.make ?? undefined);
    const [ model, setModel ] = useState(vehicle?.model ?? undefined);
    const [ color, setColor ] = useState(vehicle?.color ?? undefined);
    const [ plate, setPlate ] = useState(vehicle?.plate ?? undefined);
    const [ vin, setVin ] = useState(vehicle?.vin ?? undefined);
    const [ loading, setLoading ] = useState(false);

    return (
        <KeyboardAvoidingView behavior='height' style={{flex: 1}}>
            <Background>
                <View style={Styles.block}>
                    <View style={Styles.infoContainer}>
                        <Text style={Styles.subTitle}>Vehicle Information</Text>
                        </View>
                    <View style={Styles.inputContainer}>
                        <View style={Styles.inputWrapper}>
                            <Ionicons name='calendar' size={20} style={Styles.icon} />
                            <TextInput
                                placeholder='Year'
                                placeholderTextColor={Colors.text}
                                value={year}
                                onChangeText={setYear}
                                keyboardType='number-pad'
                                style={Styles.input}
                            />
                        </View>
                        <View style={Styles.inputWrapper}>
                            <MaterialCommunityIcons name='car-convertible' size={20} style={Styles.icon} />
                            <TextInput
                                placeholder='Make'
                                placeholderTextColor={Colors.text}
                                value={make}
                                onChangeText={setMake}
                                style={Styles.input}
                            />
                        </View>
                        <View style={Styles.inputWrapper}>
                            <AntDesign name='tags' size={20} style={Styles.icon} />
                            <TextInput
                                placeholder='Model'
                                placeholderTextColor={Colors.text}
                                value={model}
                                onChangeText={setModel}
                                style={Styles.input}
                            />
                        </View>
                        <View style={Styles.inputWrapper}>
                            <Ionicons name='color-palette' size={20} style={Styles.icon} />
                            <TextInput
                                placeholder='Color'
                                placeholderTextColor={Colors.text}
                                value={color}
                                onChangeText={setColor}
                                style={Styles.input}
                            />
                        </View>
                        <View style={Styles.infoContainer}>
                            <Text style={Styles.subTitle}>Optional</Text>
                        </View>
                        <View style={Styles.inputWrapper}>
                            <FontAwesome name='id-card' size={20} style={Styles.icon} />
                            <TextInput
                                placeholder='License Plate #'
                                placeholderTextColor={Colors.text}
                                value={plate}
                                onChangeText={setPlate}
                                style={Styles.input}
                            />
                        </View>
                        <View style={Styles.inputWrapper}>
                            <FontAwesome name='barcode' size={20} style={Styles.icon} />
                            <TextInput
                                placeholder='VIN #'
                                placeholderTextColor={Colors.text}
                                value={vin}
                                onChangeText={setVin}
                                style={Styles.input}
                            />
                        </View>
                    </View>
                </View>
                <View style={[Styles.block, {alignItems: 'center'}]}>
                    <TouchableOpacity
                        style={[Styles.actionButton, {backgroundColor: Colors.primary}, loading && { opacity: 0.5 }]}
                        disabled={loading}
                        onPress={async () => {
                            if (loading) return;
                            setLoading(true);
                            if (vehicle) {
                                await handleUpdateVehicle(client, {year, make, model, color, plate, vin}, vehicle.id, userId, setVehicles);
                            } else {
                                await handleCreateVehicle(client, {year, make, model, color, plate, vin}, userId, setVehicles);
                            }
                            navigate.reset({
                                index: 0,
                                routes: [{ name: '(profile)' }]
                            });
                            setLoading(false);
                        }}
                    >
                        <Text style={Styles.actionText}>{vehicle ? 'Update' : 'Create'}</Text>
                    </TouchableOpacity>
                    { vehicle ? (
                        <TouchableOpacity
                            style={[Styles.actionButton, {backgroundColor: 'red'}]}
                            onPress={() => Alert.alert(
                                'Confirm',
                                'Are you sure you want to delete this vehicle?',
                                [
                                    { text: 'No' },
                                    {
                                        text: 'Yes',
                                        onPress: async () => {
                                            await handleDeleteVehicle(client, vehicle.id, setVehicles);
                                            navigate.reset({
                                                index: 0,
                                                routes: [{ name: '(profile)' }]
                                            });
                                    }}
                                ]
                            )}
                        >
                            <Text style={Styles.actionText}>Delete</Text>
                        </TouchableOpacity>
                    ) : null }
                </View>
            </Background>
        </KeyboardAvoidingView>
    );
};

export default Vehicle;