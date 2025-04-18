import { Text, View } from 'react-native';
import { ProfileStyles, Styles } from '../../../constants/styles';
import Colors from '../../../constants/colors';

const Contact = () =>
{
    return(
        <View style={ProfileStyles.page}>
            <View style={ProfileStyles.textContainer}>
                <Text style={ProfileStyles.title}> Contact Us </Text>
                <View style={Styles.hr}/>
                <Text style={ProfileStyles.subTitle}> Phone Number </Text>
                <Text style={{color: Colors.text}}> (702) 578 - 4809 </Text>
                <View style={Styles.hr}/>
                <Text style={ProfileStyles.subTitle}> Location </Text>
                <Text style={{color: Colors.text}}> 3120 W Sirius Ave STE 103, Las Vegas, NV 89102 </Text>
            </View>
        </View>
    );
};

export default Contact;