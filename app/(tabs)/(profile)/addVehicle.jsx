import { TextInput, View, Text, TouchableOpacity } from 'react-native';
import { useState } from 'react';
import { ProfileStyles } from '../../../constants/styles';
import { AntDesign, FontAwesome, Ionicons, MaterialCommunityIcons } from '@expo/vector-icons';
import { handleCreateVehicle } from '../../../components/vehicleComponents';
import { useApp } from '../../../components/context';

const addVehicle = () =>
{   
    const { client, userId } = useApp();

    const [ year, setYear ] = useState();
    const [ make, setMake ] = useState();
    const [ model, setModel ] = useState();
    const [ color, setColor ] = useState();
    const [ plate, setPlate ] = useState();
    const [ vin, setVin ] = useState();

    return (
        <View style={ProfileStyles.page}>
            <View style={ProfileStyles.formContainer}>
                <View style={ProfileStyles.inputContainer}>
                    <View style={ProfileStyles.inputWrapper}>
                        <Ionicons name='calendar' size={20} style={ProfileStyles.icon} />
                        <TextInput
                            placeholder='Year'
                            value={year}
                            onChangeText={setYear}
                            keyboardType='numeric'
                            style={ProfileStyles.input}
                        />
                    </View>
                    <View style={ProfileStyles.inputWrapper}>
                        <MaterialCommunityIcons name='car-convertible' size={20} style={ProfileStyles.icon} />
                        <TextInput
                            placeholder='Make'
                            value={make}
                            onChangeText={setMake}
                            style={ProfileStyles.input}
                        />
                    </View>
                    <View style={ProfileStyles.inputWrapper}>
                        <AntDesign name='tags' size={20} style={ProfileStyles.icon} />
                        <TextInput
                            placeholder='Model'
                            value={model}
                            onChangeText={setModel}
                            style={ProfileStyles.input}
                        />
                    </View>
                    <View style={ProfileStyles.inputWrapper}>
                        <Ionicons name='color-palette' size={20} style={ProfileStyles.icon} />
                        <TextInput
                            placeholder='Color'
                            value={color}
                            onChangeText={setColor}
                            style={ProfileStyles.input}
                        />
                    </View>
                    <Text style={ProfileStyles.subTitle}>Optional</Text>
                    <View style={ProfileStyles.inputWrapper}>
                        <FontAwesome name='id-card' size={20} style={ProfileStyles.icon} />
                        <TextInput
                            placeholder='License Plate #'
                            value={plate}
                            onChangeText={setPlate}
                            style={ProfileStyles.input}
                        />
                    </View>
                    <View style={ProfileStyles.inputWrapper}>
                        <FontAwesome name='barcode' size={20} style={ProfileStyles.icon} />
                        <TextInput
                            placeholder='VIN #'
                            value={vin}
                            onChangeText={setVin}
                            style={ProfileStyles.input}
                        />
                    </View>
                </View>
                <TouchableOpacity
                    style={ProfileStyles.actionButton}
                    onPress={() => handleCreateVehicle(client, {year, make, model, color, plate, vin}, userId)}
                >
                    <Text style={{textAlign: 'center', color: 'white'}}>Add</Text>
                </TouchableOpacity>
            </View>
        </View>
    );
};

export default addVehicle;