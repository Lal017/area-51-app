import { TextInput, View, Text, TouchableOpacity } from 'react-native';
import { useState } from 'react';
import { ProfileStyles, Styles } from '../../../constants/styles';
import { AntDesign, FontAwesome, Ionicons, MaterialCommunityIcons } from '@expo/vector-icons';
import { handleCreateVehicle } from '../../../components/vehicleComponents';
import { useApp } from '../../../components/context';
import Colors from '../../../constants/colors';

const addVehicle = () =>
{   
    const { client, userId, setVehicles } = useApp();

    const [ year, setYear ] = useState();
    const [ make, setMake ] = useState();
    const [ model, setModel ] = useState();
    const [ color, setColor ] = useState();
    const [ plate, setPlate ] = useState();
    const [ vin, setVin ] = useState();

    return (
        <View style={[Styles.page, {justifyContent: 'flex-start'}]}>
            <View style={ProfileStyles.formContainer}>
                <View style={Styles.inputContainer}>
                    <View style={Styles.inputWrapper}>
                        <Ionicons name='calendar' size={20} style={Styles.icon} />
                        <TextInput
                            placeholder='Year'
                            placeholderTextColor={Colors.text}
                            value={year}
                            onChangeText={setYear}
                            keyboardType='number-pad'
                            style={Styles.input}
                        />
                    </View>
                    <View style={Styles.inputWrapper}>
                        <MaterialCommunityIcons name='car-convertible' size={20} style={Styles.icon} />
                        <TextInput
                            placeholder='Make'
                            placeholderTextColor={Colors.text}
                            value={make}
                            onChangeText={setMake}
                            style={Styles.input}
                        />
                    </View>
                    <View style={Styles.inputWrapper}>
                        <AntDesign name='tags' size={20} style={Styles.icon} />
                        <TextInput
                            placeholder='Model'
                            placeholderTextColor={Colors.text}
                            value={model}
                            onChangeText={setModel}
                            style={Styles.input}
                        />
                    </View>
                    <View style={Styles.inputWrapper}>
                        <Ionicons name='color-palette' size={20} style={Styles.icon} />
                        <TextInput
                            placeholder='Color'
                            placeholderTextColor={Colors.text}
                            value={color}
                            onChangeText={setColor}
                            style={Styles.input}
                        />
                    </View>
                    <Text style={Styles.subTitle}>Optional</Text>
                    <View style={Styles.inputWrapper}>
                        <FontAwesome name='id-card' size={20} style={Styles.icon} />
                        <TextInput
                            placeholder='License Plate #'
                            placeholderTextColor={Colors.text}
                            value={plate}
                            onChangeText={setPlate}
                            style={Styles.input}
                        />
                    </View>
                    <View style={Styles.inputWrapper}>
                        <FontAwesome name='barcode' size={20} style={Styles.icon} />
                        <TextInput
                            placeholder='VIN #'
                            placeholderTextColor={Colors.text}
                            value={vin}
                            onChangeText={setVin}
                            style={Styles.input}
                        />
                    </View>
                </View>
                <TouchableOpacity
                    style={Styles.actionButton}
                    onPress={() => handleCreateVehicle(client, {year, make, model, color, plate, vin}, userId, setVehicles)}
                >
                    <Text style={Styles.actionText}>Add</Text>
                </TouchableOpacity>
            </View>
        </View>
    );
};

export default addVehicle;