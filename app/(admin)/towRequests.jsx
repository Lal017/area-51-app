import { View, Text, TouchableOpacity, ScrollView } from 'react-native';
import { useApp } from '../../components/context';
import { AdminStyles, Styles } from '../../constants/styles';
import { useEffect, useState } from 'react';
import { listTowRequests } from '../../src/graphql/queries';
import { formatNumber } from '../../components/components';
import { router } from 'expo-router';
import Colors from '../../constants/colors';

const TowRequests = () =>
{
    const { client } = useApp();
    const [ requests, setRequests ] = useState();

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

    return (
        <ScrollView contentContainerStyle={Styles.scrollPage}>
            <View style={[Styles.container, {rowGap: 0}]}>
                {requests ? (
                    requests.map((request, index) => (
                        <TouchableOpacity
                            key={index}
                            style={AdminStyles.customerBox}
                            onPress={() => router.push({
                                pathname: 'towResponse',
                                params: { customerParam: JSON.stringify(request)}
                            })}
                        >
                            <Text style={Styles.subTitle}>{request.user.name}</Text>
                            <Text style={Styles.text}>{formatNumber(request.user.phone)}</Text>
                            <Text style={[
                                Styles.subTitle,
                                request.status === 'REQUESTED' ? {color: Colors.primary} : request.status === 'PENDING' ? {color: Colors.secondary} : request.status === 'IN_PROGRESS' ? {color: 'green'} : null
                                ]}>{request.status === 'IN_PROGRESS' ? 'IN PROGRESS' : request.status}</Text>
                        </TouchableOpacity>
                ))) : null}
            </View>
        </ScrollView>
    );
};

export default TowRequests;