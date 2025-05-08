import { View, ActivityIndicator } from 'react-native';
import { Hub } from 'aws-amplify/utils';
import { useEffect } from 'react';
import { router } from 'expo-router';
import { handleGetCurrentUser } from '../components/authComponents';

const Loading = () => {

    useEffect(() => {
        const listener = Hub.listen('auth', async (data) => {
            const { payload } = data;
            
            // Handle authentication events
            switch (payload.event) {
                case 'signedIn':
                    // Redirect to home screen or dashboard after successful sign in
                    if (router.canGoBack()) { router.dismiss(); }
                    const user = await handleGetCurrentUser();
                    const isAdmin = user?.accessToken?.payload["cognito:groups"]?.includes('Admins');
                    if (isAdmin) { router.replace('(admin)'); }
                    else { router.replace('(tabs)'); }
                    break;
                case 'signedOut':
                    // Redirect to login screen after sign out
                    if (router.canGoBack()) { router.dismiss(); }
                    router.replace('(auth)');
                    break;
                case 'signedIn_failure':
                    // Handle failed sign in
                    if (router.canGoBack()) { router.dismiss(); }
                    router.replace('(auth)');
                    break;
            }
        });

        return listener; // Clean up the listener on unmount
    }, []);

    return (
        <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
            <ActivityIndicator size="large" color="#0000ff" />
        </View>
    );
}

export default Loading;