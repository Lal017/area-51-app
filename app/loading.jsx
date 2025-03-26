import { View, ActivityIndicator } from 'react-native';
import { Hub } from 'aws-amplify/utils';
import { useEffect } from 'react';
import { router } from 'expo-router';

const Loading = () => {

    useEffect(() => {
        const listener = Hub.listen('auth', (data) => {
            const { payload } = data;
            
            // Handle authentication events
            switch (payload.event) {
                case 'signedIn':
                    // Redirect to home screen or dashboard after successful sign in
                    if (router.canGoBack()) { router.dismiss(); }
                    router.replace('(tabs)');
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

        return listener;
    }, []);

    return (
        <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
            <ActivityIndicator size="large" color="#0000ff" />
        </View>
    );
}

export default Loading;