import { View, Text, TouchableOpacity, TextInput, KeyboardAvoidingView, ActivityIndicator, ScrollView } from "react-native";
import { ServiceStyles, Styles } from "../../../constants/styles"
import { useApp } from '../../../components/context';
import { useEffect, useState } from "react";
import Colors from "../../../constants/colors";
import { Entypo, FontAwesome, FontAwesome5, Ionicons, MaterialIcons } from "@expo/vector-icons";
import { handleSendAdminNotif } from "../../../components/notifComponents";
import { Select } from "../../../components/components";
import { handleCreateTowRequest } from "../../../components/scheduleComponents";
import { requestForegroundPermissionsAsync, getCurrentPositionAsync } from 'expo-location';
import MapView, { PROVIDER_GOOGLE, Marker } from "react-native-maps";

const TowRequest = () =>
{
    const { client, vehicles, userId, setTowRequest } = useApp();

    const [ selectedVehicle, setSelectedVehicle ] = useState();
    const [ notes, setNotes ] = useState();
    const [ location, setLocation ] = useState();
    const [ marker, setMarker ] = useState();
    const [ step, setStep ] = useState(1);

    useEffect(() => {
        const getLocation = async () => {
            let { status } = await requestForegroundPermissionsAsync();
            if (status !== 'granted') {
                console.log('Permission to access location was denied');
                return;
            }

            let getLocation = await getCurrentPositionAsync({});
            setLocation(getLocation.coords);
            setMarker({
                latitude: getLocation.coords.latitude,
                longitude: getLocation.coords.longitude
            })
            console.log('location:', getLocation.coords);
        }

        getLocation();
    }, [])

    return (
        <>
            <View style={ServiceStyles.progressBar}>
                <Ionicons name="information-circle" size={35} color={step > 1 ? Colors.secondary : Colors.backDropAccent} />
                <View style={[ServiceStyles.progressBarLine, {backgroundColor: step > 1 ? Colors.secondary : Colors.backDropAccent}]} />
                <Ionicons name="car-sport" size={30} color={step > 2 ? Colors.secondary : Colors.backDropAccent}/>
                <View style={[ServiceStyles.progressBarLine, {backgroundColor: step > 2 ? Colors.secondary : Colors.backDropAccent}]} />
                <FontAwesome5 name="map-marker-alt" size={30} color={step > 3 ? Colors.secondary : Colors.backDropAccent} />
                <View style={[ServiceStyles.progressBarLine, {backgroundColor: step > 3 ? Colors.secondary : Colors.backDropAccent}]} />
                <Entypo name="clipboard" size={30} color={step > 4 ? Colors.secondary : Colors.backDropAccent}/>
            </View>
            { step === 1 ? (
                <View style={[Styles.page, {justifyContent: 'center'}]}>
                    <View style={Styles.infoContainer}>
                        <Text style={Styles.subTitle}>How the request works?</Text>
                        <Text style={Styles.text}>
                            You'll start by filling out a form with details about your tow request. Based on this information, we'll provide you with a price and an estimated wait time.
                        </Text>
                        <Text style={Styles.text}>
                            You can then choose to confirm or cancel the request. If you accept, a tow driver will be dispatched to your location immediately. If you cancel, the request will be canceled and you won't be charged.
                        </Text>
                        <Text style={Styles.text}>
                            <Text style={{fontWeight: 500}}>NOTE: </Text>Once the request is confirmed, it cannot be canceled.
                        </Text>
                        <Text style={Styles.subTitle}>
                            Where will you be towed?
                        </Text>
                        <Text style={Styles.text}>3120 W Sirius Ave STE 103, Las Vegas, NV 89102</Text>
                        <View style={ServiceStyles.buttonContainer}>
                            <TouchableOpacity
                                style={ServiceStyles.directionButton}
                                onPress={() => setStep(2)}
                            >
                                <Text style={Styles.actionText}>Continue</Text>
                                <FontAwesome name='arrow-right' size={24} color='white' />
                            </TouchableOpacity>
                        </View>
                    </View>
                </View>
            ) : step === 2 ? (
                <View style={[Styles.page, {justifyContent: 'center', rowGap: 20}]}>
                    <Text style={[Styles.subTitle, {color: Colors.textAlt}]}>Select the vehicle to be towed</Text>
                    <View style={ServiceStyles.selectionContainer}>
                        {vehicles?.map((vehicle, index) => (
                            <Select
                                key={index}
                                text={`${vehicle.year} ${vehicle.make} ${vehicle.model}`}
                                selected={vehicle === selectedVehicle ? true : false}
                                action={() => setSelectedVehicle(vehicle)}
                                leftIcon={<Ionicons name="car-sport" size={30} style={Styles.icon} color={selectedVehicle === vehicle ? Colors.backDrop : null}/>}
                                rightIcon={<FontAwesome name={selectedVehicle === vehicle ? "circle" : "circle-o"} size={25} style={Styles.rightIcon} color={selectedVehicle === vehicle ? Colors.backDrop : null}/>}
                            />
                        ))}
                    </View>
                    <View style={ServiceStyles.buttonContainer}>
                        <TouchableOpacity
                            style={ServiceStyles.directionButton}
                            onPress={() => setStep(1)}
                        >
                            <FontAwesome name='arrow-left' size={24} color='white' />
                            <Text style={Styles.actionText}>Back</Text>
                        </TouchableOpacity>
                        <TouchableOpacity
                            style={ServiceStyles.directionButton}
                            onPress={() => { if (selectedVehicle) setStep(3) }}    
                        >
                            <Text style={Styles.actionText}>Continue</Text>
                            <FontAwesome name='arrow-right' size={24} color='white' />
                        </TouchableOpacity>
                    </View>
                </View>
            ) : step === 3 ? (
                <>
                { location ? (
                    <View style={[Styles.page, {rowGap: 20, flexGrow: 1}]}>
                        <View style={[Styles.infoContainer, {paddingTop: 20}]}>
                            <Text style={[Styles.subTitle, {textAlign: 'center'}]}>Drag and drop the pin to the pickup location</Text>
                        </View>
                        <MapView
                            provider={PROVIDER_GOOGLE}
                            style={{width: '100%', height: '60%'}}
                            showsUserLocation={true}
                            zoomControlEnabled={true}
                            initialRegion={{
                                latitude: location?.latitude,
                                longitude: location?.longitude,
                                latitudeDelta: 0.01,
                                longitudeDelta: 0.01
                            }}
                        >
                            <Marker
                                title="Pickup Location"
                                description="This is where the tow truck will be sent"
                                coordinate={marker}
                                draggable={true}
                                onDragEnd={(e) => {
                                    console.log('Marker dragged to:', e.nativeEvent.coordinate);
                                    setMarker(e.nativeEvent.coordinate)}}
                            />
                        </MapView>
                        <View style={ServiceStyles.buttonContainer}>
                            <TouchableOpacity
                                style={ServiceStyles.directionButton}
                                onPress={() => setStep(2)}
                            >
                                <FontAwesome name='arrow-left' size={24} color='white' />
                                <Text style={Styles.actionText}>Back</Text>
                            </TouchableOpacity>
                            <TouchableOpacity
                                style={ServiceStyles.directionButton}
                                onPress={() => { if (selectedVehicle) setStep(4) }}    
                            >
                                <Text style={Styles.actionText}>Continue</Text>
                                <FontAwesome name='arrow-right' size={24} color='white' />
                            </TouchableOpacity>
                        </View>
                    </View>
                ) : (
                    <View style={[Styles.page, {justifyContent: 'center'}]}>
                        <ActivityIndicator size="large" color="#0000ff" />
                        <Text style={Styles.text}>Loading your location...</Text>
                    </View>
                )}
                </>
            ) : step === 4 ? (
                <KeyboardAvoidingView behavior='padding' style={[Styles.page, {justifyContent: 'center'}]}>
                    <View style={Styles.inputContainer}>
                        <Text style={[Styles.subTitle, {textAlign: 'center', paddingLeft: 30, paddingRight: 30}]}>Please provide us with a description of why the car needs to be towed</Text>
                        <View style={Styles.inputWrapper}>
                            <MaterialIcons name="notes" size={30} style={Styles.iconAlt} />
                            <TextInput
                                placeholder="e.g. Flat tire, dead battery, etc."
                                style={Styles.inputAlt}
                                multiline={true}
                                value={notes}
                                onChangeText={setNotes}
                            />
                        </View>
                    </View>
                    <View style={ServiceStyles.buttonContainer}>
                        <TouchableOpacity
                            style={ServiceStyles.directionButton}
                            onPress={() => setStep(3)}
                        >
                            <FontAwesome name='arrow-left' size={24} color='white' />
                            <Text style={Styles.actionText}>Back</Text>
                        </TouchableOpacity>
                        <TouchableOpacity
                            style={ServiceStyles.directionButton}
                            onPress={() => { if (notes) setStep(5) }}
                        >
                            <Text style={Styles.actionText}>Continue</Text>
                            <FontAwesome name='arrow-right' size={24} color='white' />
                        </TouchableOpacity>
                    </View>
                </KeyboardAvoidingView>
            ) : step === 5 ? (
                <View style={[Styles.page, {justifyContent: 'center'}]}>
                    <View style={Styles.infoContainer}>
                        <Text style={Styles.subTitle}>Vehicle</Text>
                        <Text style={Styles.text}>{`${selectedVehicle.year} ${selectedVehicle.make} ${selectedVehicle.model}`}</Text>
                        <Text style={Styles.subTitle}>Description</Text>
                        <Text style={Styles.text}>{notes}</Text>
                    </View>
                    <View style={ServiceStyles.buttonContainer}>
                        <TouchableOpacity
                            style={ServiceStyles.directionButton}
                            onPress={() => setStep(4)}
                        >
                            <FontAwesome name='arrow-left' size={24} color='white' />
                            <Text style={Styles.actionText}>Back</Text>
                        </TouchableOpacity>
                        <TouchableOpacity
                            style={[ServiceStyles.directionButton, {backgroundColor: Colors.primary}]}
                            onPress={() => {
                                const data = {
                                    notes: notes,
                                    vehicleId: selectedVehicle.id,
                                    userId: userId
                                };
                                handleSendAdminNotif('Towing Request', 'A customer has requested a tow', data);
                                handleCreateTowRequest(client, userId, selectedVehicle.id, marker, notes, setTowRequest);
                            }}
                        >
                            <Text style={Styles.actionText}>Submit</Text>
                        </TouchableOpacity>
                    </View>
                </View>
            ) : null }
        </>
    )
};

export default TowRequest;