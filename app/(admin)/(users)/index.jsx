import Colors from "../../../constants/colors";
import { Styles, ProfileStyles } from '../../../constants/styles';
import { handleListUsers } from "../../../components/userComponents";
import { useApp } from '../../../components/context';
import { Background, Tab } from "../../../components/components";
import { View, TextInput, Text } from "react-native";
import { useEffect, useState } from "react";
import { router } from "expo-router";
import { AntDesign, Entypo, Ionicons } from "@expo/vector-icons";
import Animated, { Easing , useAnimatedStyle, useSharedValue, withRepeat, withSequence, withTiming } from "react-native-reanimated";

const UserList = () =>
{
    const { client } = useApp();

    const [ users, setUsers ] = useState();
    const [ search, setSearch ] = useState();
    const [ refreshing, setRefreshing ] = useState();

    const bounce = useSharedValue(0);

    useEffect(() => {
        bounce.value = withRepeat(
            withSequence(
            withTiming(-10, {
                duration: 500,
                easing: Easing.out(Easing.ease)
            }),
            withTiming(0, {
                duration: 500,
                easing: Easing.in(Easing.ease)
            })
            ),
            -1,     // infinite
            true,   // reverse
        );
    }, []);

    const animatedStyle = useAnimatedStyle(() => ({
    transform: [{ translateY: bounce.value }]
    }));

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
                <View style={ProfileStyles.tabContainer} key={index}>
                    { user?.driverId === "1" ? (
                        <Animated.View style={[ProfileStyles.activityContainer, animatedStyle, {backgroundColor: Colors.tertiary}]}>
                            <Text style={[Styles.subTitle, {fontSize: 20, textAlign: 'center'}]}>!</Text>
                        </Animated.View>
                    ) : null }
                    <Tab
                        text={`${user.firstName} ${user.lastName}`}
                        action={() => router.push({
                            params: { userParam: JSON.stringify(user) },
                            pathname: '/(admin)/userView'
                        })}
                        leftIcon={<Ionicons name='person' size={30} style={Styles.icon} />}
                        rightIcon={<AntDesign name='right' size={25} style={Styles.rightIcon} />}
                    />
                </View>
            ))}
        </Background>
    );
};

export default UserList;