import { TextInput, View, Text, TouchableOpacity, Alert } from 'react-native';
import { useEffect, useState } from 'react';
import { ProfileStyles, Styles } from '../../../constants/styles';
import { AntDesign, FontAwesome, Ionicons, MaterialCommunityIcons } from '@expo/vector-icons';
import { handleDeleteVehicle, handleUpdateVehicle } from '../../../components/vehicleComponents';
import { useApp } from '../../../components/context';
import { useLocalSearchParams } from 'expo-router';

const editVehicle = () =>
{   
    const { vehicleParam } = useLocalSearchParams();
    const vehicle = JSON.parse(vehicleParam);
    const { client, userId, setVehicles } = useApp();

    const [ year, setYear ] = useState();
    const [ make, setMake ] = useState();
    const [ model, setModel ] = useState();
    const [ color, setColor ] = useState();
    const [ plate, setPlate ] = useState();
    const [ vin, setVin ] = useState();

    useEffect(() => {
        const handleGetVehicle = async () =>
        {
            setYear(vehicle.year?.toString());
            setMake(vehicle.make);
            setModel(vehicle.model);
            setColor(vehicle.color);
            setPlate(vehicle?.plate);
            setVin(vehicle?.vin);
        };

        handleGetVehicle();
    }, []);

    return (
        <View style={[Styles.page, {justifyContent: 'flex-start'}]}>
            <View style={ProfileStyles.formContainer}>
                <View style={Styles.inputContainer}>
                    <View style={Styles.inputWrapper}>
                        <Ionicons name='calendar' size={20} style={Styles.icon} />
                        <TextInput
                            placeholder='Year'
                            value={year}
                            onChangeText={setYear}
                            keyboardType='numeric'
                            style={Styles.input}
                        />
                    </View>
                    <View style={Styles.inputWrapper}>
                        <MaterialCommunityIcons name='car-convertible' size={20} style={Styles.icon} />
                        <TextInput
                            placeholder='Make'
                            value={make}
                            onChangeText={setMake}
                            style={Styles.input}
                        />
                    </View>
                    <View style={Styles.inputWrapper}>
                        <AntDesign name='tags' size={20} style={Styles.icon} />
                        <TextInput
                            placeholder='Model'
                            value={model}
                            onChangeText={setModel}
                            style={Styles.input}
                        />
                    </View>
                    <View style={Styles.inputWrapper}>
                        <Ionicons name='color-palette' size={20} style={Styles.icon} />
                        <TextInput
                            placeholder='Color'
                            value={color}
                            onChangeText={setColor}
                            style={Styles.input}
                        />
                    </View>
                    <Text style={Styles.subTitle}>Optional</Text>
                    <View style={Styles.inputWrapper}>
                        <FontAwesome name='id-card' size={20} style={Styles.icon} />
                        <TextInput
                            placeholder='License Plate #'
                            value={plate}
                            onChangeText={setPlate}
                            style={Styles.input}
                        />
                    </View>
                    <View style={Styles.inputWrapper}>
                        <FontAwesome name='barcode' size={20} style={Styles.icon} />
                        <TextInput
                            placeholder='VIN #'
                            value={vin}
                            onChangeText={setVin}
                            style={Styles.input}
                        />
                    </View>
                </View>
                <TouchableOpacity
                    style={Styles.actionButton}
                    onPress={() => handleUpdateVehicle(client, {year, make, model, color, plate, vin}, vehicle.id, userId, setVehicles)}
                >
                    <Text style={Styles.actionText}>Update</Text>
                </TouchableOpacity>
                <TouchableOpacity
                    style={[Styles.actionButton, {backgroundColor: 'red'}]}
                    onPress={() => Alert.alert(
                        'Confirm',
                        'Are you sure you want to delete this vehicle?',
                        [
                            { text: 'No' },
                            {
                                text: 'Yes',
                                onPress: () => handleDeleteVehicle(client, vehicle.id, setVehicles)
                            }
                        ]
                    )}
                >
                    <Text style={Styles.actionText}>Delete</Text>
                </TouchableOpacity>
            </View>
        </View>
    );
};

export default editVehicle;