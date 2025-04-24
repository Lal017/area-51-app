import { TextInput, View, Text } from 'react-native';
import { useState } from 'react';
import { ProfileStyles } from '../../../constants/styles';

const addVehicle = () =>
{   
    const [ year, setYear ] = useState();
    const [ make, setMake ] = useState();
    const [ model, setModel ] = useState();
    const [ color, setColor ] = useState();
    const [ plate, setPlate ] = useState();
    const [ vin, setVin ] = useState();

    return (
        <View style={ProfileStyles.page}>
            <View style={ProfileStyles.formContainer}>
                <Text style={ProfileStyles.title}>Add a Vehicle</Text>
                <View style={ProfileStyles.inputContainer}>
                    <TextInput
                        placeholder='Year'
                        value={year}
                        onChangeText={setYear}
                        keyboardType='numeric'
                        style={ProfileStyles.input}
                    />
                    <TextInput
                        placeholder='Make'
                        value={make}
                        onChangeText={setMake}
                        style={ProfileStyles.input}
                    />
                    <TextInput
                        placeholder='Model'
                        value={model}
                        onChangeText={setModel}
                        style={ProfileStyles.input}
                    />
                    <TextInput
                        placeholder='Color'
                        value={color}
                        onChangeText={setColor}
                        style={ProfileStyles.input}
                    />
                    <Text style={ProfileStyles.subTitle}>Optional</Text>
                    <TextInput
                        placeholder='License Plate #'
                        value={plate}
                        onChangeText={setPlate}
                        style={ProfileStyles.input}
                    />
                    <TextInput
                        placeholder='VIN #'
                        value={vin}
                        onChangeText={setVin}
                        style={ProfileStyles.input}
                    />
                </View>
            </View>
        </View>
    );
};

export default addVehicle;