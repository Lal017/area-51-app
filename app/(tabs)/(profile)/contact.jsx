import { Linking, Text, View } from 'react-native';
import { ProfileStyles, Styles } from '../../../constants/styles';
import { Background, InfoTab } from '../../../components/components';
import { Entypo } from '@expo/vector-icons';
import Colors from '../../../constants/colors';
import { LinearGradient } from 'expo-linear-gradient';
import { RFValue } from 'react-native-responsive-fontsize';

const Contact = () =>
{
    return(
        <Background>
            <View style={[Styles.block, {alignItems: 'center'}]}>
                <View style={Styles.infoContainer}>
                    <Text style={Styles.tabHeader}>You can get into contact with us using any of the links below!</Text>
                </View>
                <View style={[ProfileStyles.floatingBlock, {backgroundColor: Colors.backgroundAccent}]}>
                    <View style={Styles.infoContainer}>
                        <Text style={[Styles.text, {fontSize: RFValue(17)}]}>Customer Support</Text>
                    </View>
                    <InfoTab
                        header='Email'
                        text='info@Area51Motorsportslv.com'
                        icon={<Entypo name='email' size={25} style={Styles.icon}/>}
                        action={() => Linking.openURL('mailto:info@Area51Motorsportslv.com')}
                    />
                    <InfoTab
                        header='Phone Number'
                        text='+1 (702) 578 - 4809'
                        icon={<Entypo name='phone' size={25} style={Styles.icon}/>}
                        action={() => Linking.openURL('tel:+17025784809')}
                    />
                    <InfoTab
                        header='Address'
                        text='4420 Arville St Unit #9, Las Vegas, NV 89102'
                        icon={<Entypo name='location' size={25} style={Styles.icon}/>}
                        action={() => Linking.openURL('https://www.google.com/maps/search/?api=1&query=Area+51+Motorsports+Las+Vegas+NV')}
                    />
                </View>
                <View style={[ProfileStyles.floatingBlock, {backgroundColor: Colors.backgroundAccent}]}>
                    <View style={Styles.infoContainer}>
                        <Text style={[Styles.text, {fontSize: RFValue(17)}]}>Social Media</Text>
                    </View>
                    <InfoTab
                        header='Instagram'
                        text='@Area51Motorsports'
                        icon={
                            <LinearGradient
                                colors={['#feda75', '#fa7e1e', '#d62976', '#962fbf', '#4f5bd5']}
                                style={[Styles.icon, {padding: 10, borderRadius: 10}]}
                                start={{ x: 0, y: 0 }}
                                end={{ x: 1, y: 1 }}
                            >
                                <Entypo name='instagram' size={25} color='white'/>
                            </LinearGradient>
                        }
                        action={() => Linking.openURL('https://www.instagram.com/area51motorsports/')}
                    />
                    <InfoTab
                        header='Facebook'
                        text='@Area51MotorsportsLv'
                        icon={
                            <View style={[Styles.icon, {backgroundColor: '#1877f2', padding: 10, borderRadius: 10}]}>
                                <Entypo name='facebook' size={25} color='white'/>
                            </View>
                        }
                        action={() => Linking.openURL('https://www.facebook.com/Area51MotorsportsLv/')}
                    />
                </View>
            </View>
        </Background>
    );
};

export default Contact;