import Colors from '../../constants/colors';
import { handleConfirmUserAttribute } from '../../components/authComponents';
import { Background } from '../../components/components';
import { useApp } from '../../components/context';
import { Styles } from '../../constants/styles';
import { View, Text, TextInput, TouchableOpacity } from 'react-native';
import { useState } from 'react';
import { MaterialIcons } from '@expo/vector-icons';
import { useLocalSearchParams } from 'expo-router';
import { useNavigation } from '@react-navigation/native';

const ConfirmAttribute = () =>
{
    const { email } = useLocalSearchParams();
    const { setEmail } = useApp();
    const navigate = useNavigation();

    const [ code, setCode ] = useState();
    const [ loading, setLoading ] = useState(false);

    return(
        <Background>
            <View style={Styles.block}>
                <View style={Styles.infoContainer}>
                    <Text style={Styles.subTitle}>Confirm Email</Text>
                    <Text style={Styles.text}>Check your email for your verification code</Text>
                </View>
                <View style={Styles.inputWrapper}>
                    <MaterialIcons name='numbers' size={20} style={Styles.icon} />
                    <TextInput
                        placeholder="code"
                        placeholderTextColor={Colors.text}
                        value={code}
                        onChangeText={setCode}
                        keyboardType='number-pad'
                        style={Styles.input}
                    />
                </View>
            </View>
            <TouchableOpacity
                onPress={async () => {
                    if (loading) return;
                    setLoading(true);
                    await handleConfirmUserAttribute(navigate, 'email', code, email, setEmail);
                    setLoading(false);
                }}
                style={[Styles.actionButton, loading && {opacity: 0.5}]}
                disabled={loading}
            >
                <Text style={Styles.actionText}>Confirm</Text>
            </TouchableOpacity>
        </Background>
    );
};

export default ConfirmAttribute;