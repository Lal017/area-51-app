import { Text, TextInput, View, TouchableOpacity } from 'react-native';
import { handleSignIn } from '../components/authComponents';

const signIn = () =>
{
    const [email, setEmail] = useState();
    const [password, setPassword] = useState();

    return (
        <View>
            <Text>Sign In</Text>
            <TextInput
                placeholder='Email'
                value={email}
                onChangeText={setEmail}
                keyboardType='email-address'
            />
            <TextInput
                placeholder='password'
                value={password}
                onChangeText={setPassword}
                secureTextEntry
            />

            <TouchableOpacity
                onPress={() => handleSignIn({ email, password })}
            >
                <Text>Login</Text>
            </TouchableOpacity>
        </View>
    );
};

export default signIn;