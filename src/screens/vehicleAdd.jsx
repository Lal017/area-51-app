import { TextInput, View, Text, TouchableOpacity, KeyboardAvoidingView } from 'react-native';
import { useState } from 'react';
import { Styles } from '../../constants/styles';
import { AntDesign, FontAwesome, Ionicons, MaterialCommunityIcons } from '@expo/vector-icons';
import { handleCreateVehicle } from '../../components/vehicleComponents';
import { useApp } from '../../components/context';
import Colors from '../../constants/colors';
import { Background } from '../../components/components';

const addVehicle = () =>
{   
    const { client, userId, setVehicles } = useApp();

    const [ year, setYear ] = useState();
    const [ make, setMake ] = useState();
    const [ model, setModel ] = useState();
    const [ color, setColor ] = useState();
    const [ plate, setPlate ] = useState();
    const [ vin, setVin ] = useState();
    const [ loading, setLoading ] = useState(false);

    return (
        <KeyboardAvoidingView behavior='height' style={{flex: 1}}>
            <Background>
                <View style={Styles.block}>
                    <View style={Styles.infoContainer}>
                        <Text style={Styles.subTitle}>Vehicle Information</Text>
                    </View>
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
                    </View>
                    <View style={Styles.infoContainer}>
                        <Text style={Styles.subTitle}>Optional</Text>
                    </View>
                    <View style={Styles.inputContainer}>
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
                </View>
                <View style={[Styles.block, {alignItems: 'center'}]}>
                    <TouchableOpacity
                        style={[Styles.actionButton, loading && { opacity: 0.5 }]}
                        disabled={loading}
                        onPress={async () => {
                            if (loading) return;
                            setLoading(true);
                            await handleCreateVehicle(client, {year, make, model, color, plate, vin}, userId, setVehicles);
                            setLoading(false);
                        }}
                    >
                        <Text style={Styles.actionText}>Add</Text>
                    </TouchableOpacity>
                </View>
            </Background>
        </KeyboardAvoidingView>
    );
};

export default addVehicle;