import { TouchableOpacity, Image, Text } from 'react-native';
import { AuthStyles } from '../constants/styles';
import AsyncStorage from '@react-native-async-storage/async-storage';
import {
    signUp,
    confirmSignUp,
    autoSignIn,
    signIn,
    signOut,
    resendSignUpCode,
    fetchAuthSession,
    resetPassword,
    confirmResetPassword,
    updatePassword,
    signInWithRedirect,
    deleteUser
} from 'aws-amplify/auth';
import { router } from 'expo-router';

// Sign Up
// ---------------------------------------------------------------------
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
        if (nextStep.signUpStep === 'COMPLETE_AUTO_SIGN_IN') {
            handleAutoSignIn({username});
        }
        else if(nextStep.signUpStep === 'DONE') {
            console.log('Sign-up complete')
            router.replace('(auth)');
        }
        else {
            console.log('error, could not auto sign in');
            router.replace('(auth)');
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

// Sign In
// -----------------------------------------------------------------------------------------
const handleAutoSignIn = async ({username}) =>
{
    try {
        const signInOutput = await autoSignIn();
        signInConfirm({username, isSignedIn: signInOutput.isSignedIn, nextStep: signInOutput.nextStep})
    } catch (error) {
        console.log('error auto signing in', error);
        router.replace('(auth)');
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
    console.log(username, isSignedIn, nextStep);
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
};

const handleSignInWithRedirect = async ({providerName}) =>
{
    try {
        await signInWithRedirect({ provider: providerName });
        console.log('signed in with redirect');
    } catch (error) {
        console.log('error signing in with redirect', error);
    }
};

// Google and amazon sign in buttons
// ---------------------------------------------------
const GoogleSignInButton = () =>
    {
        return(
            <TouchableOpacity
                onPress={() => handleSignInWithRedirect({providerName: 'Google'})}
                style={AuthStyles.googleSignIn}
            >
                <Image
                    source={require('../assets/images/google-icon.png')}
                    style={AuthStyles.signInImg}
                />
                <Text style={AuthStyles.signInText}>Sign in</Text>
            </TouchableOpacity>
        );
    };
    
    const AmazonSignInButton = () =>
    {
        return(
            <TouchableOpacity
                onPress={() => handleSignInWithRedirect({providerName: 'Amazon'})}
                style={AuthStyles.amazonSignIn}
            >
                <Image
                    source={require('../assets/images/amazon-icon.png')}
                    style={AuthStyles.signInImg}
                />
                <Text style={AuthStyles.signInText}>Sign in</Text>
            </TouchableOpacity>
        );
    };

// Sign Out
// --------------------------------------------------------
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
};

// Reset Password
// -------------------------------------------------------------
const handleResetPassword = async ({username}) =>
{
    try {
        const output = await resetPassword({ username });
        handleResetPasswordNextSteps(output, {username});
    } catch (error) {
        console.log('error resetting password', error);
    }
};

const handleResetPasswordNextSteps = (output, {username}) =>
{
    const { nextStep } = output;
    switch (nextStep.resetPasswordStep) {
        case 'CONFIRM_RESET_PASSWORD_WITH_CODE':
            const codeDeliveryDetails = nextStep.codeDeliveryDetails;
            console.log(`Confirmation code was sent to ${codeDeliveryDetails.deliveryMedium}`);
            router.push({
                pathname: '/resetPasswordConfirm',
                params: {username}
            });
            break;
        case 'DONE':
            console.log('Password rest succesful');
            break;
    }
};

const handleConfirmResetPassword = async ({username, confirmationCode, newPassword, confNewPassword}) =>
{
    if (newPassword !== confNewPassword)
    {
        console.log('passwords do not match');
        return;
    }

    try {
        await confirmResetPassword({username, confirmationCode, newPassword});
        console.log('password reset successful');
        router.replace('(auth)');
    } catch (error) {
        console.log(error);
    }
};

// Update Password
// --------------------------------------------------------------
const handleUpdatePassword = async ({oldPassword, newPassword, confNewPassword}) =>
{
    if (newPassword !== confNewPassword)
    {
        console.log('passwords do not match');
        return;
    }

    try {
        await updatePassword({oldPassword, newPassword});
        console.log('password updated successfully');
        router.replace('(profile)');
    } catch (error) {
        console.log('error updating password', error);
    }
};

// Delete User
// --------------------------------------------------------------
const handleDeleteUser = async () =>
{
    try {
        await deleteUser();
        console.log('user deleted successfully');
    } catch (error) {
        console.log('error deleting user', error);
    }
}

// Other
// -----------------------------------------------------
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

// Exports
// -------------------------------------------------------------
export {
    handleSignUp,
    handleSignUpConfirm,
    handleAutoSignIn,
    handleSignIn,
    handleSignInWithRedirect,
    handleSignOut,
    handleResendSignUpCode,
    handleGetCurrentUser,
    handleResetPassword,
    handleConfirmResetPassword,
    handleUpdatePassword,
    handleDeleteUser,
    GoogleSignInButton,
    AmazonSignInButton
};