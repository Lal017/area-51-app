import Colors from "../../../constants/colors";
import { AdminStyles, Styles } from '../../../constants/styles';
import { handleListUsers } from "../../../components/userComponents";
import { useApp } from '../../../components/context';
import { Background, Tab } from "../../../components/components";
import { View, TextInput } from "react-native";
import { useEffect, useState } from "react";
import { router } from "expo-router";
import { AntDesign, Entypo, Ionicons } from "@expo/vector-icons";
import { Picker } from "@react-native-picker/picker";
import { LinearGradient } from "expo-linear-gradient";
import MaskedView from "@react-native-masked-view/masked-view";
import Animated, { useSharedValue, withRepeat, withTiming, Easing, useAnimatedStyle } from "react-native-reanimated";

const UserList = () =>
{
    const { client } = useApp();

    const [ users, setUsers ] = useState();
    const [ search, setSearch ] = useState();
    const [ refreshing, setRefreshing ] = useState();
    const [ statusFilter, setStatusFilter ] = useState('All');

    const shimmer = useSharedValue(-10);

    const onRefresh = async () =>
    {
        setRefreshing(true);
        const getUsers = await handleListUsers(client);
        setUsers(getUsers);
        setRefreshing(false);
    };

    useEffect(() => {
        const fetchUsers = async () =>
        {
            const getUsers = await handleListUsers(client);
            setUsers(getUsers);
        }

        fetchUsers();
    }, []);

    useEffect(() => {
        shimmer.value = withRepeat(
            withTiming(1, { duration: 3000, easing: Easing.inOut(Easing.ease) }),
            -1,
            false
        );
    }, [users]);

    const shimmerStyle = useAnimatedStyle(() => ({
        transform: [{ translateX: shimmer.value * 100 }]
    }));

    return (
        <Background refreshing={refreshing} onRefresh={onRefresh} hasTab={false}>
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
                <View style={[AdminStyles.picker, {marginLeft: 20}]}>
                    <Picker
                        selectedValue={statusFilter}
                        onValueChange={(itemvalue) => setStatusFilter(itemvalue)}
                        style={{color: Colors.text}}
                    >
                        <Picker.Item label='All' value='All'/>
                        <Picker.Item label='Customers' value='Customers'/>
                        <Picker.Item label='TowDrivers' value='TowDrivers'/>
                    </Picker>
                </View>
            </View>
            {users && users
                .filter(user => {
                    const query = search?.toLowerCase();
                    const fullName = `${user.firstName} ${user.lastName}`.toLowerCase();
                    const matchesSearch = !search || fullName.includes(query);
                    const matchesStatus = statusFilter === 'All' || user.access === statusFilter;
                    return matchesSearch && matchesStatus;
                })
                .map((user, index) => (
                <Tab
                    key={index}
                    text={`${user.firstName} ${user.lastName}`}
                    header={`${user.access.slice(0, -1)}`}
                    action={() => router.push({
                        params: { userParam: JSON.stringify(user) },
                        pathname: 'userView'
                    })}
                    leftIcon={
                        <MaskedView
                            style={[Styles.icon, {width: 30, height: 30}]}
                            maskElement={
                                <Ionicons
                                    name='person'
                                    size={30}
                                />
                            }
                        >
                            <View style={[{flex: 1},
                                user?.driverId === '1' ? {backgroundColor: Colors.redButton}
                                : user?.driverId === null ? {backgroundColor: Colors.backDropAccent}
                                : {backgroundColor: Colors.secondary}
                            ]}/>
                            { user?.driverId === '1' && (
                                <Animated.View
                                    style={[shimmerStyle, {
                                    position: 'absolute',
                                    top: 0, bottom: 0,
                                    width: '100%'
                                    }]}
                                >
                                    <LinearGradient
                                    colors={[Colors.backDropAccent, Colors.backDropAccent, Colors.backDropAccent]}
                                    style={{flex: 1}}
                                    start={{ x: 0, y: 0}}
                                    end={{ x: 1, y: 1}}
                                    />
                                </Animated.View>
                            )}
                        </MaskedView>
                    }
                    rightIcon={<AntDesign name='right' size={30} style={Styles.rightIcon}/>}
                />
            ))}
        </Background>
    );
};

export default UserList;