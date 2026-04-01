import Colors from '../../constants/colors';
import { handleConfirmUserAttribute } from '../../services/authService';
import { ActionButton, Background } from '../../components/components';
import { useApp } from '../../hooks/useApp';
import { Styles } from '../../constants/styles';
import { View, Text, TextInput } from 'react-native';
import { useState } from 'react';
import { MaterialIcons } from '@expo/vector-icons';
import { useLocalSearchParams } from 'expo-router';

const ConfirmAttribute = () =>
{
    const { email } = useLocalSearchParams();
    const { setEmail } = useApp();

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
                    <MaterialIcons name='numbers' size={20} style={Styles.inputIcon} />
                    <TextInput
                        placeholder="code"
                        placeholderTextColor={Colors.grayText}
                        value={code}
                        onChangeText={setCode}
                        keyboardType='number-pad'
                        style={Styles.input}
                    />
                </View>
            </View>
            <ActionButton
                text='Confirm'
                primaryColor={Colors.primary}
                secondaryColor={Colors.primaryShade}
                onPress={async () => await handleConfirmUserAttribute('email', code, email, setEmail)}
            />
        </Background>
    );
};

export default ConfirmAttribute;