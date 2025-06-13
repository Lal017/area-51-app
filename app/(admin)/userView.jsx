import { View, Text } from 'react-native';
import { Styles, AdminStyles } from '../../constants/styles';
import { useLocalSearchParams } from 'expo-router';
import { Background, formatDate, formatNumber } from '../../components/components';

const UserView = () =>
{
    const { userParam } = useLocalSearchParams();
    const customer = JSON.parse(userParam);

    return (
        <Background>
            <View style={Styles.block}>
                <View style={Styles.infoContainer}>
                    <Text style={[Styles.title, {textAlign: 'left'}]}>Customer</Text>
                    <View style={AdminStyles.labelContainer}>
                        <Text style={Styles.subTitle}>Name</Text>
                        <Text style={Styles.text}>{customer.firstName} {customer.lastName}</Text>
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
            </View>
            <View style={Styles.block}>
                { customer.vehicles.items.length > 0 ? (<Text style={[Styles.title, {paddingLeft: 20}]}>Vehicles</Text>)
                    : (<Text style={[Styles.title, {paddingLeft: 20}]}>Customer has no vehicles</Text>)}
                { customer.vehicles?.items?.map((vehicle, index) => (
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
        </Background>
    );
};

export default UserView;