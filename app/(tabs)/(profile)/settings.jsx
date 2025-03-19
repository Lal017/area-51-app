import { View, Text } from 'react-native';
import { ProfileStyles } from '../../../constants/styles'
import { SettingsTab } from '../../../components/components';
import { router } from 'expo-router';

const Settings = () =>
{
    return(
        <View style={ProfileStyles.page}>
            <SettingsTab text="Change password" action={() => router.push('changePassword')} />
            <SettingsTab text="Delete Account" action={() => router.push('deleteAccount')}/>
        </View>
    );
};

export default Settings;