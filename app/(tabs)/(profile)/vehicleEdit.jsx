import { TextInput, View, Text, TouchableOpacity, Alert } from 'react-native';
import { useEffect, useState } from 'react';
import { ProfileStyles } from '../../../constants/styles';
import { AntDesign, FontAwesome, Ionicons, MaterialCommunityIcons } from '@expo/vector-icons';
import { handleDeleteVehicle, handleUpdateVehicle } from '../../../components/vehicleComponents';
import { getVehicle } from '../../../src/graphql/queries';
import { useApp } from '../../../components/context';
import { useLocalSearchParams } from 'expo-router';

const editVehicle = () =>
{   
    const { vehicleId } = useLocalSearchParams();
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
            const currVehicle = await client.graphql({
                query: getVehicle,
                variables: { id: vehicleId }
            });

            setYear(currVehicle.data.getVehicle.year?.toString());
            setMake(currVehicle.data.getVehicle.make);
            setModel(currVehicle.data.getVehicle.model);
            setColor(currVehicle.data.getVehicle.color);
            setPlate(currVehicle.data.getVehicle?.plate);
            setVin(currVehicle.data.getVehicle?.vin);
        };

        handleGetVehicle();
    }, []);

    return (
        <View style={ProfileStyles.page}>
            <View style={ProfileStyles.formContainer}>
                <View style={ProfileStyles.inputContainer}>
                    <View style={ProfileStyles.inputWrapper}>
                        <Ionicons name='calendar' size={20} style={ProfileStyles.icon} />
                        <TextInput
                            placeholder='Year'
                            value={year}
                            onChangeText={setYear}
                            keyboardType='numeric'
                            style={ProfileStyles.input}
                        />
                    </View>
                    <View style={ProfileStyles.inputWrapper}>
                        <MaterialCommunityIcons name='car-convertible' size={20} style={ProfileStyles.icon} />
                        <TextInput
                            placeholder='Make'
                            value={make}
                            onChangeText={setMake}
                            style={ProfileStyles.input}
                        />
                    </View>
                    <View style={ProfileStyles.inputWrapper}>
                        <AntDesign name='tags' size={20} style={ProfileStyles.icon} />
                        <TextInput
                            placeholder='Model'
                            value={model}
                            onChangeText={setModel}
                            style={ProfileStyles.input}
                        />
                    </View>
                    <View style={ProfileStyles.inputWrapper}>
                        <Ionicons name='color-palette' size={20} style={ProfileStyles.icon} />
                        <TextInput
                            placeholder='Color'
                            value={color}
                            onChangeText={setColor}
                            style={ProfileStyles.input}
                        />
                    </View>
                    <Text style={ProfileStyles.subTitle}>Optional</Text>
                    <View style={ProfileStyles.inputWrapper}>
                        <FontAwesome name='id-card' size={20} style={ProfileStyles.icon} />
                        <TextInput
                            placeholder='License Plate #'
                            value={plate}
                            onChangeText={setPlate}
                            style={ProfileStyles.input}
                        />
                    </View>
                    <View style={ProfileStyles.inputWrapper}>
                        <FontAwesome name='barcode' size={20} style={ProfileStyles.icon} />
                        <TextInput
                            placeholder='VIN #'
                            value={vin}
                            onChangeText={setVin}
                            style={ProfileStyles.input}
                        />
                    </View>
                </View>
                <TouchableOpacity
                    style={ProfileStyles.actionButton}
                    onPress={() => handleUpdateVehicle(client, {year, make, model, color, plate, vin}, vehicleId, setVehicles)}
                >
                    <Text style={{textAlign: 'center', color: 'white'}}>Update</Text>
                </TouchableOpacity>
                <TouchableOpacity
                    style={[ProfileStyles.actionButton, {backgroundColor: 'red'}]}
                    onPress={() => Alert.alert(
                        'Confirm',
                        'Are you sure you want to delete this vehicle?',
                        [
                            {
                                text: 'Yes',
                                onPress: () => handleDeleteVehicle(client, vehicleId, setVehicles)
                            },
                            {
                                text: 'No',
                            }
                        ]
                    )}
                >
                    <Text style={{textAlign: 'center', color: 'white'}}>Delete</Text>
                </TouchableOpacity>
            </View>
        </View>
    );
};

export default editVehicle;