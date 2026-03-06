import Colors from "../../constants/colors";
import MapView, { PROVIDER_GOOGLE, Marker } from "react-native-maps";
import { Bar } from 'react-native-progress';
import { Dimensions } from "react-native";
import { ServiceStyles, Styles } from "../../constants/styles"
import { useApp } from '../../components/context';
import { handleSendAdminNotif, handleSendDriversNotif } from "../../components/notifComponents";
import { Background, BinarySelect, Select, SimpleList, Tab } from "../../components/components";
import { handleCreateTowRequest } from "../../components/towComponents";
import { useEffect, useRef, useState } from "react";
import { Entypo, FontAwesome, FontAwesome5, Ionicons, MaterialIcons, MaterialCommunityIcons } from "@expo/vector-icons";
import { View, Text, TouchableOpacity, TextInput, ActivityIndicator, Alert, KeyboardAvoidingView } from "react-native";
import { requestForegroundPermissionsAsync, getCurrentPositionAsync } from 'expo-location';
import { router } from "expo-router";
import { RFValue } from "react-native-responsive-fontsize";

const screenWidth = Dimensions.get('window').width;

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
    const [ errorMessage, setErrorMessage ] = useState(undefined);
    const [ missingAnswer, setMissingAnswer ] = useState(false);

    const scrollRef = useRef(null);

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

    useEffect(() => {
        scrollRef.current?.scrollTo({
            y: 0,
            animated: false
        });
    }, [step]);

    return (
        <KeyboardAvoidingView
            behavior='padding'
            style={{flex: 1}}
        >
            <Background scrollRef={scrollRef}>
                <View style={ServiceStyles.progressBar}>
                    <Ionicons name="information-circle" size={35} color={Colors.secondary} />
                    <Bar
                        width={screenWidth * 0.09}
                        unfilledColor='white'
                        borderWidth={0}
                        progress={step === 1 ? 0 : 1}
                        color={Colors.secondary}
                    />
                    <Ionicons name="car-sport" size={30} color={step >= 2 ? Colors.secondary : Colors.backDropAccent}/>
                    <Bar
                        width={screenWidth * 0.09}
                        unfilledColor='white'
                        borderWidth={0}
                        progress={step <= 2 ? 0 : 1}
                        color={Colors.secondary}
                    />
                    <FontAwesome5 name="map-marker-alt" size={30} color={step >= 3 ? Colors.secondary : Colors.backDropAccent} />
                    <Bar
                        width={screenWidth * 0.09}
                        unfilledColor='white'
                        borderWidth={0}
                        progress={step <= 3 ? 0 : 1}
                        color={Colors.secondary}
                    />
                    <FontAwesome5 name='pencil-alt' size={30} color={step >= 4 ? Colors.secondary: Colors.backDropAccent}/>
                    <Bar
                        width={screenWidth * 0.09}
                        unfilledColor='white'
                        borderWidth={0}
                        progress={step <= 4 ? 0 : 1}
                        color={Colors.secondary}
                    />
                    <Entypo name="clipboard" size={30} color={step >= 5 ? Colors.secondary : Colors.backDropAccent}/>
                </View>
                { step === 1 ? (
                    <>
                    <View style={[Styles.block, {alignItems: 'center'}]}>
                        <View style={[Styles.infoContainer]}>
                            <Text style={Styles.headerTitle}>Pricing</Text>
                            <Text style={Styles.text}>
                                All tow requests start at a base price of <Text style={{fontWeight: 'bold'}}>$100</Text>. Extra fees may apply depending on the situation. You will recieve a phone call from one of our drivers if extra fees are going to be applied.
                            </Text>
                            <Text style={Styles.text}>Your vehicle will be towed to 4420 Arville St Unit #9, Las Vegas, NV 89102</Text>
                        </View>
                        <View style={[Styles.infoContainer, {flexDirection: 'row', columnGap: 5, justifyContent: 'flex-start'}]}>
                            <Ionicons name='information-circle' size={18} color='white'/>
                            <Text style={[Styles.text, {fontSize: RFValue(10)}]}>
                                Once a driver has accepted your request, you will <Text style={{color: 'red', fontWeight: 'bold'}}>NOT</Text> be able to cancel
                            </Text>
                        </View>
                    </View>
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
                    </>
                ) : step === 2 ? (
                    <>
                        <View style={Styles.block}>
                            <View style={Styles.infoContainer}>
                                <Text style={Styles.headerTitle}>Vehicle Selection</Text>
                                <Text style={Styles.tabHeader}>Select the vehicle to be towed</Text>
                            </View>
                        </View>
                        <View style={[Styles.block, {rowGap: 0}]}>
                            <SimpleList
                                data={vehicles}
                                renderItem={({item}) =>
                                    <Select
                                        header={`${item.year}`}
                                        text={`${item.make} ${item.model}`}
                                        selected={item.id === selectedVehicle?.id ? true : false}
                                        action={() => {item.id === selectedVehicle?.id ? setSelectedVehicle(undefined) : setSelectedVehicle(item)}}
                                        rightIcon={<Ionicons name="car-sport" size={30} style={Styles.rightIcon} color={Colors.backDropAccent}/>}
                                        leftIcon={<FontAwesome name={selectedVehicle?.id === item.id ? "circle" : "circle-o"} size={25} style={Styles.icon} color={Colors.backDropAccent}/>}
                                    />
                                }
                            />
                        </View>
                        { errorMessage && (
                            <View style={Styles.block}>
                                <View style={Styles.errorContainer}>
                                    <FontAwesome name='exclamation-circle' size={20} style={[Styles.icon, {color: 'red'}]}/>
                                    <Text style={Styles.errorText}>{errorMessage}</Text>
                                </View>
                            </View>
                        )}
                        <View style={ServiceStyles.buttonContainer}>
                            <TouchableOpacity
                                style={ServiceStyles.directionButton}
                                onPress={() => {
                                    setStep(1);
                                    setErrorMessage(undefined);
                                }}
                            >
                                <FontAwesome name='arrow-left' size={24} color='white' />
                                <Text style={Styles.actionText}>Back</Text>
                            </TouchableOpacity>
                            <TouchableOpacity
                                style={ServiceStyles.directionButton}
                                onPress={() => {
                                    if (selectedVehicle) {
                                        setStep(3);
                                        setErrorMessage(undefined);
                                    } else {
                                        setErrorMessage('Select a vehicle to continue');
                                    }
                                }}
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
                                        <Text style={Styles.headerTitle}>Verify your Location</Text>
                                        <Text style={Styles.tabHeader}>drag and drop the pin to the pickup location</Text>
                                    </View>
                                </View>
                                <View style={ServiceStyles.mapContainer}>
                                    <MapView
                                        provider={PROVIDER_GOOGLE}
                                        style={{width: '100%', height: '100%'}}
                                        showsUserLocation={true}
                                        zoomControlEnabled={true}
                                        userInterfaceStyle='dark'
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
                                <View style={Styles.block}>
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
                            <View style={[Styles.block, {alignItems: 'center'}]}>
                                <ActivityIndicator size="large" color="#0000ff" />
                                <Text style={Styles.text}>Loading your location...</Text>
                            </View>
                        )}
                    </>
                ) : step === 4 ? (
                    <>
                        <View style={[Styles.block, {alignItems: 'center'}]}>
                            <View style={Styles.infoContainer}>
                                <Text style={Styles.headerTitle}>Towing Information</Text>
                                <Text style={Styles.tabHeader}>Please answer the following questions</Text>
                            </View>
                        </View>
                        <View style={[Styles.floatingBlock, missingAnswer && {borderColor: 'red', borderWidth: 1}, {rowGap: 15, marginBottom: 20}]}>
                            <View style={Styles.infoContainer}>
                                <Text style={Styles.text}>Does the vehicle start?</Text>
                                <View style={Styles.binaryTabContainer}>
                                    <BinarySelect
                                        text='Yes'
                                        selected={canRun !== undefined ? canRun : null}
                                        action={() => { canRun ? setCanRun(undefined) : setCanRun(true)}}
                                        rightIcon={<Entypo name="thumbs-up" size={30} color='white'/>}
                                    />
                                    <BinarySelect
                                        text='No'
                                        selected={canRun !== undefined ? !canRun : null }
                                        action={() => { canRun === false ? setCanRun(undefined) : setCanRun(false)}}
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
                                        action={() => { canRoll ? setCanRoll(undefined) : setCanRoll(true)}}
                                        rightIcon={<Entypo name="thumbs-up" size={30} color='white'/>}
                                    />
                                    <BinarySelect
                                        text='No'
                                        selected={canRoll !== undefined ? !canRoll : null }
                                        action={() => { canRoll === false ? setCanRoll(undefined) : setCanRoll(false)}}
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
                                        action={() => { keyIncluded ? setKeyIncluded(undefined) : setKeyIncluded(true)}}
                                        rightIcon={<Entypo name="thumbs-up" size={30} color='white'/>}
                                    />
                                    <BinarySelect
                                        text='No'
                                        selected={keyIncluded !== undefined ? !keyIncluded : null }
                                        action={() => { keyIncluded === false ? setKeyIncluded(undefined) : setKeyIncluded(false)}}
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
                                        action={() => { isObstructed ? setIsObstructed(undefined) : setIsObstructed(true)}}
                                        rightIcon={<Entypo name="thumbs-up" size={30} color='white'/>}
                                    />
                                    <BinarySelect
                                        text='No'
                                        selected={isObstructed !== undefined ? !isObstructed : null }
                                        action={() => { isObstructed === false ? setIsObstructed(undefined) : setIsObstructed(false)}}
                                        rightIcon={<Entypo name="thumbs-down" size={30} color='white'/>}
                                    />
                                </View>
                            </View>
                        </View>
                        { errorMessage && (
                            <View style={Styles.block}>
                                <View style={Styles.errorContainer}>
                                    <FontAwesome name='exclamation-circle' size={20} style={[Styles.icon, {color: 'red'}]}/>
                                    <Text style={Styles.errorText}>{errorMessage}</Text>
                                </View>
                            </View>
                        )}
                        <View style={[Styles.floatingBlock, {rowGap: 10}]}>
                            <View style={Styles.infoContainer}>
                                <Text style={Styles.headerTitle}>Description <Text style={Styles.text}>(optional)</Text></Text>
                                <Text style={Styles.tabHeader}>Please, describe why the vehicle needs to be towed</Text>
                            </View>
                            <View style={Styles.inputWrapper}>
                                <MaterialIcons name="notes" size={30} style={Styles.iconAlt} />
                                <TextInput
                                    placeholder="e.g. Flat tire, dead battery, etc."
                                    placeholderTextColor={Colors.subText}
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
                                onPress={() => {
                                    setStep(3);
                                    setErrorMessage(undefined);
                                    setMissingAnswer(false);
                                }}
                            >
                                <FontAwesome name='arrow-left' size={24} color='white' />
                                <Text style={Styles.actionText}>Back</Text>
                            </TouchableOpacity>
                            <TouchableOpacity
                                style={ServiceStyles.directionButton}
                                onPress={() => {
                                    if (canRun !== undefined && canRoll !== undefined && keyIncluded !== undefined && isObstructed !== undefined)
                                    {
                                        setStep(5);
                                        setMissingAnswer(false);
                                        setErrorMessage(undefined);
                                    } else {
                                        setMissingAnswer(true);
                                        setErrorMessage('Answer all questions to proceed');
                                    }
                                }}
                            >
                                <Text style={Styles.actionText}>Continue</Text>
                                <FontAwesome name='arrow-right' size={24} color='white' />
                            </TouchableOpacity>
                        </View>
                    </>
                ) : step === 5 ? (
                <>
                    <View style={Styles.block}>
                        <View style={Styles.infoContainer}>
                            <Text style={Styles.headerTitle}>Towing Information</Text>
                            <Text style={Styles.tabHeader}>Review the information and confirm it is correct</Text>
                        </View>
                    </View>
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
                                    toolbarEnabled={false}
                                    showsUserLocation={false}
                                    liteMode={true}
                                    userInterfaceStyle='dark'
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
                    <View style={Styles.floatingBlock}>
                        <View style={Styles.infoContainer}>
                            <Text style={Styles.headerTitle}>Vehicle</Text>
                        </View>
                        <Tab
                            header={`${selectedVehicle.year}`}
                            text={`${selectedVehicle.make} ${selectedVehicle.model}`}
                            leftIcon={<Ionicons name='car-sport' size={30} style={Styles.icon}/>}
                            style={{height: 'none'}}
                        />
                        <Tab
                            header='Vehicle Color'
                            text={`${selectedVehicle.color}`}
                            leftIcon={<FontAwesome name='paint-brush' size={30} style={Styles.icon}/>}
                            style={{height: 'none'}}
                        />
                        { selectedVehicle.plate && (
                            <Tab
                                header='License Plate #'
                                text={`${selectedVehicle.plate}`}
                                leftIcon={<FontAwesome name='id-card' size={30} style={Styles.icon}/>}
                                style={{height: 'none'}}
                            />
                        )}
                        { selectedVehicle.vin && (
                            <Tab
                                header='VIN'
                                text={`${selectedVehicle.vin}`}
                                leftIcon={<FontAwesome name='barcode' size={30} style={Styles.icon}/>}
                                style={{height: 'none'}}
                            />
                        )}
                    </View>
                    <View style={[Styles.block, {paddingTop: 20}]}>
                        <View style={Styles.infoContainer}>
                            <Tab
                                header='Does the car run?'
                                text={canRun ? 'Yes' : 'No'}
                                leftIcon={<MaterialCommunityIcons name='engine' size={30} style={Styles.icon}/>}
                                style={{height: 'none', padding: 5}}
                            />
                            <Tab
                                header='Does the car roll?'
                                text={canRoll ? 'Yes' : 'No'}
                                leftIcon={<MaterialCommunityIcons name='tire' size={30} style={Styles.icon}/>}
                                style={{height: 'none', padding: 5}}
                            />
                            <Tab
                                header='Are the keys included?'
                                text={keyIncluded ? 'Yes' : 'No'}
                                leftIcon={<Entypo name='key' size={30} style={Styles.icon}/>}
                                style={{height: 'none', padding: 5}}
                            />
                            <Tab
                                header='Is the vehicle obstructed?'
                                text={isObstructed ? 'Yes' : 'No'}
                                leftIcon={<Entypo name='warning' size={30} style={Styles.icon}/>}
                                style={{height: 'none', padding: 5}}
                            />
                        </View>
                        { notes ? (
                            <View style={Styles.infoContainer}>
                                <Text style={Styles.headerTitle}>Customer Note</Text>
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
                                    try {
                                        const data = {
                                            notes: notes,
                                            vehicleId: selectedVehicle.id,
                                            userId: userId
                                        };
                                        await handleSendAdminNotif('Towing Request', 'A customer is requesting a tow', data);
                                        await handleSendDriversNotif('Towing Request', 'A customer is requesting a tow', data);
                                        await handleCreateTowRequest(client, userId, selectedVehicle, marker, { notes, canRun, canRoll, keyIncluded, isObstructed }, setTowRequest);
                                    } catch (error) {
                                        console.error(error);
                                    }
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
        </KeyboardAvoidingView>
    )
};

export default TowRequest;