import { View } from 'react-native';
import { ProfileStyles } from '../../../constants/styles'
import { SettingsTab } from '../../../components/components';
import { router, useLocalSearchParams } from 'expo-router';

const Settings = () =>
{
    const { email } = useLocalSearchParams();
    return(
        <View style={ProfileStyles.page}>
            <SettingsTab text="Change password" action={() => router.push('changePassword')} />
            <SettingsTab text="Delete Account" action={() => router.push({
                pathname: 'deleteAccount',
                params: {
                    email: email
                }
            })}/>
        </View>
    );
};

export default Settings;