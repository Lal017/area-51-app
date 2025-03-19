import { Redirect } from 'expo-router';

const Index = () =>
{
    console.log('auth index');
    return (
        <Redirect href={{ pathname: '/signIn' }} />
    );
};

export default Index;