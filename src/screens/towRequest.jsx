import { View, Text, TouchableOpacity, TextInput, ActivityIndicator, Alert } from "react-native";
import { ServiceStyles, Styles } from "../../constants/styles"
import { useApp } from '../../components/context';
import { useEffect, useState } from "react";
import Colors from "../../constants/colors";
import { Entypo, FontAwesome, FontAwesome5, Ionicons, MaterialIcons } from "@expo/vector-icons";
import { handleSendAdminNotif, handleSendDriversNotif } from "../../components/notifComponents";
import { Background, BinarySelect, Select } from "../../components/components";
import { handleCreateTowRequest } from "../../components/scheduleComponents";
import { requestForegroundPermissionsAsync, getCurrentPositionAsync } from 'expo-location';
import MapView, { PROVIDER_GOOGLE, Marker } from "react-native-maps";
import { router } from "expo-router";

const TowRequest = () =>
{
    const { client, vehicles, userId, setTowRequest, towRequest } = useApp();

    const [ selectedVehicle, setSelectedVehicle ] = useState();
    const [ notes, setNotes ] = useState();
    const [ canRun, setCanRun ] = useState();
    const [ canRoll, setCanRoll ] = useState();
    const [ keyIncluded, setKeyIncluded ] = useState();
    const [ isObstructed, setIsObstructed ] = useState();
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
                <View style={Styles.block}>
                    <View style={[Styles.infoContainer, {rowGap: 0}]}>
                        <Text style={Styles.subTitle}>Pricing</Text>
                        <Text style={Styles.text}>
                            All tow requests start at a base price of <Text style={{fontWeight: 'bold'}}>$100</Text>. Extra fees may apply depending on the situation. You will recieve a phone call from one of our drivers if extra fees are going to be applied.
                        </Text>
                    </View>
                    <View style={[Styles.infoContainer, {rowGap: 0}]}>
                        <Text style={Styles.subTitle}>Where will you be towed?</Text>
                        <Text style={Styles.text}>3120 W Sirius Ave STE 103,{'\n'}Las Vegas, NV 89102</Text>
                    </View>
                    <View style={[Styles.infoContainer, {rowGap: 0}]}>
                        <Text style={Styles.subTitle}>NOTE</Text>
                        <Text style={Styles.text}>Once a driver has accepted your request, you will <Text style={{color: 'red', fontWeight: 'bold'}}>NOT</Text> be able to cancel</Text>
                    </View>
                </View>
                <View style={{flex: 1, justifyContent: 'flex-end', alignItems: 'center', paddingBottom: 25, width: '100%'}}>
                    <View style={ServiceStyles.buttonContainer}>
                        <TouchableOpacity
                        style={[ServiceStyles.directionButton, {opacity: 0}]}
                        disabled={true}
                        >
                        <FontAwesome name='arrow-left' size={24} color='white' />
                        <Text style={Styles.actionText}>Back</Text>
                        </TouchableOpacity>
                        <TouchableOpacity
                            style={ServiceStyles.directionButton}
                            onPress={() => setStep(2)}
                        >
                            <Text style={Styles.actionText}>Continue</Text>
                            <FontAwesome name='arrow-right' size={24} color='white' />
                        </TouchableOpacity>
                    </View>
                </View>
                </>
            ) : step === 2 ? (
                <>
                    <View style={{flex: 1, width: '100%'}}>
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
                    </View>
                    <View style={{flex: 1, justifyContent: 'flex-end', alignItems: 'center', paddingBottom: 25, width: '100%'}}>
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
                            <View style={{flex: 1, justifyContent: 'flex-end', alignItems: 'center', paddingBottom: 25, width: '100%'}}>
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
                        <View style={[Styles.infoContainer, {rowGap: 0}]}>
                            <Text style={Styles.subTitle}>Description (optional)</Text>
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
                        <View style={Styles.infoContainer}>
                            <Text style={Styles.text}>Does the vehicle start?</Text>
                            <View style={Styles.binaryTabContainer}>
                                <BinarySelect
                                    text='Yes'
                                    selected={canRun !== undefined ? canRun : null}
                                    action={() => setCanRun(true)}
                                    rightIcon={<Entypo name="thumbs-up" size={30} color='white'/>}
                                />
                                <BinarySelect
                                    text='No'
                                    selected={canRun !== undefined ? !canRun : null }
                                    action={() => setCanRun(false)}
                                    rightIcon={<Entypo name="thumbs-down" size={30} color='white'/>}
                                />
                            </View>
                        </View>
                        <View style={Styles.infoContainer}>
                            <Text style={Styles.text}>Does the vehicle roll?</Text>
                            <View style={Styles.binaryTabContainer}>
                                <BinarySelect
                                    text='Yes'
                                    selected={canRoll !== undefined ? canRoll : null}
                                    action={() => setCanRoll(true)}
                                    rightIcon={<Entypo name="thumbs-up" size={30} color='white'/>}
                                />
                                <BinarySelect
                                    text='No'
                                    selected={canRoll !== undefined ? !canRoll : null }
                                    action={() => setCanRoll(false)}
                                    rightIcon={<Entypo name="thumbs-down" size={30} color='white'/>}
                                />
                            </View>
                        </View>
                        <View style={Styles.infoContainer}>
                            <Text style={Styles.text}>Are the vehicle keys included?</Text>
                            <View style={Styles.binaryTabContainer}>
                                <BinarySelect
                                    text='Yes'
                                    selected={keyIncluded !== undefined ? keyIncluded : null}
                                    action={() => setKeyIncluded(true)}
                                    rightIcon={<Entypo name="thumbs-up" size={30} color='white'/>}
                                />
                                <BinarySelect
                                    text='No'
                                    selected={keyIncluded !== undefined ? !keyIncluded : null }
                                    action={() => setKeyIncluded(false)}
                                    rightIcon={<Entypo name="thumbs-down" size={30} color='white'/>}
                                />
                            </View>
                        </View>
                        <View style={Styles.infoContainer}>
                            <Text style={Styles.text}>Is there anything obstructing the vehicle?</Text>
                            <View style={Styles.binaryTabContainer}>
                                <BinarySelect
                                    text='Yes'
                                    selected={isObstructed !== undefined ? isObstructed : null}
                                    action={() => setIsObstructed(true)}
                                    rightIcon={<Entypo name="thumbs-up" size={30} color='white'/>}
                                />
                                <BinarySelect
                                    text='No'
                                    selected={isObstructed !== undefined ? !isObstructed : null }
                                    action={() => setIsObstructed(false)}
                                    rightIcon={<Entypo name="thumbs-down" size={30} color='white'/>}
                                />
                            </View>
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
                            onPress={() => { if (canRun !== undefined && canRoll !== undefined && keyIncluded !== undefined && isObstructed !== undefined) setStep(5) }}
                        >
                            <Text style={Styles.actionText}>Continue</Text>
                            <FontAwesome name='arrow-right' size={24} color='white' />
                        </TouchableOpacity>
                    </View>
                </>
            ) : step === 5 ? (
                <>
                <View style={[Styles.block, {alignItems: 'center'}]}>
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
                </View>
                <View style={[Styles.block]}>
                    <View style={[Styles.infoContainer, {rowGap: 0}]}>
                        <Text style={Styles.subTitle}>Vehicle</Text>
                        <Text style={Styles.text}>{selectedVehicle.year} {selectedVehicle.make} {selectedVehicle.model}</Text>
                    </View>
                    <View style={[Styles.infoContainer, {rowGap: 0}]}>
                        <Text style={[Styles.subTitle]}>Tow Details</Text>
                        <Text style={Styles.text}> - Car runs?                               {canRun ? 'Yes' : 'No' }</Text>
                        <Text style={Styles.text}> - Car rolls?                               {canRoll ? 'Yes' : 'No' }</Text>
                        <Text style={Styles.text}> - Keys included?                     {keyIncluded ? 'Yes' : 'No' }</Text>
                        <Text style={Styles.text}> - Vehicle is obstructed?         {isObstructed ? 'Yes' : 'No' }</Text>
                    </View>
                    { notes ? (
                        <View style={[Styles.infoContainer, {rowGap: 0}]}>
                            <Text style={Styles.subTitle}>Notes</Text>
                            <Text style={Styles.text}>{notes}</Text>
                        </View>
                    ) : null}
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
                                                onPress: () => router.replace('towStatus')
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
                                await handleSendDriversNotif('Towing Request', 'A customer is requesting a tow', data);
                                await handleCreateTowRequest(client, userId, selectedVehicle.id, marker, { notes, canRun, canRoll, keyIncluded, isObstructed }, setTowRequest);
                                setLoading(false);
                            }}
                        >
                            <Text style={Styles.actionText}>Submit</Text>
                        </TouchableOpacity>
                    </View>
                </View>
                </>
            ) : null }
        </Background>
    )
};

export default TowRequest;