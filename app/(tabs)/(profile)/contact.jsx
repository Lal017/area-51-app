import { Text, View } from 'react-native';
import { Styles } from '../../../constants/styles';

const Contact = () =>
{
    return(
        <View style={Styles.page}>
            <View style={[Styles.infoContainer, { paddingTop: 25}]}>
                <Text style={[Styles.title, {textAlign: 'left'}]}> Email </Text>
                <Text style={Styles.text}>info@Area51MotorsportsLv.com</Text>
                <View style={Styles.hr} />
                <Text style={[Styles.title, {textAlign: 'left'}]}> Phone Number </Text>
                <Text style={Styles.text}> (702) 578 - 4809 </Text>
                <View style={Styles.hr}/>
                <Text style={[Styles.title, {textAlign: 'left'}]}> Location </Text>
                <Text style={Styles.text}> 3120 W Sirius Ave. #103 Las Vegas, NV 89102 </Text>
            </View>
        </View>
    );
};

export default Contact;