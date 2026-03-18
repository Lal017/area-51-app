import { View, TextInput } from 'react-native';
import { useApp } from '../../components/context';
import { AdminStyles, Styles } from '../../constants/styles';
import { useEffect, useState } from 'react';
import { listTowRequests } from '../../src/graphql/queries';
import { Background, Tab } from '../../components/components';
import { getStatus } from '../../components/towComponents';
import { LinearGradient } from 'expo-linear-gradient';
import { router } from 'expo-router';
import { AntDesign, Entypo, MaterialCommunityIcons } from '@expo/vector-icons';
import { Picker } from '@react-native-picker/picker';
import Colors from '../../constants/colors';
import Animated, { Easing, withRepeat, withTiming, useAnimatedStyle, useSharedValue } from 'react-native-reanimated';
import MaskedView from '@react-native-masked-view/masked-view';

const TowRequestList = () =>
{
    const { client } = useApp();
    const [ requests, setRequests ] = useState();
    const [ search, setSearch ] = useState();
    const [ statusFilter, setStatusFilter ] = useState('ALL');
    const [ refresing, setRefreshing ] = useState();

    const shimmer = useSharedValue(-10);

    const onRefresh = async () =>
    {
        setRefreshing(true);

        try {
            const getRequests = await client.graphql({
                query: listTowRequests
            });

            setRequests(getRequests.data.listTowRequests.items);  
        } catch (error) {
            console.log('Error getting tow requests:', error);
        }

        setRefreshing(false);
    };

    useEffect(() => {
        const handleGetTowRequests = async () =>
        {
            try {
                const getRequests = await client.graphql({
                    query: listTowRequests
                });

                setRequests(getRequests.data.listTowRequests.items);  
            } catch (error) {
                console.log('Error getting tow requests:', error);
            }
        };

        handleGetTowRequests();
    }, []);

    useEffect(() => {
        shimmer.value = withRepeat(
            withTiming(1, { duration: 3000, easing: Easing.inOut(Easing.ease) }),
            -1,
            false
        );
    }, [requests]);

    const shimmerStyle = useAnimatedStyle(() => ({
        transform: [{ translateX: shimmer.value * 100 }]
    }));

    return (
        <Background refreshing={refresing} onRefresh={onRefresh}>
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
                        style={{color: 'black'}}
                    >
                        <Picker.Item label="All" value='ALL' />
                        <Picker.Item label="Requested" value="REQUESTED" />
                        <Picker.Item label="In Progress" value="IN_PROGRESS" />
                        <Picker.Item label="Cancelled" value="CANCELLED" />
                        <Picker.Item label="Completed" value="COMPLETED" />
                    </Picker>
                </View>
            </View>
            <View style={[Styles.block, {rowGap: 0}]}>
                {requests && requests
                    .sort((a, b) => {
                        const order = { 'IN_PROGRESS': 0, 'REQUESTED': 1, 'COMPLETED': 2, 'CANCELLED': 3 };
                        return (order[a.status] ?? 4) - (order[b.status] ?? 4);
                    })
                    .filter(request => {
                        const query = search?.toLowerCase() || '';
                        const fullName = `${request.user.firstName} ${request.user.lastName}`.toLowerCase();
                        const matchesSearch = !search || fullName.includes(query);
                        const matchesStatus = statusFilter === 'ALL' || request.status === statusFilter;

                        return matchesSearch && matchesStatus;
                    })
                    .map((request, index) => (
                        <Tab
                            key={index}
                            header={`${request?.user?.firstName} ${request?.user?.lastName}`}
                            text={getStatus(request?.status)}
                            leftIcon={
                                <MaskedView
                                    style={[Styles.icon, {width: 30, height: 30}]}
                                    maskElement={
                                        <MaterialCommunityIcons
                                            name='tow-truck'
                                            size={30}
                                        />
                                    }
                                >
                                    <View style={[{flex: 1},
                                        request?.status === 'IN_PROGRESS' ? {backgroundColor: Colors.primary}
                                        : request?.status === 'COMPLETED' ? {backgroundColor: Colors.backDropAccent}
                                        : request?.status === 'REQUESTED' ? {backgroundColor: Colors.secondary}
                                        : {backgroundColor: Colors.redButton}
                                    ]}/>
                                    { request?.status !== 'COMPLETED' && request?.status !== 'CANCELLED' && (
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
                            rightIcon={<AntDesign name='right' size={25} style={Styles.rightIcon} />}
                            action={() => router.push({
                                pathname: 'towResponse',
                                params: { requestParam: JSON.stringify(request)}
                            })}
                        />
                ))}
            </View>
        </Background>
    );
};

export default TowRequestList;