import { View, Text, TouchableOpacity } from 'react-native';
import { ProfileStyles, Styles } from '../../constants/styles';
import { Background, Tab, socialRedirect } from '../../components/components';
import { handleSignOut } from '../../components/authComponents';
import { router } from 'expo-router';
import { useApp } from '../../components/context';
import { AntDesign, Ionicons, MaterialIcons } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';

// Profile page
const Profile = () =>
{
    const { email, firstName, lastName } = useApp();

    return(
        <Background>
            <View style={Styles.block}>
                <View style={Styles.infoContainer}>
                    <Text style={ProfileStyles.name}>{firstName} {lastName}</Text>
                    <Text style={[Styles.text, {fontSize: 17}]}>{email}</Text>
                </View>
            </View>
            <Tab
                text='Edit Profile'
                action={() => router.push('/(admin)/accountEdit')}
                leftIcon={<Ionicons name='person' size={30} style={Styles.icon} />}
                rightIcon={<AntDesign name='right' size={25} style={Styles.rightIcon} />}
            />
            <Tab
                text='Change Password'
                action={() => router.push('/(admin)/resetPassword')}
                leftIcon={<MaterialIcons name='lock-reset' size={30} style={Styles.icon} />}
                rightIcon={<AntDesign name='right' size={25} style={Styles.rightIcon} />}
            />
            <Tab
                text='Delete Account'
                action={() => router.push('/(admin)/deleteAccount')}
                leftIcon={<AntDesign name='deleteuser' size={30} style={Styles.icon} />}
                rightIcon={<AntDesign name='right' size={25} style={Styles.rightIcon} />}
            />
            <View style={ProfileStyles.socialContainer}>
                <TouchableOpacity
                    style={[ProfileStyles.socialBox, {backgroundColor: '#1877f2'}]}
                    onPress={() => socialRedirect('https://www.facebook.com/Area51MotorsportsLv/')}
                >
                    <AntDesign name='facebook-square' size={30} color='white' />
                </TouchableOpacity>
                <TouchableOpacity
                    onPress={() => socialRedirect('https://www.instagram.com/area51motorsports/')}
                >
                    <LinearGradient
                        colors={['#feda75', '#fa7e1e', '#d62976', '#962fbf', '#4f5bd5']}
                        style={ProfileStyles.socialBox}
                        start={{ x: 0, y: 0 }}
                        end={{ x: 1, y: 1 }}
                    >
                        <AntDesign name='instagram' size={30} color='white' />
                    </LinearGradient>
                </TouchableOpacity>
            </View>
            <TouchableOpacity
                onPress={handleSignOut}
                style={Styles.actionButton}
            >
                <Text style={Styles.actionText}>Sign Out</Text>
            </TouchableOpacity>
        </Background>
    );
};

export default Profile;