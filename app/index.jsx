import { Redirect } from 'expo-router';
import { useEffect, useState } from 'react';
import { handleGetCurrentUser } from '../components/authComponents';
import LottieView from 'lottie-react-native';
import { Background } from '../components/components';

const Index = () =>
{
    const [user, setUser] = useState();
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchUser = async () => {
            try {
                setLoading(true);
                const userData = await handleGetCurrentUser();
                setUser(userData);
            } catch (error) {
                // no user is signed in
            } finally {
                setLoading(false);
            }
        };

        fetchUser();
    }, []);

    if (loading) {
        return (
            <Background style={{justifyContent: 'center'}}>
                <LottieView
                    source={require('../assets/animations/astronaut.json')}
                    autoPlay
                    loop
                    style={{width: 150, height: 150}}
                />
            </Background>
        );
    }

    if (!user) {
        return <Redirect href={{ pathname: '(auth)' }} />;
    }
    else if (user?.accessToken?.payload["cognito:groups"]?.includes('Admins')) {
        return <Redirect href={{ pathname: '(admin)' }} />;
    }
    else if (user?.accessToken?.payload["cognito:groups"]?.includes('TowDrivers')) {
        return <Redirect href={{ pathname: '(tow)' }} />
    }
    return <Redirect href={{ pathname: '(tabs)' }} />;
};

export default Index;