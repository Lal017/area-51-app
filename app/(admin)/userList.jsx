import { TouchableOpacity, Text, View, TextInput } from "react-native";
import { Styles, AdminStyles } from '../../constants/styles';
import { handleListUsers } from "../../components/adminComponents";
import { useApp } from '../../components/context';
import { useEffect, useState } from "react";
import { Background, formatNumber, Tab } from "../../components/components";
import { router } from "expo-router";
import { AntDesign, Entypo } from "@expo/vector-icons";
import Colors from "../../constants/colors";

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
        <Background>
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