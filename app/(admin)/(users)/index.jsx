import Colors from "../../../constants/colors";
import { Styles } from '../../../constants/styles';
import { handleListUsers } from "../../../components/userComponents";
import { useApp } from '../../../components/context';
import { Background, Tab } from "../../../components/components";
import { View, TextInput } from "react-native";
import { useEffect, useState } from "react";
import { router } from "expo-router";
import { AntDesign, Entypo } from "@expo/vector-icons";

const UserList = () =>
{
    const { client } = useApp();

    const [ users, setUsers ] = useState();
    const [ search, setSearch ] = useState();
    const [ refreshing, setRefreshing ] = useState();

    const onRefresh = async () =>
    {
        setRefreshing(true);
        const getUsers = await handleListUsers(client);
        setUsers(getUsers);
        setRefreshing(false);
    }

    useEffect(() => {
        const fetchUsers = async () =>
        {
            const getUsers = await handleListUsers(client);
            setUsers(getUsers);
        }

        fetchUsers();
    }, [])

    return (
        <Background refreshing={refreshing} onRefresh={onRefresh}>
            <View style={Styles.block}>
                <View style={Styles.inputWrapper}>
                    <Entypo name='magnifying-glass' size={20} color='black' style={Styles.icon} />
                    <TextInput
                        placeholder="Search User"
                        placeholderTextColor={Colors.text}
                        style={Styles.input}
                        value={search}
                        onChangeText={setSearch}
                    />
                </View>
            </View>
            {users && users
                .filter(user => {
                    if (!search) return true;
                    const query = search?.toLowerCase();
                    const fullName = `${user.firstName} ${user.lastName}`.toLowerCase();
                    return fullName.includes(query);
                })
                .map((user, index) => (
                <Tab
                    key={index}
                    text={`${user.firstName} ${user.lastName}`}
                    action={() => router.push({
                        params: { userParam: JSON.stringify(user) },
                        pathname: '/(admin)/userView'
                    })}
                    leftIcon={<Entypo name='user' size={30} style={Styles.icon} />}
                    rightIcon={<AntDesign name='right' size={25} style={Styles.rightIcon} />}
                />
            ))}
        </Background>
    );
};

export default UserList;