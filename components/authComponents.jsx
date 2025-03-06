import AsyncStorage from '@react-native-async-storage/async-storage';
import {
    signUp,
    confirmSignUp,
    autoSignIn,
    signIn,
    signOut,
    resendSignUpCode,
    fetchAuthSession,
} from 'aws-amplify/auth';
import { router } from 'expo-router';

// handlers 
const handleSignUp = async ({name, email, password, confPassword}) =>
{
    if (password !== confPassword)
    {
        console.log('passwords do not match');
        return;
    }
    try {
        const { isSignUpComplete, userId, nextStep } = await signUp({
            username: email,
            password,
            options: {
                userAttributes: {
                    name,
                    email,
                },
                autoSignIn: true
            }
        });

        console.log(userId, isSignUpComplete, nextStep);

        if (nextStep.signUpStep === 'CONFIRM_SIGN_UP') {
            console.log('This worked');
            router.push({
                pathname: '/signUpConfirm',
                params: {username: email}
            });
        }
        else {
            console.log('This did not work');
        }
    } catch (error) {
        console.log('error signing up:', error);
    }
};

const handleSignUpConfirm = async ({username, confirmationCode}) =>
{
    try {
        const { isSignUpComplete, nextStep } = await confirmSignUp({
            username,
            confirmationCode
        });

        console.log(isSignUpComplete, nextStep);
        if (nextStep.signUpStep === 'COMPLETE_AUTO_SIGN_IN' || nextStep.signUpStep === 'DONE') {
            handleAutoSignIn({username});
        }
        else {
            console.log('error, could not auto sign in');
        }
    } catch (error) {
        console.log('error confirming sign up', error);
    }
};

const handleResendSignUpCode = async ({username}) =>
{
    try {
        const { destination, deliveryMedium, attributeName } = await resendSignUpCode({
            username
        });

        console.log(destination, deliveryMedium, attributeName);
        return;
    } catch (error) {
        console.log('error resending sign up code', error);
        if (error.name == 'UserNotFoundException') {
            console.log('user not found');
        }
        else if (error.name === 'LimitedExceededException') {
            console.log('too many attempts to resend code. Please try again later');
        }
    }
};

const handleAutoSignIn = async ({username}) =>
{
    try {
        const signInOutput = await autoSignIn();
        signInConfirm({username, isSignedIn: signInOutput.isSignedIn, nextStep: signInOutput.nextStep})
    } catch (error) {
        console.log('error auto signing in', error);
    }
};

const handleSignIn = async ({username, password}) =>
{
    console.log(username, password);
    try {
        const { isSignedIn, nextStep } = await signIn({ username, password });
        signInConfirm({username, isSignedIn, nextStep});
    } catch (error) {
        console.log('error signing in', error);
    }
};

const signInConfirm = ({username, isSignedIn, nextStep}) =>
{
    console.log(isSignedIn, nextStep);
    if (isSignedIn && nextStep.signInStep === 'DONE') {
        router.replace('(tabs)');
    }
    else if (nextStep.signInStep === 'CONFIRM_SIGN_UP') {
        handleResendSignUpCode({username});
        router.push({
            pathname: '/signUpConfirm',
            params: {username}
        });
    }
}

const handleSignOut = async () =>
{
    try {
        await signOut({global: true });
        clearLocalStorage();
        router.replace('(auth)');
        console.log('signed out');
    } catch (error) {
        console.log('error signing out', error);
    }
};

const clearLocalStorage = async () =>
{
    try {
        await AsyncStorage.clear();
        console.log('local storage cleared');
    } catch (error) {
        console.log('error clearing local storage', error);
    }
}

const handleGetCurrentUser = async () =>
{
    try {
        const { tokens } = await fetchAuthSession();
        console.log(tokens);
        return tokens;
    } catch (error) {
        console.log('error getting current user', error);
    }
};

export {
    handleSignUp,
    handleSignUpConfirm,
    handleAutoSignIn,
    handleSignIn,
    handleSignOut,
    handleResendSignUpCode,
    handleGetCurrentUser
};