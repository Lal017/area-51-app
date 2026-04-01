import { Background } from '../components/components';
import { handleGetCurrentUser } from '../services/authService';
import { Redirect } from 'expo-router';
import { useEffect, useState } from 'react';
import LottieView from 'lottie-react-native';

const Index = () =>
{
    const [user, setUser] = useState();
    const [loading, setLoading] = useState(true);

    // get current authenticated user
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

    // set loading screen while calling handleGetCurrentUser
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
        // if there is no current authenticated user
        return <Redirect href={{ pathname: '(auth)' }} />;
    }
    else if (user?.accessToken?.payload["cognito:groups"]?.includes('Admins')) {
        // if user is an admin
        return <Redirect href={{ pathname: '(admin)' }} />;
    }
    else if (user?.accessToken?.payload["cognito:groups"]?.includes('TowDrivers')) {
        // if user is a tow driver
        return <Redirect href={{ pathname: '(tow)' }} />
    }
    // if user is a customer
    return <Redirect href={{ pathname: '(tabs)' }} />;
};

export default Index;