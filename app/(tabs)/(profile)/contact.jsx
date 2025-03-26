import { Text, View } from 'react-native';
import { ProfileStyles } from '../../../constants/styles';

const Contact = () =>
{
    return(
        <View style={ProfileStyles.page}>
            <View style={ProfileStyles.textContainer}>
                <Text style={ProfileStyles.title}> Contact Us </Text>
                <Text style={ProfileStyles.subTitle}> Phone Number </Text>
                <Text> (702) 819 - 6586 </Text>
                <Text style={ProfileStyles.subTitle}> Location </Text>
                <Text> 3120 W Sirius Ave STE 103, Las Vegas, NV 89102 </Text>
            </View>
        </View>
    );
};

export default Contact;