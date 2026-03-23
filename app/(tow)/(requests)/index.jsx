import MaskedView from '@react-native-masked-view/masked-view';
import LottieView from 'lottie-react-native';
import Colors from '../../../constants/colors';
import Animated, { Easing, withRepeat, withTiming, useAnimatedStyle, useSharedValue } from 'react-native-reanimated';
import { useApp } from '../../../components/context';
import { Background, Loading, Tab } from '../../../components/components';
import { Styles } from '../../../constants/styles';
import { handleGetAllTowRequests, getStatus } from '../../../components/towComponents';
import { LinearGradient } from 'expo-linear-gradient';
import { Text, View } from 'react-native';
import { router, useFocusEffect } from 'expo-router';
import { useCallback, useState, useEffect } from 'react';
import { AntDesign, MaterialCommunityIcons } from '@expo/vector-icons';

const RequestList = () =>
{
    const { client, driverId } = useApp();

    const [ towRequests, setTowRequests ] = useState();
    const [ ready, setReady ] = useState(false);
    const [ refreshing, setRefreshing ] = useState();

    const shimmer = useSharedValue(-10);

    const onRefresh = async () =>
    {
        setRefreshing(true);

        try {
            const getTowRequests = await handleGetAllTowRequests(client);
            const getActiveRequest = getTowRequests.find(item => item.driverId === driverId);
            if (getActiveRequest) {
                setTowRequests([getActiveRequest]);
            } else {
                const filteredRequests = getTowRequests.filter(item => item.status === 'REQUESTED');
                setTowRequests(filteredRequests);
            }
            setReady(true);
        } catch (error) {
            console.error('ERROR, could not get tow requests:', error);
        }

        setRefreshing(false);
    };

    useFocusEffect(
        useCallback(() => {
            const getTowRequests = async () =>
            {
                setReady(false);
                try {
                    const getTowRequests = await handleGetAllTowRequests(client);
                    const getActiveRequest = getTowRequests.find(item => item.driverId === driverId);
                    if (getActiveRequest) {
                        setTowRequests([getActiveRequest]);
                    } else {
                        const filteredRequests = getTowRequests.filter(item => item.status === 'REQUESTED');
                        setTowRequests(filteredRequests);
                    }
                } catch (error) {
                    console.error('ERROR, could not get tow requests:', error);
                }
                setReady(true);
            };

            getTowRequests();
        }, [client, driverId])
    );

    useEffect(() => {
        shimmer.value = withRepeat(
            withTiming(1, { duration: 3000, easing: Easing.inOut(Easing.ease) }),
            -1,
            false
        );
    }, [towRequests]);

    const shimmerStyle = useAnimatedStyle(() => ({
        transform: [{ translateX: shimmer.value * 100 }]
    }));

    return (
        <>
        { ready && towRequests ? (
            <Background refreshing={refreshing} onRefresh={onRefresh}>
                { towRequests?.length === 0 && (
                    <View style={[Styles.block, {alignItems: 'center'}]}>
                        <LottieView
                            source={require('../../../assets/animations/no-files.json')}
                            style={{width: 300, height: 300}}
                            speed={0.75}
                            autoPlay={true}
                            loop={false}
                        />
                        <Text style={Styles.title}>No Tow Requests</Text>
                    </View>
                )}
                { towRequests?.map((request, index) => (
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
                                        : request?.status === 'COMPLETED' ? {backgroundColor: Colors.accent}
                                        : request?.status === 'REQUESTED' ? {backgroundColor: Colors.secondary}
                                        : {backgroundColor: Colors.error}
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
                                            colors={[Colors.accent, Colors.accent, Colors.accent]}
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
                                pathname: request.status === 'REQUESTED' ? 'towResponse' : 'towProgress',
                                params: { requestParam: JSON.stringify(request)}
                            })}
                        />
                ))}
            </Background>
        ) : (
            <Loading/>
        )}
        </>
    );
};

export default RequestList;