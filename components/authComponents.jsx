import { TouchableOpacity, Image, Text, Alert } from 'react-native';
import { AuthStyles } from '../constants/styles';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { router } from 'expo-router';
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
    deleteUser,
    updateUserAttribute,
    updateUserAttributes,
    confirmUserAttribute,
} from 'aws-amplify/auth';

// Sign Up
// ---------------------------------------------------------------------
const handleSignUp = async ({name, email, password, confPassword, phoneNumber}) =>
{
    if (password !== confPassword)
    {
        Alert.alert(
            "Error",
            "Passwords do not match",
            [
                { text: "Ok" }
            ]
        );
        return;
    }
    const phoneNumberCheck = phoneNumber.replace(/\D/g, '');
    if (phoneNumberCheck.length !== 10)
    {
        Alert.alert(
            "Error",
            "Invalid phone number",
            [
                { text: "Ok" }
            ]
        );
        return;
    }
    try {
        const { nextStep } = await signUp({
            username: email,
            password,
            options: {
                userAttributes: {
                    name,
                    email,
                    phone_number: `+1${phoneNumberCheck}`
                },
                autoSignIn: true
            }
        });

        if (nextStep.signUpStep === 'CONFIRM_SIGN_UP') {
            router.push({
                pathname: '/signUpConfirm',
                params: {username: email}
            });
        }
    } catch (error) {
        console.log('error signing up:', error);
        Alert.alert(
            'Error',
            error.message,
            [
                { text: 'Ok'}
            ]
        )
    }
};

const handleSignUpConfirm = async ({username, confirmationCode}) =>
{
    try {
        const { nextStep } = await confirmSignUp({
            username,
            confirmationCode
        });

        if (nextStep.signUpStep === 'COMPLETE_AUTO_SIGN_IN') {
            handleAutoSignIn({username});
            Alert.alert(
                "Success",
                "Sign up successful!",
                [
                    { text: "Ok" }
                ]
            );
        }
        else if(nextStep.signUpStep === 'DONE') {
            router.replace('(auth)');
        }
        else {
            console.log('error, could not auto sign in');
            router.replace('(auth)');
        }
    } catch (error) {
        console.log('error confirming sign up', error);
        Alert.alert(
            "Error",
            error.message,
            [
                { text: "Ok" }
            ]
        );
    }
};

