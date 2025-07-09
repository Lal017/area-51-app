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
import { FontAwesome } from '@expo/vector-icons';
import { handleDeleteStorage } from './components';
import { handleDeleteAllAppointments, handleDeleteAllTowRequests } from './scheduleComponents';
import { handleDeleteAllVehicles } from './vehicleComponents';
import { handleDeleteUser } from './notifComponents';

// Sign Up
// ---------------------------------------------------------------------
const handleSignUp = async (given_name, family_name, email, password, phoneNumber) =>
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
        const { nextStep } = await signUp({
            username: email,
            password,
            options: {
                userAttributes: {
                    name: `${given_name} ${family_name}`,
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
            Alert.alert(
                'Verification',
                'Check your email for your verification code',
                [
                    { text: 'Ok' }
                ]
            );
        }
    } catch (error) {
        console.log('error signing up:', error);
        const contains = error.message.includes('account already exists');
        Alert.alert(
            'Error',
            contains ? 'An account already exists with this email' : error.message,
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
                "Account Created",
                "Sign up successful!",
                [
                    { text: "Ok" }
                ]
            );
        }
        else if(nextStep.signUpStep === 'DONE') {
            router.replace('(auth)');
            Alert.alert(
                "Account Created",
                "Sign up successful!",
                [
                    { text: "Ok" }
                ]
            );
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
        await resendSignUpCode({
            username
        });
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

const signInConfirm = async ({username, isSignedIn, nextStep}) =>
{
    if (isSignedIn && nextStep.signInStep === 'DONE') {
        await handleRedirect();
    }
    else if (nextStep.signInStep === 'CONFIRM_SIGN_UP') {
        handleResendSignUpCode({username});
        router.push({
            pathname: '/signUpConfirm',
            params: {username}
        });
        Alert.alert(
            'Verification',
            'Check your email for your verification code',
            [
                { text: 'Ok' }
            ]
        );
    }
};

const handleSignInWithRedirect = async ({providerName}) =>
{
    try {
        await signInWithRedirect({ provider: providerName });
    } catch (error) {
        console.log('error signing in with redirect', error);
        Alert.alert(
            `Error signing in with ${providerName}`,
            'Please try again',
            [
                { text: 'Ok'}
            ]
        );
        router.replace('(auth)');
    }
};

// Google and amazon sign in buttons
// ---------------------------------------------------
const GoogleSignInButton = ({text}) =>
{
    return(
        <TouchableOpacity
            onPress={() => handleSignInWithRedirect({providerName: 'Google'})}
            style={AuthStyles.providerSignIn}
        >
            <Image
                source={require('../assets/images/google-icon.png')}
                style={AuthStyles.signInImg}
            />
            <Text style={{fontFamily: 'Roboto-Regular', fontSize: 17}}>{text}</Text>
        </TouchableOpacity>
    );
};

const AmazonSignInButton = ({text}) =>
{
    return(
        <TouchableOpacity
            onPress={() => handleSignInWithRedirect({providerName: 'Amazon'})}
            style={[AuthStyles.providerSignIn, {backgroundColor: '#37475A'}]}
        >
            <FontAwesome name='amazon' size={24} color='white' />
            <Text style={{fontFamily: 'Roboto-Regular', color: 'white', fontSize: 17}}>{text}</Text>
        </TouchableOpacity>
    );
};

// Sign Out
// --------------------------------------------------------
const handleSignOut = async () =>
{
    try {
        await signOut({global: true });
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
        handleResetPasswordNextSteps(output, {username});
    } catch (error) {
        console.log('error resetting password', error);
        Alert.alert(
            'Error',
            error.name === 'UserNotFoundException' ? 'A user with this email does not exist' : error.name === 'InvalidParameterException' ? 'Please sign in with Google/Amazon' : error.message,
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
            router.push({
                pathname: '/resetPasswordConfirm',
                params: {username}
            });
            Alert.alert(
                "Verification",
                "Check your email for your Verification code",
                [
                    { text: 'Ok'}
                ]
            );
            break;
        case 'DONE':
            Alert.alert(
                'Password Reset',
                "Your password has been reset",
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
            "Password Reset",
            "Your password has been reset",
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
            "Password Reset",
            "Your password has been reset",
            [
                { text: 'Ok'}
            ]
        );
        await handleRedirect();
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
const handleDeleteAccount = async (client, userId, identityId, email, inputEmail) =>
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
        await handleRedirect();
        return;
    }

    try {
        await handleDeleteAllTowRequests(client, userId);
        await handleDeleteAllAppointments(client, userId);
        await handleDeleteAllVehicles(client, userId);
        await handleDeleteStorage(identityId);
        await handleDeleteUser(client, userId);
        await deleteUser();
        await clearLocalStorage();
        Alert.alert(
            "Deleted",
            "User has been deleted",
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
        const { tokens } = await fetchAuthSession({ forceRefresh: true });
        return tokens;
    } catch (error) {
        console.log('no user signed in');
        // this means there is currently no user signed in
    }
};

// update attributes
// ------------------------------------------------------
const handleUpdatePhone = async (phoneNumber, setPhoneNumber) =>
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

        setPhoneNumber(`+1${phoneNumberCheck}`);
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

const handleUpdateAttributes = async (updatedEmail, updatedFirstName, updatedLastName, updatedPhone, setFirstName, setLastName, setPhoneNumber) =>
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
                name: `${updatedFirstName} ${updatedLastName}`,
                phone_number: `+1${phoneNumberCheck}`
            },
        });

        setFirstName(updatedFirstName);
        setLastName(updatedLastName);
        setPhoneNumber(`+1${phoneNumberCheck}`);
        handleUpdateAttributesNextSteps(attributes.email.nextStep.updateAttributeStep, updatedEmail);
    } catch (error) {
        Alert.alert(
            'Error',
            'Could not update attributes',
            [
                { text: 'Ok'}
            ]
        );
    };
};

const handleUpdateAttributesNextSteps = (nextStep, email) =>
{
    if (nextStep === 'DONE') {
        Alert.alert(
            "Updated",
            "Account attributes have been updated",
            [
                { text: 'Ok'}
            ]
        );
        handleRedirect();
    }
    else if (nextStep === 'CONFIRM_ATTRIBUTE_WITH_CODE') {
        Alert.alert(
            'Verification',
            'Check your email for your verification code',
            [
                { text: 'Ok'}
            ]
        );
        router.push({
            pathname: '/confirmAttribute',
            params: { email: email }
        });
    }
};

const handleConfirmUserAttribute = async (userAttributeKey, confirmationCode, email, setEmail) =>
{
    try {
        await confirmUserAttribute({ userAttributeKey, confirmationCode });
        setEmail(email);
        await handleRedirect();
        Alert.alert(
            "Confirmed",
            "Email has been confirmed!",
            [
                { text: 'Ok'}
            ]
        );
    } catch (error) {
        console.log(error);
        Alert.alert(
            "Error Confirming attribute",
            error.message,
            [
                { text: 'Ok'}
            ]
        );
    }
};

const handleRedirect = async () =>
{
    try {
        const { tokens } = await fetchAuthSession();
        if (tokens?.accessToken.payload["cognito:groups"]?.includes("Admins")) {
            router.replace('(admin)');
        } else {
            router.replace('(tabs)');
        }
    } catch (error) {
        console.log(error);
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
    handleDeleteAccount,
    GoogleSignInButton,
    AmazonSignInButton,
    handleUpdatePhone,
    handleUpdateAttributes,
    handleConfirmUserAttribute
};