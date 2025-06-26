import { View, Text } from 'react-native';
import { Styles, AdminStyles } from '../../constants/styles';
import { router, useLocalSearchParams } from 'expo-router';
import { Background, formatDate, formatNumber, Tab } from '../../components/components';
import { AntDesign, FontAwesome6, Ionicons } from '@expo/vector-icons';

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
                            <Text style={Styles.text}>Vehicle {index + 1}</Text>
                        </View>
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
            <View style={Styles.block}>
                <View style={Styles.infoContainer}>
                    <Text style={Styles.title}>Invoice Upload</Text>
                    <Text style={Styles.text}>Upload an invoice to this customers account</Text>
                </View>
                <Tab
                    text='Upload Invoice'
                    action={() => router.push({
                        pathname: '/(admin)/invoiceUpload',
                        params: { userParam }
                    })}
                    leftIcon={<FontAwesome6 name='file-pdf' size={30} style={Styles.icon} />}
                    rightIcon={<AntDesign name='right' size={25} style={Styles.rightIcon} />}
                />
                <Tab
                    text='View Invoices'
                    action={() => router.push({
                        pathname: '/(admin)/invoiceList',
                        params: { userParam }
                    })}
                    leftIcon={<FontAwesome6 name='file-invoice-dollar' size={30} style={Styles.icon} />}
                    rightIcon={<AntDesign name='right' size={25} style={Styles.rightIcon} />}
                />
            </View>
            <View style={[Styles.block, {paddingBottom: 50}]}>
                <View style={Styles.infoContainer}>
                    <Text style={Styles.title}>Estimate Upload</Text>
                    <Text style={Styles.text}>Upload an estimate to this customers account</Text>
                </View>
                <Tab
                    text='Upload Estimate'
                    action={() => router.push({
                        pathname: '/(admin)/estimateUpload',
                        params: { userParam }
                    })}
                    leftIcon={<FontAwesome6 name='file-pdf' size={30} style={Styles.icon} />}
                    rightIcon={<AntDesign name='right' size={25} style={Styles.rightIcon} />}
                />
                <Tab
                    text='View Estimates'
                    action={() => router.push({
                        pathname: '/(admin)/estimateList',
                        params: { userParam }
                    })}
                    leftIcon={<FontAwesome6 name='file-circle-question' size={30} style={Styles.icon} />}
                    rightIcon={<AntDesign name='right' size={25} style={Styles.rightIcon} />}
                />
            </View>
        </Background>
    );
};

export default UserView;