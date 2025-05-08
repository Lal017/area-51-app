import { View, Text, TouchableOpacity, TextInput, ScrollView, KeyboardAvoidingView } from "react-native";
import { HomeStyles, Styles } from "../../../constants/styles"
import { useApp } from '../../../components/context';
import { useState } from "react";
import { router } from "expo-router";
import Colors from "../../../constants/colors";
import { FontAwesome, Ionicons, MaterialIcons } from "@expo/vector-icons";
import { handleCustomerRequest } from "../../../components/notifComponents";
import { Select } from "../../../components/components";

const towRequest = () =>
{
    const { vehicles, userId, name, email, phoneNumber, setRequest } = useApp();

    const [ selectedVehicle, setSelectedVehicle ] = useState();
    const [ notes, setNotes ] = useState();

    return (
        <KeyboardAvoidingView behavior="padding">
            <ScrollView contentContainerStyle={[Styles.scrollPage, {paddingTop: 25, paddingBottom: 35}]}>
                <View style={HomeStyles.descriptionContainer}>
                    <Text style={Styles.subTitle}>How the request works?</Text>
                    <Text style={Styles.text}>
                        You won't be charged until after your vehicle has been towed.
                        Your vehicle will be towed to our location: {'\n\n'}
                        3120 W Sirius Ave. #103 Las Vegas, NV 89102 {'\n\n'}
                        You will be charged on arrival either through the app or in person.
                    </Text>
                </View>
                <View style={Styles.hr} />
                <View style={HomeStyles.selectionContainer}>
                    <Text style={Styles.subTitle}>Select the vehicle to be towed</Text>
                    <View style={Styles.tabContainer}>
                        {vehicles?.map((vehicle, index) => (
                            <TouchableOpacity
                            key={index}
                            style={Styles.tabWrapper}
                            >
                                <Ionicons
                                    name="car-sport"
                                    size={30}
                                    style={Styles.icon}
                                    color={selectedVehicle === vehicle ? Colors.backDrop : null}
                                />
                                <Select
                                    text={`${vehicle.year} ${vehicle.make} ${vehicle.model}`}
                                    selected={vehicle === selectedVehicle ? true : false}
                                    action={() => setSelectedVehicle(vehicle)}
                                />
                                <FontAwesome
                                    name={selectedVehicle === vehicle ? "circle" : "circle-o"}
                                    size={25}
                                    style={Styles.rightIcon}
                                    color={selectedVehicle === vehicle ? Colors.backDrop : null}  
                                />
                            </TouchableOpacity>
                        ))}
                    </View>
                    <View style={Styles.hr} />
                    <View style={HomeStyles.descriptionContainer}>
                        <View style={Styles.inputContainer}>
                            <Text style={[Styles.subTitle, {textAlign: 'center'}]}>Please give us a description of why the car needs to be towed</Text>
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
                    </View>
                    <TouchableOpacity
                        style={Styles.actionButton}
                        onPress={() => {
                            handleCustomerRequest(notes, selectedVehicle, { userId, name, email, phoneNumber }, setRequest)
                            router.replace('/(tabs)');
                        }}
                    >
                        <Text style={Styles.actionText}>Request</Text>
                    </TouchableOpacity>
                </View>
            </ScrollView>
        </KeyboardAvoidingView>
    )
};

export default towRequest;