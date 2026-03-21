import { Linking, Text, View } from 'react-native';
import { Styles } from '../../../constants/styles';
import { Background, FloatingBlock, Tab } from '../../../components/components';
import { Entypo } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';
import { textSize } from '../../../constants/utils';

const Contact = () =>
{
    return(
        <Background>
            <View style={[Styles.block, {alignItems: 'center'}]}>
                <View style={Styles.infoContainer}>
                    <Text style={Styles.tabHeader}>You can get into contact with us using any of the links below!</Text>
                </View>
                <FloatingBlock>
                    <View style={Styles.infoContainer}>
                        <Text style={[Styles.text, {fontSize: textSize(17)}]}>Customer Support</Text>
                    </View>
                    <Tab
                        header='Email'
                        text='info@Area51Motorsportslv.com'
                        leftIcon={<Entypo name='email' size={25} style={Styles.icon}/>}
                        action={() => Linking.openURL('mailto:info@Area51Motorsportslv.com')}
                    />
                    <Tab
                        header='Phone Number'
                        text='+1 (702) 578 - 4809'
                        leftIcon={<Entypo name='phone' size={25} style={Styles.icon}/>}
                        action={() => Linking.openURL('tel:+17025784809')}
                    />
                    <Tab
                        header='Address'
                        text='4420 Arville St Unit #9, Las Vegas, NV 89102'
                        leftIcon={<Entypo name='location' size={25} style={Styles.icon}/>}
                        action={() => Linking.openURL('https://www.google.com/maps/search/?api=1&query=Area+51+Motorsports+Las+Vegas+NV')}
                    />
                </FloatingBlock>
                <FloatingBlock>
                    <View style={Styles.infoContainer}>
                        <Text style={[Styles.text, {fontSize: textSize(17)}]}>Social Media</Text>
                    </View>
                    <Tab
                        header='Instagram'
                        text='@Area51Motorsports'
                        leftIcon={
                            <LinearGradient
                                colors={['#feda75', '#fa7e1e', '#d62976', '#962fbf', '#4f5bd5']}
                                style={[Styles.icon, {padding: 10, borderRadius: 10}]}
                                start={{ x: 0, y: 0 }}
                                end={{ x: 1, y: 1 }}
                            >
                                <Entypo name='instagram' size={25} color='white'/>
                            </LinearGradient>
                        }
                        action={() => {
                            Linking.canOpenURL('instagram://user?username=area51motorsports').then((supported) => {
                                if (supported) Linking.openURL('instagram://user?username=area51motorsports');
                                else Linking.openURL('https://www.instagram.com/area51motorsports/');
                            });
                        }}
                    />
                    <Tab
                        header='Facebook'
                        text='@Area51MotorsportsLv'
                        leftIcon={
                            <View style={[Styles.icon, {backgroundColor: '#1877f2', padding: 10, borderRadius: 10}]}>
                                <Entypo name='facebook' size={25} color='white'/>
                            </View>
                        }
                        action={() => Linking.openURL('https://www.facebook.com/Area51MotorsportsLv/')}
                    />
                </FloatingBlock>
            </View>
        </Background>
    );
};

export default Contact;