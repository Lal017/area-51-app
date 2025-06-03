import { ActivityIndicator } from 'react-native';
import Colors from '../constants/colors';
import { Background } from '../components/components';

const Loading = () => {

    return (
        <Background style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
            <ActivityIndicator size="large" color={Colors.secondary} />
        </Background>
    );
}

export default Loading;