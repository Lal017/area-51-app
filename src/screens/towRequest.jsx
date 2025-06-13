import { View, Text, TouchableOpacity, TextInput, ActivityIndicator, Alert } from "react-native";
import { ServiceStyles, Styles } from "../../constants/styles"
import { useApp } from '../../components/context';
import { useEffect, useState } from "react";
import Colors from "../../constants/colors";
import { Entypo, FontAwesome, FontAwesome5, Ionicons, MaterialIcons } from "@expo/vector-icons";
import { handleSendAdminNotif } from "../../components/notifComponents";
import { Background, Select } from "../../components/components";
import { handleCreateTowRequest } from "../../components/scheduleComponents";
import { requestForegroundPermissionsAsync, getCurrentPositionAsync } from 'expo-location';
import MapView, { PROVIDER_GOOGLE, Marker } from "react-native-maps";
import { router } from "expo-router";

const TowRequest = () =>
{
    const { client, vehicles, userId, setTowRequest, towRequest } = useApp();

    const [ selectedVehicle, setSelectedVehicle ] = useState();
    const [ notes, setNotes ] = useState();
    const [ location, setLocation ] = useState();
    const [ marker, setMarker ] = useState();
    const [ step, setStep ] = useState(1);
    const [ loading, setLoading ] = useState(false);

    useEffect(() => {
        const getLocation = async () => {
            let { status } = await requestForegroundPermissionsAsync();
            if (status !== 'granted') {
                return;
            }

            let getLocation = await getCurrentPositionAsync({});
            setLocation(getLocation.coords);
            setMarker({
                latitude: getLocation.coords.latitude,
                longitude: getLocation.coords.longitude
            })
        }

        getLocation();
    }, [])

    return (
        <Background>
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
                <>
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
                </View>
                <View style={ServiceStyles.buttonContainer}>
                    <TouchableOpacity
                        style={ServiceStyles.directionButton}
                        onPress={() => setStep(2)}
                    >
                        <Text style={Styles.actionText}>Continue</Text>
                        <FontAwesome name='arrow-right' size={24} color='white' />
                    </TouchableOpacity>
                </View>
                </>
            ) : step === 2 ? (
                <>
                    <View style={Styles.block}>
                        <View style={Styles.infoContainer}>
                            <Text style={Styles.subTitle}>Vehicle Selection</Text>
                            <Text style={Styles.text}>Select the vehicle to be towed</Text>
                        </View>
                    </View>
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
                </>
            ) : step === 3 ? (
                <>
                    { location ? (
                        <>
                            <View style={Styles.block}>
                                <View style={Styles.infoContainer}>
                                    <Text style={Styles.subTitle}>Location</Text>
                                    <Text style={Styles.text}>Drag and drop the pin to the pickup location</Text>
                                </View>
                            </View>
                            <View style={ServiceStyles.mapContainer}>
                                <MapView
                                    provider={PROVIDER_GOOGLE}
                                    style={{width: '100%', height: '100%'}}
                                    showsUserLocation={true}
                                    zoomControlEnabled={true}
                                    region={{
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
                                        onDragEnd={(e) => setMarker(e.nativeEvent.coordinate)}
                                    />
                                </MapView>
                            </View>
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
                        </>
                    ) : (
                        <>
                            <ActivityIndicator size="large" color="#0000ff" />
                            <Text style={Styles.text}>Loading your location...</Text>
                        </>
                    )}
                </>
            ) : step === 4 ? (
                <>
                    <View style={Styles.block}>
                        <View style={Styles.infoContainer}>
                            <Text style={Styles.subTitle}>Description</Text>
                            <Text style={Styles.text}>Please, describe why the vehicle needs to be towed</Text>
                        </View>
                        <View style={Styles.inputWrapper}>
                            <MaterialIcons name="notes" size={30} style={Styles.iconAlt} />
                            <TextInput
                                placeholder="e.g. Flat tire, dead battery, etc."
                                placeholderTextColor={Colors.text}
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
                </>
            ) : step === 5 ? (
                <>
                <View style={ServiceStyles.mapContainerAlt}>
                    { marker ? (
                        <MapView
                            provider={PROVIDER_GOOGLE}
                            style={{width: '100%', height: '100%'}}
                            region={{
                                latitude: marker?.latitude,
                                longitude: marker?.longitude,
                                latitudeDelta: 0.01,
                                longitudeDelta: 0.01
                            }}
                            liteMode={true}
                        >
                            <Marker
                                title="Pickup Location"
                                description="This is where the tow truck will be sent"
                                coordinate={marker}
                            />
                        </MapView>
                    ) : (
                        <ActivityIndicator size='large' color='#0000ff' />
                    ) }
                </View>
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
                        style={[ServiceStyles.directionButton, loading && { opacity: 0.5 }, {backgroundColor: Colors.primary}]}
                        disabled={loading}
                        onPress={async () => {
                            if (loading) return;
                            if (towRequest) {
                                Alert.alert(
                                    'Tow Request',
                                    'You already have an active tow request',
                                    [
                                        {
                                            text: 'OK',
                                            onPress: () => router.replace('(tabs)')
                                        }
                                    ]
                                )
                                return;
                            }
                            setLoading(true);
                            const data = {
                                notes: notes,
                                vehicleId: selectedVehicle.id,
                                userId: userId
                            };
                            await handleSendAdminNotif('Towing Request', 'A customer is requesting a tow', data);
                            await handleCreateTowRequest(client, userId, selectedVehicle.id, marker, notes, setTowRequest);
                            setLoading(false);
                        }}
                    >
                        <Text style={Styles.actionText}>Submit</Text>
                    </TouchableOpacity>
                </View>
                </>
            ) : null }
        </Background>
    )
};

export default TowRequest;