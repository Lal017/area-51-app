import { ScrollView, TouchableOpacity, Text, View, TextInput } from "react-native";
import { Styles, AdminStyles } from '../../constants/styles';
import { handleListUsers } from "../../components/adminComponents";
import { useApp } from '../../components/context';
import { useEffect, useState } from "react";
import { formatNumber } from "../../components/components";
import { router } from "expo-router";
import { Entypo } from "@expo/vector-icons";

const UserList = () =>
{
    const { client } = useApp();

    const [ users, setUsers ] = useState();
    const [ search, setSearch ] = useState();

    useEffect(() => {
        const fetchUsers = async () =>
        {
            const getUsers = await handleListUsers(client);
            setUsers(getUsers);
        }

        fetchUsers();
    }, [])

    return (
        <ScrollView contentContainerStyle={[Styles.scrollPage, {paddingTop: 25, paddingBottom: 25}]}>
            <View style={Styles.inputWrapper}>
                <Entypo name='magnifying-glass' size={20} color='black' style={Styles.icon} />
                <TextInput
                    placeholder="Search User"
                    style={Styles.input}
                    value={search}
                    onChangeText={setSearch}
                />
            </View>
            <View style={[Styles.container, {rowGap: 0}]}>
                {users && users
                    .filter(user => {
                        if (!search) return true;
                        const query = search?.toLowerCase();
                        return(
                            user.name?.toLowerCase().includes(query)
                        );
                    })
                    .map((user, index) => (
                        <TouchableOpacity
                            key={index}
                            style={AdminStyles.customerBox}
                            onPress={() => router.push({
                                params: { userParam: JSON.stringify(user) },
                                pathname: '/(admin)/userView'
                            })}    
                        >
                            <Text style={Styles.subTitle}>{user.name}</Text>
                            <Text style={Styles.text}>{user.email}</Text>
                            <Text style={Styles.text}>{formatNumber(user.phone)}</Text>
                        </TouchableOpacity>
                ))}
            </View>
        </ScrollView>
    );
};

export default UserList;