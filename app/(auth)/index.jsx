import { Redirect } from 'expo-router';

const Index = () =>
{
    return (
        <Redirect href={{ pathname: '/signIn' }} />
    );
};

export default Index;