import Colors from '../../constants/colors';
import { Styles } from '../../constants/styles';
import { ActionButton, Background, ErrorDisplay } from '../../components/components';
import { handleCreateVehicle, handleDeleteVehicle, handleUpdateVehicle } from '../../components/vehicleComponents';
import { useApp } from '../../components/context';
import { useLocalSearchParams, router } from 'expo-router';
import { AntDesign, FontAwesome, Ionicons, MaterialCommunityIcons, MaterialIcons } from '@expo/vector-icons';
import { TextInput, View, Text, TouchableOpacity, Alert, KeyboardAvoidingView } from 'react-native';
import { useState } from 'react';
import { textSize } from '../../constants/utils';

const Vehicle = () =>
{   
    const { client, userId, setVehicles } = useApp();

    const { vehicleParam } = useLocalSearchParams();
    const vehicle = vehicleParam ? JSON.parse(vehicleParam) : null;

    const [ year, setYear ] = useState(vehicle?.year?.toString() ?? undefined);
    const [ make, setMake ] = useState(vehicle?.make ?? undefined);
    const [ model, setModel ] = useState(vehicle?.model ?? undefined);
    const [ color, setColor ] = useState(vehicle?.color ?? undefined);
    const [ plate, setPlate ] = useState(vehicle?.plate ?? undefined);
    const [ vin, setVin ] = useState(vehicle?.vin ?? undefined);
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
                                style={[Styles.rightIcon, {padding: 5, backgroundColor: Colors.error, borderRadius: 5}]}
                                onPress={() => Alert.alert(
                                    'Delete Vehicle',
                                    'Are you sure you want to delete this vehicle?',
                                    [
                                        { text: 'No' },
                                        {
                                            text: 'Yes',
                                            onPress: async () => {
                                                await handleDeleteVehicle(client, vehicle.id, setVehicles);
                                                router.replace('(profile)');
                                                router.push('vehicleList');
                                            }
                                        }
                                    ]
                                )}
                            >
                                <MaterialIcons name='delete-forever' size={30} color='white'/>
                            </TouchableOpacity>
                        )}
                    </View>
                    <View>
                        <View style={Styles.inputWrapper}>
                            <Ionicons name='calendar' size={20} style={Styles.inputIcon} />
                            <TextInput
                                placeholder='Year'
                                placeholderTextColor={Colors.grayText}
                                value={year}
                                onChangeText={setYear}
                                keyboardType='number-pad'
                                style={[Styles.input, errorCheck && !year && {borderColor: 'red', borderBottomWidth: 2}]}
                            />
                        </View>
                        { errorCheck && !year && (<Text style={[Styles.text, {color: 'red', paddingLeft: 15, fontSize: textSize(13)}]}>Missing Year</Text>)}
                    </View>
                    <View>
                        <View style={Styles.inputWrapper}>
                            <MaterialCommunityIcons name='car-convertible' size={20} style={Styles.inputIcon} />
                            <TextInput
                                placeholder='Make'
                                placeholderTextColor={Colors.grayText}
                                value={make}
                                onChangeText={setMake}
                                style={[Styles.input, errorCheck && !make && {borderColor: 'red', borderBottomWidth: 2}]}
                            />
                        </View>
                        { errorCheck && !make && (<Text style={[Styles.text, {color: 'red', paddingLeft: 15, fontSize: textSize(13)}]}>Missing Make</Text>)}
                    </View>
                    <View>
                        <View style={Styles.inputWrapper}>
                            <AntDesign name='tags' size={20} style={Styles.inputIcon} />
                            <TextInput
                                placeholder='Model'
                                placeholderTextColor={Colors.grayText}
                                value={model}
                                onChangeText={setModel}
                                style={[Styles.input, errorCheck && !model && {borderColor: 'red', borderBottomWidth: 2}]}
                            />
                        </View>
                        { errorCheck && !model && (<Text style={[Styles.text, {color: 'red', paddingLeft: 15, fontSize: textSize(13)}]}>Missing Model</Text>)}
                    </View>
                    <View>
                        <View style={Styles.inputWrapper}>
                            <Ionicons name='color-palette' size={20} style={Styles.inputIcon} />
                            <TextInput
                                placeholder='Color'
                                placeholderTextColor={Colors.grayText}
                                value={color}
                                onChangeText={setColor}
                                style={[Styles.input, errorCheck && !color && {borderColor: 'red', borderBottomWidth: 2}]}
                            />
                        </View>
                        { errorCheck && !color && (<Text style={[Styles.text, {color: 'red', paddingLeft: 15, fontSize: textSize(13)}]}>Missing Color</Text>)}
                    </View>
                    <View style={Styles.infoContainer}>
                        <View style={[Styles.infoContainer, {flexDirection: 'row', columnGap: 5}]}>
                            <Ionicons name='information-circle' size={18} color='white'/>
                            <Text style={[Styles.text, {fontSize: textSize(10)}]}>Optional: Adding your license plate or VIN number helps us identify your vehicle</Text>
                        </View>
                    </View>
                    <View style={Styles.inputWrapper}>
                        <FontAwesome name='id-card' size={20} style={Styles.inputIcon} />
                        <TextInput
                            placeholder='License Plate #'
                            placeholderTextColor={Colors.grayText}
                            value={plate}
                            onChangeText={setPlate}
                            style={Styles.input}
                        />
                    </View>
                    <View style={Styles.inputWrapper}>
                        <FontAwesome name='barcode' size={20} style={Styles.inputIcon} />
                        <TextInput
                            placeholder='VIN #'
                            placeholderTextColor={Colors.grayText}
                            value={vin}
                            onChangeText={setVin}
                            style={Styles.input}
                        />
                    </View>
                </View>
                { errorMessage && (
                    <ErrorDisplay message={errorMessage}/>
                )}
                <View style={Styles.block}>
                    <ActionButton
                        text={vehicle ? 'Update' : 'Create'}
                        primaryColor={vehicle ? Colors.secondary : Colors.primary}
                        secondaryColor={vehicle ? Colors.secondaryShade : Colors.primaryShade}
                        onPress={async () => {
                            try {
                                let getError;
                                setErrorCheck(true);

                                if (!year || !make || !model || !color) { setLoading(false); return; }
                                if (vehicle) {
                                    getError = await handleUpdateVehicle(client, {year, make, model, color, plate, vin}, vehicle.id, userId, setVehicles);
                                } else {
                                    getError = await handleCreateVehicle(client, {year, make, model, color, plate, vin}, userId, setVehicles);
                                }
                                if (!getError) {
                                    router.dismissAll();
                                } else {
                                    setErrorMessage(getError);
                                }
                            } catch (error) {
                                console.error(error);
                            }
                        }}
                    />
                </View>
            </Background>
        </KeyboardAvoidingView>
    );
};

export default Vehicle;