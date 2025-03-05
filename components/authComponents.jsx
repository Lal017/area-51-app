import { signUp, confirmSignUp, autoSignIn, signIn, signOut } from 'aws-amplify/auth';

// handlers 
const handleSignUp = async ({email, password, name}) =>
{
    try {
        const { isSignUpComplete, userId, nextStep } = await signUp({
            name,
            email,
            password,
            options: {
                userAttributes: {
                    email,
                    name,
                },
                autoSignIn: true
            }
        });

        console.log(userId);
    } catch (error) {
        console.log('error signing up:', error);
    }
};

const handleSignUpConfirm = async ({email, confirmationCode}) =>
{
    try {
        const { isSignUpComplete, nextStep } = await confirmSignUp({
            email,
            confirmationCode
        });
    } catch (error) {
        console.log('error confirming sign up', error);
    }
};

const handleAutoSignIn = async () =>
{
    try {
        const signInOutput = await autoSignIn();
    } catch (error) {
        console.log('error auto signing in', error);
    }
};

const handleSignIn = async ({email, password}) =>
{
    try {
        const { isSignedIn, nextStep } = await signIn({ email, password });
    } catch (error) {
        console.log('error signing in', error);
    }
};

const handleSignOut = async () =>
{
    try {
        await signOut({ });
    } catch (error) {
        console.log('error signing out', error);
    }
};

export { handleSignUp, handleSignUpConfirm, handleAutoSignIn, handleSignIn, handleSignOut };