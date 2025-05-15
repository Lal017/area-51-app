import { Redirect } from "expo-router";

const catchAll = () =>
{
    console.log('caught missing, redirecting...');
    return <Redirect href='/' />;
};

export default catchAll;