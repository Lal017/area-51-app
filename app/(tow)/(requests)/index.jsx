import { TouchableOpacity, Text } from 'react-native';
import { Background } from '../../../components/components';
import { Styles } from '../../../constants/styles';
import { handleGetAllTowRequests } from '../../../components/scheduleComponents';

const RequestList = () =>
{
    return (
        <Background>
            <TouchableOpacity
                style={Styles.actionButton}
                onPress={async () => {
                    const list = await handleGetAllTowRequests();
                    console.log(list);
                }}
            >
                <Text style={Styles.actionText}>GET</Text>
            </TouchableOpacity>
        </Background>
    );
};

export default RequestList;