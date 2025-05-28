import { View, Text, TouchableOpacity, TextInput, KeyboardAvoidingView } from "react-native";
import { ServiceStyles, Styles } from "../../../constants/styles"
import { useApp } from '../../../components/context';
import { useState } from "react";
import Colors from "../../../constants/colors";
import { Entypo, FontAwesome, Ionicons, MaterialIcons } from "@expo/vector-icons";
import { handleSendAdminNotif } from "../../../components/notifComponents";
import { Select } from "../../../components/components";
import { handleCreateTowRequest } from "../../../components/scheduleComponents";

const TowRequest = () =>
{
    const { client, vehicles, userId, setTowRequest } = useApp();

    const [ selectedVehicle, setSelectedVehicle ] = useState();
    const [ notes, setNotes ] = useState();
    const [ step, setStep ] = useState(1);

    return (
        <>
            <View style={ServiceStyles.progressBar}>
                <Ionicons name="information-circle" size={35} color={step > 1 ? Colors.secondary : Colors.backDropAccent} />
                <View style={[ServiceStyles.progressBarLine, {backgroundColor: step > 1 ? Colors.secondary : Colors.backDropAccent}]} />
                <Ionicons name="car-sport" size={30} color={step > 2 ? Colors.secondary : Colors.backDropAccent}/>
                <View style={[ServiceStyles.progressBarLine, {backgroundColor: step > 2 ? Colors.secondary : Colors.backDropAccent}]} />
                <Entypo name="clipboard" size={30} color={step > 3 ? Colors.secondary : Colors.backDropAccent}/>
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
                            onPress={() => setStep(2)}
                        >
                            <FontAwesome name='arrow-left' size={24} color='white' />
                            <Text style={Styles.actionText}>Back</Text>
                        </TouchableOpacity>
                        <TouchableOpacity
                            style={ServiceStyles.directionButton}
                            onPress={() => { if (notes) setStep(4) }}
                        >
                            <Text style={Styles.actionText}>Continue</Text>
                            <FontAwesome name='arrow-right' size={24} color='white' />
                        </TouchableOpacity>
                    </View>
                </KeyboardAvoidingView>
            ) : step === 4 ? (
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
                            onPress={() => setStep(3)}
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
                                handleCreateTowRequest(client, userId, selectedVehicle.id, "N/A", notes, setTowRequest);
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