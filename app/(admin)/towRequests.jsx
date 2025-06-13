import { View, Text, TouchableOpacity, TextInput } from 'react-native';
import { useApp } from '../../components/context';
import { AdminStyles, Styles } from '../../constants/styles';
import { useEffect, useState } from 'react';
import { listTowRequests } from '../../src/graphql/queries';
import { Background, formatNumber } from '../../components/components';
import { router } from 'expo-router';
import { Entypo } from '@expo/vector-icons';
import { Picker } from '@react-native-picker/picker';
import Colors from '../../constants/colors';

const TowRequests = () =>
{
    const { client } = useApp();
    const [ requests, setRequests ] = useState();
    const [ search, setSearch ] = useState();
    const [ statusFilter, setStatusFilter ] = useState('ALL');

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
        <Background>
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
            <View style={[Styles.block, {paddingLeft: 20}]}>
                <View style={AdminStyles.picker}>
                    <Picker
                        selectedValue={statusFilter}
                        onValueChange={(itemvalue) => setStatusFilter(itemvalue)}
                        style={{color: 'white'}}
                    >
                        <Picker.Item label="All" value='ALL' />
                        <Picker.Item label="Requested" value="REQUESTED" />
                        <Picker.Item label="Pending" value="PENDING" />
                        <Picker.Item label="In Progress" value="IN_PROGRESS" />
                        <Picker.Item label="Cancelled" value="CANCELLED" />
                        <Picker.Item label="Completed" value="COMPLETED" />
                    </Picker>
                </View>
            </View>
            <View style={[Styles.block, {rowGap: 0}]}>
                {requests && requests
                    .filter(request => {
                        const query = search?.toLowerCase() || '';
                        const fullName = `${request.user.firstName} ${request.user.lastName}`.toLowerCase();
                        const matchesSearch = !search || fullName.includes(query);
                        const matchesStatus = statusFilter === 'ALL' || request.status === statusFilter;

                        return matchesSearch && matchesStatus;
                    })
                    .map((request, index) => (
                        <TouchableOpacity
                            key={index}
                            style={AdminStyles.customerBox}
                            onPress={() => router.push({
                                pathname: 'towResponse',
                                params: { customerParam: JSON.stringify(request)}
                            })}
                        >
                            <Text style={Styles.subTitle}>{request.user.firstName} {request.user.lastName}</Text>
                            <Text style={Styles.text}>{formatNumber(request.user.phone)}</Text>
                            <Text style={[
                                Styles.subTitle,
                                request.status === 'REQUESTED' ? {color: Colors.primary} : request.status === 'PENDING' ? {color: Colors.secondary} : request.status === 'IN_PROGRESS' ? {color: 'black'} : request.status === 'CANCELLED' ? {color: 'red'} : request.status === 'COMPLETED' ? {color: '#b3b3b3'} : null
                                ]}>{request.status === 'IN_PROGRESS' ? 'IN PROGRESS' : request.status}</Text>
                        </TouchableOpacity>
                ))}
            </View>
        </Background>
    );
};

export default TowRequests;