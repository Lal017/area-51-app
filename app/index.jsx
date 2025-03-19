import { Redirect } from 'expo-router';
import { ActivityIndicator, View } from 'react-native';
import { useEffect, useState } from 'react';
import { handleGetCurrentUser } from '../components/authComponents';

const Index = () =>
{
    console.log('index');
    const [user, setUser] = useState();
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchUser = async () => {
            try {
                setLoading(true);
                const userData = await handleGetCurrentUser();
                setUser(userData);
            } catch (error) {
                console.error('Error fetching user:', error)
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
        console.log('no user', user);
        return <Redirect href={{ pathname: '/(auth)' }} />;
    }
    console.log('user found');
    return <Redirect href={{ pathname: '/(tabs)' }} />;
};

export default Index;