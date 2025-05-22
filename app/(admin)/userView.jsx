import { View, Text, ScrollView } from 'react-native';
import { Styles, AdminStyles } from '../../constants/styles';
import { useLocalSearchParams } from 'expo-router';
import { formatDate, formatNumber } from '../../components/components';

const UserView = () =>
{
    const { userParam } = useLocalSearchParams();
    const customer = JSON.parse(userParam);

    return (
        <ScrollView contentContainerStyle={[Styles.scrollPage, {justifyContent: 'flex-start'}]}>
            <View style={[Styles.infoContainer, {rowGap: 15}]}>
                <View style={AdminStyles.block}>
                    <Text style={[Styles.title, {textAlign: 'left'}]}>Customer</Text>
                    <View style={AdminStyles.labelContainer}>
                        <Text style={Styles.subTitle}>Name</Text>
                        <Text style={Styles.text}>{customer.name}</Text>
                    </View>
                    <View style={AdminStyles.labelContainer}>
                        <Text style={Styles.subTitle}>Email</Text>
                        <Text style={Styles.text}>{customer.email}</Text>
                    </View>
                    <View style={AdminStyles.labelContainer}>
                        <Text style={Styles.subTitle}>Phone Number</Text>
                        <Text style={Styles.text}>{formatNumber(customer.phone)}</Text>
                    </View>
                    <View style={AdminStyles.labelContainer}>
                        <Text style={Styles.subTitle}>Created on</Text>
                        <Text style={Styles.text}>{formatDate(customer.createdAt)}</Text>
                    </View>
                </View>
                <View style={[AdminStyles.block, {marginBottom: 30}]}>
                    <Text style={[Styles.title, {textAlign: 'left'}]}>Vehicles</Text>
                    { customer.vehicles.items.map((vehicle, index) => (
                        <View style={AdminStyles.vehicleContainer} key={index}>
                            <View style={AdminStyles.labelContainer}>
                                <Text style={Styles.subTitle}>Year</Text>
                                <Text style={Styles.text}>{vehicle.year}</Text>
                            </View>
                            <View style={AdminStyles.labelContainer}>
                                <Text style={Styles.subTitle}>Make</Text>
                                <Text style={Styles.text}>{vehicle.make}</Text>
                            </View>
                            <View style={AdminStyles.labelContainer}>
                                <Text style={Styles.subTitle}>Model</Text>
                                <Text style={Styles.text}>{vehicle.model}</Text>
                            </View>
                            { vehicle.color ? (
                            <View style={AdminStyles.labelContainer}>
                                <Text style={Styles.subTitle}>Color</Text>
                                <Text style={Styles.text}>{vehicle.color}</Text>
                            </View>
                            ) : null }
                            { vehicle.plate ? (
                            <View style={AdminStyles.labelContainer}>
                                <Text style={Styles.subTitle}>Plate</Text>
                                <Text style={Styles.text}>{vehicle.plate}</Text>
                            </View>
                            ) : null }
                            { vehicle.vin ? (
                            <View style={AdminStyles.labelContainer}>
                                <Text style={Styles.subTitle}>VIN</Text>
                                <Text style={Styles.text}>{vehicle.vin}</Text>
                            </View>
                            ) : null }
                        </View>
                    ))}
                </View>
            </View>
        </ScrollView>
    );
};

export default UserView;