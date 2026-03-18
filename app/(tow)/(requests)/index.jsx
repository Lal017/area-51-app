import { useApp } from '../../../components/context';
import { Background, Loading, Tab } from '../../../components/components';
import { Styles } from '../../../constants/styles';
import { handleGetAllTowRequests, getStatus } from '../../../components/towComponents';
import { Text, View } from 'react-native';
import { router, useFocusEffect } from 'expo-router';
import { useCallback, useState } from 'react';
import { AntDesign, MaterialCommunityIcons } from '@expo/vector-icons';
import LottieView from 'lottie-react-native';

const RequestList = () =>
{
    const { client, driverId } = useApp();

    const [ towRequests, setTowRequests ] = useState();
    const [ ready, setReady ] = useState(false);
    const [ refreshing, setRefreshing ] = useState();

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

    return (
        <>
        { ready && towRequests ? (
            <Background refreshing={refreshing} onRefresh={onRefresh}>
                { towRequests?.length === 0 ? (
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
                ) : null }
                { towRequests?.map((request, index) => (
                    <Tab
                        key={index}
                        header={`${request?.user?.firstName} ${request?.user?.lastName}`}
                        text={getStatus(request?.status)}
                        leftIcon={<MaterialCommunityIcons name='tow-truck' size={35} style={Styles.icon} />}
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