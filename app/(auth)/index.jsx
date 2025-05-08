import { Redirect } from 'expo-router';

const Index = () =>
{
    return (
        <Redirect href={{ pathname: '/(auth)/signIn' }} />
    );
};

export default Index;