const handleResendSignUpCode = async ({username}) =>
{
    try {
        const { destination, deliveryMedium } = await resendSignUpCode({
            username
        });
        Alert.alert(
            "Success",
            `Code sent to ${destination} via ${deliveryMedium}`,
            [
                { text: "Ok" }
            ]
        );
        return;
    } catch (error) {
        console.log('error resending sign up code', error);
        Alert.alert(
            'Error',
            error.message,
            [
                { text: "Ok" }
            ]
        );
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
    try {
        const { isSignedIn, nextStep } = await signIn({ username, password });
        signInConfirm({username, isSignedIn, nextStep});
    } catch (error) {
        console.log('error signing in', error);
        Alert.alert(
            'Error',
            error.message,
            [
                { text: 'Ok'}
            ]
        );
    }
};

const signInConfirm = ({username, isSignedIn, nextStep}) =>
{
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
    console.log('signing in with redirect...');
    try {
        await signInWithRedirect({ provider: providerName });
        console.log('signed in!');
    } catch (error) {
        console.log('error signing in with redirect', error);
        Alert.alert(
            'Error',
            error.message,
            [
                { text: 'Ok'}
            ]
        );
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
    } catch (error) {
        console.log('error signing out', error);
        Alert.alert(
            'Error',
            error.message,
            [
                { text: 'Ok'}
            ]
        );
    }
};

const clearLocalStorage = async () =>
{
    try {
        await AsyncStorage.clear();
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
        Alert.alert(
            "Verification",
            "Check your email for your Verification code",
            [
                { text: 'Ok'}
            ]
        );
        handleResetPasswordNextSteps(output, {username});
    } catch (error) {
        console.log('error resetting password', error);
        Alert.alert(
            'Error',
            error.message,
            [
                { text: 'Ok'}
            ]
        );
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
            Alert.alert(
                "Success",
                "Password reset successful!",
                [
                    { text: 'Ok'}
                ]
            );
            break;
    }
};

const handleConfirmResetPassword = async ({username, confirmationCode, newPassword, confNewPassword}) =>
{
    if (newPassword !== confNewPassword)
    {
        Alert.alert(
            "Error",
            "Passwords do not match",
            [
                { text: 'Ok'}
            ]
        );
        return;
    }

    try {
        await confirmResetPassword({username, confirmationCode, newPassword});
        Alert.alert(
            "Success",
            "Password reset successful!",
            [
                { text: 'Ok'}
            ]
        );
        router.replace('(auth)');
    } catch (error) {
        console.log(error);
        Alert.alert(
            "Error",
            error.message,
            [
                { text: 'Ok'}
            ]
        );
    }
};

// Update Password
// --------------------------------------------------------------
const handleUpdatePassword = async ({oldPassword, newPassword, confNewPassword}) =>
{
    if (newPassword !== confNewPassword)
    {
        Alert.alert(
            "Error",
            "Passwords do not match",
            [
                { text: 'Ok'}
            ]
        );
        return;
    }

    try {
        await updatePassword({oldPassword, newPassword});
        Alert.alert(
            "Success",
            "Password updated successfully!",
            [
                { text: 'Ok'}
            ]
        );
        router.replace('(profile)');
    } catch (error) {
        console.log('error updating password', error);
        Alert.alert(
            "Error",
            error.message,
            [
                { text: 'Ok'}
            ]
        );
    }
};

// Delete User
// --------------------------------------------------------------
const handleDeleteUser = async ({email, inputEmail}) =>
{
    if (email.toLowerCase() !== inputEmail.toLowerCase())
    {
        Alert.alert(
            "Error",
            "Email is incorrect",
            [
                { text: 'Ok'}
            ]
        );
        console.log('email is wrong');
        router.replace('(tabs');
        return;
    }
    try {
        await deleteUser();
        Alert.alert(
            "Success",
            "User deleted successfully!",
            [
                { text: 'Ok'}
            ]
        );
        router.replace('(auth)');
    } catch (error) {
        console.log('error deleting user', error);
        Alert.alert(
            "Error",
            error.message,
            [
                { text: 'Ok'}
            ]
        );
    }
};

// Get User
// -----------------------------------------------------
const handleGetCurrentUser = async () =>
{
    try {
        const { tokens } = await fetchAuthSession();
        return tokens;
    } catch (error) {
        console.log('no user signed in');
        // this means there is currently no user signed in
    }
};

// update attributes
// ------------------------------------------------------
const handleUpdatePhone = async (phoneNumber) =>
{
    const phoneNumberCheck = phoneNumber.replace(/\D/g, '');

    if (phoneNumberCheck.length !== 10)
    {
        Alert.alert(
            "Error",
            "Invalid phone number",
            [
                { text: "Ok" }
            ]
        );
        return;
    }
    try {
        const output = await updateUserAttribute({
            userAttribute: {
                attributeKey: 'phone_number',
                value: `+1${phoneNumberCheck}`
            }
        });

        handleUpdateAttributesNextSteps(output.nextStep.updateAttributeStep);
    } catch (error) {
        Alert.alert(
            "Error",
            error.message,
            [
                { text: 'Ok'}
            ]
        )
    }
};

const handleUpdateAttributes = async (updatedEmail, updatedName, updatedPhone) =>
{
    const phoneNumberCheck = updatedPhone.replace(/\D/g, '');
    if (phoneNumberCheck.length !== 10)
    {
        Alert.alert(
            "Error",
            "Invalid phone number",
            [
                { text: "Ok" }
            ]
        );
        return;
    }
    try {
        const attributes = await updateUserAttributes({
            userAttributes: {
                email: updatedEmail,
                name: updatedName,
                phone_number: `+1${phoneNumberCheck}`
            },
        });
        handleUpdateAttributesNextSteps(attributes.email.nextStep.updateAttributeStep);
    } catch (error) {
        Alert.alert(
            "Error",
            error.message,
            [
                { text: 'Ok'}
            ]
        );
    };
};

const handleUpdateAttributesNextSteps = (nextStep) =>
{
    if (nextStep === 'DONE') {
        Alert.alert(
            "Success",
            "Attribute updated successfully!",
            [
                { text: 'Ok'}
            ]
        );
        router.replace('(tabs)');
    }
    else if (nextStep === 'CONFIRM_ATTRIBUTE_WITH_CODE') {
        router.push('/confirmAttribute');
    }
};

const handleConfirmUserAttribute = async ({ userAttributeKey, confirmationCode }) =>
{
    try {
        await confirmUserAttribute({ userAttributeKey, confirmationCode });
        router.replace('(tabs)');
        Alert.alert(
            "Success",
            "Email confirmed!",
            [
                { text: 'Ok'}
            ]
        );
    } catch (error) {
        console.log(error);
        Alert.alert(
            "Error",
            error.message,
            [
                { text: 'Ok'}
            ]
        );
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
    AmazonSignInButton,
    handleUpdatePhone,
    handleUpdateAttributes,
    handleConfirmUserAttribute
};