import { View, TextInput } from "react-native";
import { Styles } from '../../constants/styles';
import { handleListVehicles } from "../../components/adminComponents";
import { useApp } from '../../components/context';
import { useEffect, useState } from "react";
import { Background, Tab } from "../../components/components";
import { router } from "expo-router";
import { AntDesign, Entypo, Ionicons } from "@expo/vector-icons";
import Colors from "../../constants/colors";

const VehicleList = () =>
{
    const { client } = useApp();

    const [ vehicles, setVehicles ] = useState();
    const [ search, setSearch ] = useState();

    useEffect(() => {
        const fetchVehicles = async () =>
        {
            const getVehicles = await handleListVehicles(client);
            setVehicles(getVehicles);
        }

        fetchVehicles();
    }, [])

    return (
        <Background>
            <View style={Styles.block}>
                <View style={Styles.inputWrapper}>
                    <Entypo name='magnifying-glass' size={20} color='black' style={Styles.icon} />
                    <TextInput
                        placeholder="Search Vehicles"
                        placeholderTextColor={Colors.text}
                        style={Styles.input}
                        value={search}
                        onChangeText={setSearch}
                    />
                </View>
            </View>
            {vehicles && vehicles
                .filter(vehicle => {
                    if (!search) return true;
                    const query = search?.toLowerCase();
                    const fullName = `${vehicle.year} ${vehicle.make} ${vehicle.model}`.toLowerCase();
                    return fullName.includes(query);
                })
                .map((vehicle, index) => (
                <Tab
                    key={index}
                    text={`${vehicle.year} ${vehicle.make} ${vehicle.model}`}
                    leftIcon={<Ionicons name='car-sport' size={30} style={Styles.icon} />}
                    rightIcon={<AntDesign name='right' size={25} style={Styles.rightIcon} />}
                />
            ))}
        </Background>
    );
};

export default VehicleList;