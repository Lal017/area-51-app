import { Redirect } from "expo-router";

const catchAll = () =>
{
    return <Redirect href='/' />;
};

export default catchAll;