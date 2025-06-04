import { TextInput, View, Text, TouchableOpacity, Alert, KeyboardAvoidingView } from 'react-native';
import { useEffect, useState } from 'react';
import { Styles } from '../../constants/styles';
import { AntDesign, FontAwesome, Ionicons, MaterialCommunityIcons } from '@expo/vector-icons';
import { handleDeleteVehicle, handleUpdateVehicle } from '../../components/vehicleComponents';
import { useApp } from '../../components/context';
import { useLocalSearchParams } from 'expo-router';
import { Background } from '../../components/components';
import Colors from '../../constants/colors';

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
    const [ loading, setLoading ] = useState(false);

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
        <KeyboardAvoidingView behavior='height' style={{flex: 1}}>
            <Background>
                <View style={[Styles.block, {paddingLeft: 20}]}>
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
                    <Text style={Styles.subTitle}>Optional</Text>
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
                <View style={[Styles.block, {alignItems: 'center'}]}>
                    <TouchableOpacity
                        style={[Styles.actionButton, loading && { opacity: 0.5 }]}
                        disabled={loading}
                        onPress={async () => {
                            if (loading) return;
                            setLoading(true);
                            await handleUpdateVehicle(client, {year, make, model, color, plate, vin}, vehicle.id, userId, setVehicles);
                            setLoading(false);
                        }}
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
            </Background>
        </KeyboardAvoidingView>
    );
};

export default editVehicle;