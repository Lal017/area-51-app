import { Redirect } from 'expo-router';
import { ActivityIndicator, View } from 'react-native';
import { useEffect, useState } from 'react';
import { handleGetCurrentUser } from '../components/authComponents';

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
            <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
                <ActivityIndicator size="large" color="#0000ff" />
            </View>
        );
    }

    if (!user) {
        return <Redirect href={{ pathname: '(auth)' }} />;
    }
    else if (user && user.accessToken.payload["cognito:groups"]?.includes('Admins')) {
        return <Redirect href={{ pathname: '(admin)' }} />;
    }
    return <Redirect href={{ pathname: '(tabs)' }} />;
};

export default Index;