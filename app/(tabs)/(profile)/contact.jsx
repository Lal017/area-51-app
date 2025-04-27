import { Text, View } from 'react-native';
import { ProfileStyles, Styles } from '../../../constants/styles';
import Colors from '../../../constants/colors';

const Contact = () =>
{
    return(
        <View style={ProfileStyles.page}>
            <View style={ProfileStyles.textContainer}>
                <Text style={ProfileStyles.title}> Email </Text>
                <Text style={ProfileStyles.subTitle}>info@Area51MotorsportsLv.com</Text>
                <View style={Styles.hr} />
                <Text style={ProfileStyles.title}> Phone Number </Text>
                <Text style={ProfileStyles.subTitle}> (702) 578 - 4809 </Text>
                <View style={Styles.hr}/>
                <Text style={ProfileStyles.title}> Location </Text>
                <Text style={ProfileStyles.subTitle}> 3120 W Sirius Ave. #103 Las Vegas, NV 89102 </Text>
            </View>
        </View>
    );
};

export default Contact;