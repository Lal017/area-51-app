import { Text, View } from 'react-native';
import { Styles } from '../../../constants/styles';
import { Background } from '../../../components/components';

const Contact = () =>
{
    return(
        <Background>
            <View style={[Styles.infoContainer, {paddingTop: 50}]}>
                <Text style={Styles.subTitle}>Email</Text>
                <Text style={Styles.text}>info@Area51MotorsportsLv.com</Text>
                <View style={Styles.hr} />
                <Text style={Styles.subTitle}>Phone Number</Text>
                <Text style={Styles.text}>(702) 578 - 4809</Text>
                <View style={Styles.hr}/>
                <Text style={Styles.subTitle}>Location</Text>
                <Text style={Styles.text}>3120 W Sirius Ave. #103 Las Vegas, NV 89102</Text>
            </View>
        </Background>
    );
};

export default Contact;