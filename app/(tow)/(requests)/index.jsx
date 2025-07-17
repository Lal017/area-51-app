import { Text } from 'react-native';
import { router } from 'expo-router';
import { Background, Loading, Tab } from '../../../components/components';
import { Styles } from '../../../constants/styles';
import { handleGetAllTowRequests } from '../../../components/scheduleComponents';
import { useEffect, useState } from 'react';
import { AntDesign, MaterialCommunityIcons } from '@expo/vector-icons';
import Colors from '../../../constants/colors';

const RequestList = () =>
{
    const [ towRequests, setTowRequests ] = useState();
    const [ ready, setReady ] = useState(false);
    const [ refresing, setRefreshing ] = useState();

    const onRefresh = async () =>
    {
        setRefreshing(true);

        const getTowRequests = await handleGetAllTowRequests();
        setTowRequests(getTowRequests);

        setRefreshing(false);
    };

    useEffect(() => {
        const getTowRequests = async () =>
        {
            try {
                const getTowRequests = await handleGetAllTowRequests();
                setTowRequests(getTowRequests);
                setReady(true);
            } catch (error) {
                console.log('Error getting tow requests:', error);
            }
        };

        getTowRequests();
    }, []);

    return (
        <>
        { ready ? (
            <Background refreshing={refresing} onRefresh={onRefresh}>
                { towRequests?.map((request, index) => (
                    <Tab
                        key={index}
                        text={<Text style={[Styles.headerTitle, {paddingLeft: 75}, request.status === 'REQUESTED' ? {color: Colors.primary} : request.status === 'IN_PROGRESS' ? {color: Colors.secondary} : null ]}><Text style={Styles.tabText}>{request.user.firstName}</Text>{'\n'}{request.status === 'IN_PROGRESS' ? 'IN PROGRESS' : request.status}</Text>}
                        action={() => router.push({
                            pathname: 'towResponse',
                            params: { towParam: JSON.stringify(request)}
                        })}
                        leftIcon={<MaterialCommunityIcons name='tow-truck' size={35} style={Styles.icon}/>}
                        rightIcon={<AntDesign name='right' size={25} style={Styles.rightIcon} />}
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