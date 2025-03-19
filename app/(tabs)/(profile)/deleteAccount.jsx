import { View, Text, TouchableOpacity } from 'react-native';
import { handleDeleteUser } from '../../../components/authComponents';

const DeleteAccount = () =>
{
    return (
        <View>
            <Text> Delete Account </Text>
            <TouchableOpacity
                onPress={handleDeleteUser}    
            >
                <Text> Delete</Text>
            </TouchableOpacity>
        </View>
    )
}

export default DeleteAccount;