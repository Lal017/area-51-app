import Colors from "../../constants/colors";
import MapView, { PROVIDER_GOOGLE, Marker } from "react-native-maps";
import { Bar } from 'react-native-progress';
import { Dimensions } from "react-native";
import { ServiceStyles, Styles } from "../../constants/styles"
import { useApp } from '../../components/context';
import { handleSendAdminNotif, handleSendDriversNotif } from "../../components/notifComponents";
import { Background, BinarySelect, ErrorDisplay, FloatingBlock, Select, SimpleList, Tab } from "../../components/components";
import { handleCreateTowRequest } from "../../components/towComponents";
import { useEffect, useRef, useState } from "react";
import { Entypo, FontAwesome, FontAwesome5, Ionicons, MaterialIcons, MaterialCommunityIcons, AntDesign } from "@expo/vector-icons";
import { View, Text, TouchableOpacity, TextInput, ActivityIndicator, Alert, KeyboardAvoidingView } from "react-native";
import { requestForegroundPermissionsAsync, getCurrentPositionAsync } from 'expo-location';
import { router } from "expo-router";
import { textSize } from "../../constants/utils";

const screenWidth = Dimensions.get('window').width;

const TowRequest = () =>
{
    const { client, vehicles, userId, setTowRequest, towRequest } = useApp();

    const [ selectedVehicle, setSelectedVehicle ] = useState();
    const [ notes, setNotes ] = useState();
    const [ canRun, setCanRun ] = useState(undefined);
    const [ canRoll, setCanRoll ] = useState(undefined);
    const [ keyIncluded, setKeyIncluded ] = useState(undefined);
    const [ isObstructed, setIsObstructed ] = useState(undefined);
    const [ location, setLocation ] = useState();
    const [ marker, setMarker ] = useState();
    const [ step, setStep ] = useState(1);
    const [ loading, setLoading ] = useState(false);
    const [ errorMessage, setErrorMessage ] = useState(undefined);
    const [ answerCheck, setAnswerCheck ] = useState(false);

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
                    <Ionicons name="car-sport" size={30} color={step >= 2 ? Colors.secondary : Colors.accent}/>
                    <Bar
                        width={screenWidth * 0.09}
                        unfilledColor='white'
                        borderWidth={0}
                        progress={step <= 2 ? 0 : 1}
                        color={Colors.secondary}
                    />
                    <FontAwesome5 name="map-marker-alt" size={30} color={step >= 3 ? Colors.secondary : Colors.accent} />
                    <Bar
                        width={screenWidth * 0.09}
                        unfilledColor='white'
                        borderWidth={0}
                        progress={step <= 3 ? 0 : 1}
                        color={Colors.secondary}
                    />
                    <FontAwesome5 name='pencil-alt' size={30} color={step >= 4 ? Colors.secondary: Colors.accent}/>
                    <Bar
                        width={screenWidth * 0.09}
                        unfilledColor='white'
                        borderWidth={0}
                        progress={step <= 4 ? 0 : 1}
                        color={Colors.secondary}
                    />
                    <Entypo name="clipboard" size={30} color={step >= 5 ? Colors.secondary : Colors.accent}/>
                </View>
                { step === 1 ? (
                    <>
                    <View style={Styles.block}>
                        <View style={Styles.infoContainer}>
                            <Text style={Styles.headerTitle}>Pricing</Text>
                        </View>
                        <View style={Styles.infoContainer}>
                            <Text style={Styles.text}>
                                All tow requests start at a base price of <Text style={{fontWeight: 'bold'}}>$100</Text>. Extra fees may apply depending on the situation. You will recieve a phone call from one of our drivers if extra fees are going to be applied.
                            </Text>
                        </View>
                        <View style={Styles.infoContainer}>
                            <Text style={Styles.text}>Your vehicle will be towed to 4420 Arville St Unit #9, Las Vegas, NV 89102</Text>
                        </View>
                        <View style={Styles.infoContainer}>
                            <View style={{flexDirection: 'row', columnGap: 5, justifyContent: 'flex-start'}}>
                                <Ionicons name='information-circle' size={18} color='white'/>
                                <Text style={[Styles.text, {fontSize: textSize(10)}]}>
                                    Once a driver has accepted your request, you will <Text style={{color: 'red', fontWeight: 'bold'}}>NOT</Text> be able to cancel
                                </Text>
                            </View>
                        </View>
                    </View>
                    <View style={ServiceStyles.buttonContainer}>
                        <TouchableOpacity
                        style={[ServiceStyles.directionButton, {opacity: 0}]}
                        disabled={true}
                        >
                        <AntDesign name='left' size={25} color='white' />
                        <Text style={Styles.actionText}>Back</Text>
                        </TouchableOpacity>
                        <TouchableOpacity
                            style={ServiceStyles.directionButton}
                            onPress={() => setStep(2)}
                        >
                            <Text style={Styles.actionText}>Continue</Text>
                            <AntDesign name='right' size={25} color='white' />
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
                        <View style={[Styles.block, {rowGap: 5}]}>
                            <SimpleList
                                data={vehicles}
                                renderItem={({item}) =>
                                    <Select
                                        header={`${item.year}`}
                                        text={`${item.make} ${item.model}`}
                                        selected={item.id === selectedVehicle?.id ? true : false}
                                        action={() => {item.id === selectedVehicle?.id ? setSelectedVehicle(undefined) : setSelectedVehicle(item)}}
                                        rightIcon={<Ionicons name="car-sport" size={30} style={Styles.rightIcon} color={Colors.accent}/>}
                                        leftIcon={<FontAwesome name={selectedVehicle?.id === item.id ? "circle" : "circle-o"} size={25} style={Styles.icon} color={Colors.accent}/>}
                                    />
                                }
                            />
                        </View>
                        { errorMessage && (
                            <ErrorDisplay message={errorMessage}/>
                        )}
                        <View style={ServiceStyles.buttonContainer}>
                            <TouchableOpacity
                                style={ServiceStyles.directionButton}
                                onPress={() => {
                                    setStep(1);
                                    setErrorMessage(undefined);
                                }}
                            >
                                <AntDesign name='left' size={25} color='white' />
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
                                <AntDesign name='right' size={25} color='white' />
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
                                <View style={[Styles.block, {paddingTop: 20}]}>
                                    <View style={ServiceStyles.buttonContainer}>
                                        <TouchableOpacity
                                            style={ServiceStyles.directionButton}
                                            onPress={() => setStep(2)}
                                        >
                                            <AntDesign name='left' size={25} color='white' />
                                            <Text style={Styles.actionText}>Back</Text>
                                        </TouchableOpacity>
                                        <TouchableOpacity
                                            style={ServiceStyles.directionButton}
                                            onPress={() => { if (selectedVehicle) setStep(4) }}
                                        >
                                            <Text style={Styles.actionText}>Continue</Text>
                                            <AntDesign name='right' size={25} color='white' />
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
                        <View style={Styles.block}>
                            <View style={[Styles.infoContainer, {flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center'}]}>
                                <Text style={[Styles.text, answerCheck && canRun === undefined && {color: 'red'}]}>Does the vehicle start?</Text>
                                <BinarySelect
                                    trueText='Yes'
                                    falseText='No'
                                    value={canRun}
                                    onChange={setCanRun}
                                />
                            </View>
                            <View style={[Styles.infoContainer, {flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center'}]}>
                                <Text style={[Styles.text, answerCheck && canRoll === undefined && {color: 'red'}]}>Does the vehicle roll?</Text>
                                <BinarySelect
                                    trueText='Yes'
                                    falseText='No'
                                    value={canRoll}
                                    onChange={setCanRoll}
                                />
                            </View>
                            <View style={[Styles.infoContainer, {flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center'}]}>
                                <Text style={[Styles.text, answerCheck && keyIncluded === undefined && {color: 'red'}]}>Are the keys included?</Text>
                                <BinarySelect
                                    trueText='Yes'
                                    falseText='No'
                                    value={keyIncluded}
                                    onChange={setKeyIncluded}
                                />
                            </View>
                            <View style={[Styles.infoContainer, {flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center'}]}>
                                <Text style={[Styles.text, answerCheck && isObstructed === undefined && {color: 'red'}]}>Is the vehicle obstructed?</Text>
                                <BinarySelect
                                    trueText='Yes'
                                    falseText='No'
                                    value={isObstructed}
                                    onChange={setIsObstructed}
                                />
                            </View>
                        </View>
                        { errorMessage && (
                            <ErrorDisplay message={errorMessage}/>
                        )}
                        <FloatingBlock>
                            <View style={Styles.infoContainer}>
                                <Text style={Styles.headerTitle}>Description <Text style={Styles.text}>(optional)</Text></Text>
                                <Text style={Styles.tabHeader}>Please, describe why the vehicle needs to be towed</Text>
                            </View>
                            <View style={Styles.inputWrapper}>
                                <MaterialIcons name="notes" size={30} style={Styles.iconAlt} />
                                <TextInput
                                    placeholder="e.g. Flat tire, dead battery, etc."
                                    placeholderTextColor={Colors.grayText}
                                    style={Styles.inputAlt}
                                    multiline={true}
                                    value={notes}
                                    onChangeText={setNotes}
                                />
                            </View>
                        </FloatingBlock>
                        <View style={Styles.block}>
                            <View style={ServiceStyles.buttonContainer}>
                                <TouchableOpacity
                                    style={ServiceStyles.directionButton}
                                    onPress={() => {
                                        setStep(3);
                                        setErrorMessage(undefined);
                                        setAnswerCheck(false);
                                    }}
                                >
                                    <AntDesign name='left' size={25} color='white' />
                                    <Text style={Styles.actionText}>Back</Text>
                                </TouchableOpacity>
                                <TouchableOpacity
                                    style={ServiceStyles.directionButton}
                                    onPress={() => {
                                        if (canRun !== undefined && canRoll !== undefined && keyIncluded !== undefined && isObstructed !== undefined)
                                        {
                                            setStep(5);
                                            setAnswerCheck(false);
                                            setErrorMessage(undefined);
                                        } else {
                                            setAnswerCheck(true);
                                            setErrorMessage('Answer all questions to proceed');
                                        }
                                    }}
                                >
                                    <Text style={Styles.actionText}>Continue</Text>
                                    <AntDesign name='right' size={25} color='white' />
                                </TouchableOpacity>
                            </View>
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
                        <View style={{
                            backgroundColor: 'transparent',
                            width: '90%', height: 250,
                            borderRadius: 15,
                            overflow: 'hidden'
                        }}>
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
                    <FloatingBlock glareTop={true}>
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
                    </FloatingBlock>
                    <View style={[Styles.block, {rowGap: 0}]}>
                        <Tab
                            header='Does the vehicle start?'
                            text={canRun ? 'Yes' : 'No'}
                            leftIcon={<MaterialCommunityIcons name='engine' size={30} style={Styles.icon}/>}
                            style={{height: 'none', padding: 5}}
                        />
                        <Tab
                            header='Does the vehicle roll?'
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
                        { notes && (
                            <View style={Styles.infoContainer}>
                                <Text style={Styles.tabHeader}>Customer Note</Text>
                                <Text style={Styles.text}>{notes}</Text>
                            </View>
                        )}
                    </View>
                    <View style={Styles.block}>
                        <View style={ServiceStyles.buttonContainer}>
                            <TouchableOpacity
                                style={ServiceStyles.directionButton}
                                onPress={() => setStep(4)}
                            >
                                <AntDesign name='left' size={25} color='white' />
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
                                        await handleSendAdminNotif('Towing Request', 'A customer is requesting a tow');
                                        await handleSendDriversNotif('Towing Request', 'A customer is requesting a tow');
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