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
import { RFValue } from 'react-native-responsive-fontsize';

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
    const [ missingYear, setMissingYear ] = useState(false);
    const [ missingMake, setMissingMake ] = useState(false);
    const [ missingModel, setMissingModel ] = useState(false);
    const [ missingColor, setMissingColor ] = useState(false);
    const [ errorMessage, setErrorMessage ] = useState(undefined);

    const isMissingInput = () =>
    {
        let isMissing = false;
        if (!color) {
            setMissingColor(true);
            setErrorMessage('Missing color');
            isMissing = true;
        } else setMissingColor(false);
        if (!model) {
            setMissingModel(true);
            setErrorMessage('Missing model');
            isMissing = true;
        } else setMissingModel(false);
        if (!make) {
            setMissingMake(true);
            setErrorMessage('Missing make');
            isMissing = true;
        } else setMissingMake(false);
        if (!year) {
            setMissingYear(true);
            setErrorMessage('Missing year');
            isMissing = true;
        } else setMissingYear(false);
        return isMissing;
    };

    return (
        <KeyboardAvoidingView behavior='height' style={{flex: 1}}>
            <Background>
                <View style={Styles.block}>
                    <View style={Styles.infoContainer}>
                        <Text style={Styles.text}>Vehicle Information</Text>
                    </View>
                    <View style={[Styles.inputContainer, {rowGap: 5}]}>
                        <View style={Styles.inputWrapper}>
                            <Ionicons name='calendar' size={20} style={Styles.icon} />
                            <TextInput
                                placeholder='Year'
                                placeholderTextColor={Colors.subText}
                                value={year}
                                onChangeText={setYear}
                                keyboardType='number-pad'
                                style={[Styles.input, missingYear && {borderColor: 'red'}]}
                            />
                        </View>
                        <View style={Styles.inputWrapper}>
                            <MaterialCommunityIcons name='car-convertible' size={20} style={Styles.icon} />
                            <TextInput
                                placeholder='Make'
                                placeholderTextColor={Colors.subText}
                                value={make}
                                onChangeText={setMake}
                                style={[Styles.input, missingMake && {borderColor: 'red'}]}
                            />
                        </View>
                        <View style={Styles.inputWrapper}>
                            <AntDesign name='tags' size={20} style={Styles.icon} />
                            <TextInput
                                placeholder='Model'
                                placeholderTextColor={Colors.subText}
                                value={model}
                                onChangeText={setModel}
                                style={[Styles.input, missingModel && {borderColor: 'red'}]}
                            />
                        </View>
                        <View style={Styles.inputWrapper}>
                            <Ionicons name='color-palette' size={20} style={Styles.icon} />
                            <TextInput
                                placeholder='Color'
                                placeholderTextColor={Colors.subText}
                                value={color}
                                onChangeText={setColor}
                                style={[Styles.input, missingColor && {borderColor: 'red'}]}
                            />
                        </View>
                    </View>
                    <View style={Styles.infoContainer}>
                        <Text style={Styles.text}>Optional</Text>
                    </View>
                    <View style={[Styles.inputContainer, {rowGap: 5}]}>
                        <View style={Styles.inputWrapper}>
                            <FontAwesome name='id-card' size={20} style={Styles.icon} />
                            <TextInput
                                placeholder='License Plate #'
                                placeholderTextColor={Colors.subText}
                                value={plate}
                                onChangeText={setPlate}
                                style={Styles.input}
                            />
                        </View>
                        <View style={Styles.inputWrapper}>
                            <FontAwesome name='barcode' size={20} style={Styles.icon} />
                            <TextInput
                                placeholder='VIN #'
                                placeholderTextColor={Colors.subText}
                                value={vin}
                                onChangeText={setVin}
                                style={Styles.input}
                            />
                        </View>
                    </View>
                    <View style={[Styles.infoContainer, {flexDirection: 'row', columnGap: 5}]}>
                        <Ionicons name='information-circle' size={18} color='white'/>
                        <Text style={[Styles.text, {fontSize: RFValue(10)}]}>Adding your license plate or VIN number helps us identify your vehicle</Text>
                    </View>
                </View>
                { errorMessage ? (
                    <View style={Styles.errorContainer}>
                        <Text style={[Styles.text, {color: 'red'}]}>{errorMessage}</Text>
                    </View>
                ) : null}
                <View style={[Styles.block, {alignItems: 'center', rowGap: 10}]}>
                    <TouchableOpacity
                        style={[Styles.actionButton, {backgroundColor: Colors.primary}, loading && { opacity: 0.5 }]}
                        disabled={loading}
                        onPress={async () => {
                            if (loading) return;
                            setLoading(true);
                            let getError;

                            if (isMissingInput()) { setLoading(false); return; }
                            if (vehicle) {
                                getError = await handleUpdateVehicle(client, {year, make, model, color, plate, vin}, vehicle.id, userId, setVehicles);
                            } else {
                                getError = await handleCreateVehicle(client, {year, make, model, color, plate, vin}, userId, setVehicles);
                            }
                            if (!getError) {
                                navigate.reset({
                                    index: 1,
                                    routes: [
                                        { name: 'index' },
                                        { name: 'vehicleList' }
                                    ]
                                });
                            } else {
                                setErrorMessage(getError);
                            }
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
                                                index: 1,
                                                routes: [
                                                    { name: 'index' },
                                                    { name: 'vehicleList' }
                                                ]
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