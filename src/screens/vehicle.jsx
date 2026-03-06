import Colors from '../../constants/colors';
import { Styles } from '../../constants/styles';
import { Background } from '../../components/components';
import { handleCreateVehicle, handleDeleteVehicle, handleUpdateVehicle } from '../../components/vehicleComponents';
import { useApp } from '../../components/context';
import { useLocalSearchParams } from 'expo-router';
import { AntDesign, FontAwesome, Ionicons, MaterialCommunityIcons, MaterialIcons } from '@expo/vector-icons';
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
    const [ errorCheck, setErrorCheck ] = useState(false);
    const [ errorMessage, setErrorMessage ] = useState(undefined);

    return (
        <KeyboardAvoidingView behavior='height' style={{flex: 1}}>
            <Background>
                <View style={Styles.block}>
                    <View style={Styles.infoContainer}>
                        <Text style={Styles.headerTitle}>Vehicle Information</Text>
                        <Text style={Styles.tabHeader}>{vehicle ? 'Edit' : 'Add'} a vehicle</Text>
                        { vehicle && (
                            <TouchableOpacity
                                style={[Styles.rightIcon, {padding: 5, backgroundColor: Colors.redButton, borderRadius: 5}]}
                                onPress={() => Alert.alert(
                                    'Delete Vehicle',
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
                                <MaterialIcons name='delete-forever' size={30} color='white'/>
                            </TouchableOpacity>
                        )}
                    </View>
                    <View style={[Styles.inputContainer, {rowGap: 5}]}>
                        <View>
                            <View style={Styles.inputWrapper}>
                                <Ionicons name='calendar' size={20} style={Styles.icon} />
                                <TextInput
                                    placeholder='Year'
                                    placeholderTextColor={Colors.subText}
                                    value={year}
                                    onChangeText={setYear}
                                    keyboardType='number-pad'
                                    style={[Styles.input, errorCheck && !year && {borderColor: 'red', borderBottomWidth: 2}]}
                                />
                            </View>
                            { errorCheck && !year && (<Text style={[Styles.text, {color: 'red', paddingLeft: 15, fontSize: RFValue(13)}]}>Missing Year</Text>)}
                        </View>
                        <View>
                            <View style={Styles.inputWrapper}>
                                <MaterialCommunityIcons name='car-convertible' size={20} style={Styles.icon} />
                                <TextInput
                                    placeholder='Make'
                                    placeholderTextColor={Colors.subText}
                                    value={make}
                                    onChangeText={setMake}
                                    style={[Styles.input, errorCheck && !make && {borderColor: 'red', borderBottomWidth: 2}]}
                                />
                            </View>
                            { errorCheck && !make && (<Text style={[Styles.text, {color: 'red', paddingLeft: 15, fontSize: RFValue(13)}]}>Missing Make</Text>)}
                        </View>
                        <View>
                            <View style={Styles.inputWrapper}>
                                <AntDesign name='tags' size={20} style={Styles.icon} />
                                <TextInput
                                    placeholder='Model'
                                    placeholderTextColor={Colors.subText}
                                    value={model}
                                    onChangeText={setModel}
                                    style={[Styles.input, errorCheck && !model && {borderColor: 'red', borderBottomWidth: 2}]}
                                />
                            </View>
                            { errorCheck && !model && (<Text style={[Styles.text, {color: 'red', paddingLeft: 15, fontSize: RFValue(13)}]}>Missing Model</Text>)}
                        </View>
                        <View>
                            <View style={Styles.inputWrapper}>
                                <Ionicons name='color-palette' size={20} style={Styles.icon} />
                                <TextInput
                                    placeholder='Color'
                                    placeholderTextColor={Colors.subText}
                                    value={color}
                                    onChangeText={setColor}
                                    style={[Styles.input, errorCheck && !color && {borderColor: 'red', borderBottomWidth: 2}]}
                                />
                            </View>
                            { errorCheck && !color && (<Text style={[Styles.text, {color: 'red', paddingLeft: 15, fontSize: RFValue(13)}]}>Missing Color</Text>)}
                        </View>
                    </View>
                    <View style={Styles.infoContainer}>
                        <View style={[Styles.infoContainer, {flexDirection: 'row', columnGap: 5}]}>
                            <Ionicons name='information-circle' size={18} color='white'/>
                            <Text style={[Styles.text, {fontSize: RFValue(10)}]}>Optional: Adding your license plate or VIN number helps us identify your vehicle</Text>
                        </View>
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
                </View>
                { errorMessage ? (
                    <View style={Styles.errorContainer}>
                        <FontAwesome name='exclamation-circle' size={20} style={[Styles.icon, {color: 'red'}]}/>
                        <Text style={Styles.errorText}>{errorMessage}</Text>
                    </View>
                ) : null}
                <View style={[Styles.block, {alignItems: 'center', rowGap: 10}]}>
                    <TouchableOpacity
                        style={[Styles.actionButton, vehicle ? {backgroundColor: Colors.secondary} : {backgroundColor: Colors.primary}, loading && { opacity: 0.5 }]}
                        disabled={loading}
                        onPress={async () => {
                            if (loading) return;
                            setLoading(true);
                            let getError;

                            setErrorCheck(true);
                            if (!year || !make || !model || !color) { setLoading(false); return; }
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
                </View>
            </Background>
        </KeyboardAvoidingView>
    );
};

export default Vehicle;