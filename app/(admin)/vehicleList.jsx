import Colors from "../../constants/colors";
import { Background, Tab } from "../../components/components";
import { Styles } from '../../constants/styles';
import { handleListVehicles } from "../../services/vehicleService";
import { useApp } from '../../hooks/useApp';
import { View, TextInput } from "react-native";
import { useEffect, useState } from "react";
import { router } from "expo-router";
import { AntDesign, Entypo, Ionicons } from "@expo/vector-icons";

const VehicleList = () =>
{
    const { client } = useApp();

    const [ vehicles, setVehicles ] = useState();
    const [ search, setSearch ] = useState();
    const [ refreshing, setRefreshing ] = useState();

    const onRefresh = async () =>
    {
        setRefreshing(true);
        try {
            const getVehicles = await handleListVehicles(client);
            setVehicles(getVehicles);
        } catch (error) {
            console.error(error);
        }
        setRefreshing(false);
    };

    useEffect(() => {
        const fetchVehicles = async () =>
        {
            try {
                const getVehicles = await handleListVehicles(client);
                setVehicles(getVehicles);
            } catch (error) {
                console.error(error);
            }
        }

        fetchVehicles();
    }, [])

    return (
        <Background refreshing={refreshing} onRefresh={onRefresh}>
            <View style={Styles.block}>
                <View style={Styles.inputWrapper}>
                    <Entypo name='magnifying-glass' size={20} color='black' style={Styles.inputIcon} />
                    <TextInput
                        placeholder="Search Vehicles"
                        placeholderTextColor={Colors.grayText}
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
                    header={`${vehicle.user.firstName} ${vehicle.user.lastName}`}
                    text={`${vehicle.year} ${vehicle.make} ${vehicle.model}`}
                    action={() => router.push({
                        pathname: '(admin)/vehicleView',
                        params: { vehicleParam: JSON.stringify(vehicle)}
                    })}
                    leftIcon={<Ionicons name='car-sport' size={30} style={Styles.icon} />}
                    rightIcon={<AntDesign name='right' size={25} style={Styles.rightIcon} />}
                />
            ))}
        </Background>
    );
};

export default VehicleList;