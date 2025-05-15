import { ScrollView, TouchableOpacity, Text, View } from "react-native";
import { Styles, AdminStyles } from '../../constants/styles';
import { handleListUsers } from "../../components/adminComponents";
import { useApp } from '../../components/context';
import { useEffect, useState } from "react";
import { formatNumber } from "../../components/components";

const UserList = () =>
{
    const { client } = useApp();

    const [ users, setUsers ] = useState();
    const [ selectedUser, setSelectedUser ] = useState();
    const [ selectedVehicle, setSelectedVehicle ] = useState();

    useEffect(() => {
        const fetchUsers = async () =>
        {
            const getUsers = await handleListUsers(client);
            console.log(getUsers);
            setUsers(getUsers);
        }

        fetchUsers();
    }, [])

    return (
        <ScrollView contentContainerStyle={[Styles.scrollPage, {paddingTop: 25, paddingBottom: 25}]}>
            <View style={AdminStyles.userContainer}>
                {users && users.map((user, index) => (
                    <TouchableOpacity
                        key={index}
                        style={AdminStyles.userCard}
                        onPress={() => {setSelectedUser(user.id); console.log(user.vehicles.items)}}    
                    >
                        <View style={AdminStyles.userInfo}>
                            <Text style={Styles.subTitle}>{user.name}</Text>
                            <Text style={Styles.text}>{user.email}</Text>
                            <Text style={Styles.text}>{formatNumber(user.phone)}</Text>
                        </View>
                        {selectedUser === user.id ? (
                        <>
                            {user.vehicles?.items ? user.vehicles?.items.map((vehicle, index) => (
                                <TouchableOpacity
                                    key={index}
                                    style={AdminStyles.vehicleInfo}
                                    onPress={() => setSelectedVehicle(vehicle)}
                                >
                                    <Text style={Styles.subTitle}>{vehicle.year}</Text>
                                    <Text style={Styles.text}>{vehicle.make}</Text>
                                    <Text style={Styles.text}>{vehicle.model}</Text>
                                    {selectedVehicle === vehicle ? (
                                    <>
                                        {vehicle?.color ? (<Text style={Styles.text}>{vehicle.color}</Text>) : null}
                                        {vehicle?.plate ? (<Text style={Styles.text}>{vehicle.plate}</Text>) : null}
                                        {vehicle?.vin ? (<Text style={Styles.text}>{vehicle.vin}</Text>) : null}
                                    </>
                                    ) : null}
                                </TouchableOpacity>
                            )) : null}
                        </>
                        ) : null}
                    </TouchableOpacity>
                ))}
            </View>
        </ScrollView>
    );
};

export default UserList;