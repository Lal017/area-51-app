import AsyncStorage from '@react-native-async-storage/async-storage';
import { handleDeleteStorage, handleDeleteUser } from './userComponents';
import { handleDeleteAllAppointments } from './appointmentComponents'
import { handleDeleteAllTowRequests } from './towComponents';
import { handleDeleteAllVehicles } from './vehicleComponents';
import { AuthStyles } from '../constants/styles';
import { TouchableOpacity, Image, Text, Alert } from 'react-native';
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
    updateUserAttributes,
    confirmUserAttribute,
} from 'aws-amplify/auth';


// --------------------------------------------
//                  SIGN UP
// --------------------------------------------

// used to handle signing up via cognito
const handleSignUp = async (given_name, family_name, email, password, phoneNumber) =>
{
    const phoneNumberCheck = phoneNumber.replace(/\D/g, '');
    if (phoneNumberCheck.length !== 10) return 'The number you entered is not a valid phone number';
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
        }
    } catch (error) {
        return getErrorMessage(error)
    }
};

// used to confirm signing up with confirmation code
const handleSignUpConfirm = async (navigate, username, confirmationCode, password) =>
{
    try {
        const { nextStep } = await confirmSignUp({
            username,
            confirmationCode
        });

        if (nextStep.signUpStep === 'COMPLETE_AUTO_SIGN_IN') {
            await handleAutoSignIn(navigate, username);
        } else if (nextStep.signUpStep === 'DONE') {
            await handleSignIn(username, password);
        } else {
            console.error('ERROR, could not auto sign in');
            navigate.reset({
                index: 0,
                routes: [{ name: '(auth)' }]
            });
        }
    } catch (error) {
        return getErrorMessage(error);
    }
};

// used to resend sign up code for confirmation
const handleResendSignUpCode = async (username) =>
{
    try {
        await resendSignUpCode({ username });
    } catch (error) {
        return getErrorMessage(error);
    }
};


// -----------------------------------------------
//                   SIGN IN
// -----------------------------------------------

// used to sign in via cognito
const handleSignIn = async (username, password) =>
{
    try {
        const { nextStep } = await signIn({ username, password });
        await signInConfirm(username, nextStep, password);
    } catch (error) {
        return getErrorMessage(error);
    }
};

// used to check if user has confirmed sign up before signing them in
const signInConfirm = async (username, nextStep, password) =>
{
    if (nextStep.signInStep === 'CONFIRM_SIGN_UP') {
        try {
            await handleResendSignUpCode(username);
            router.push({
                pathname: '/signUpConfirm',
                params: {username, password}
            });
        } catch (error) {
            throw error;
        }
    }
};

// auto sign in after confirming sign up
const handleAutoSignIn = async (navigate, username) =>
{
    try {
        const signInOutput = await autoSignIn();
        await signInConfirm(username, signInOutput.nextStep)
    } catch (error) {
        console.error('ERROR, could not auto sign in', error);
        navigate.reset({
            index: 0,
            routes: [{ name: '(auth)' }]
        });
    }
};

// used to sign in with an external provider Google
const handleSignInWithRedirect = async (providerName, navigate) =>
{
    try {
        await signInWithRedirect({ provider: providerName });
    } catch (error) {
        console.error('ERROR, could not sign in with redirect:', error);
        Alert.alert(
            `Error signing in with ${providerName}`,
            'Please try again',
            [
                { text: 'Ok'}
            ]
        );
        navigate.reset({
            index: 0,
            routes: [{ name: '(auth)'}]
        });
    }
};

// Google sign in button component
const GoogleSignInButton = ({text, navigate}) =>
{
    return(
        <TouchableOpacity
            onPress={() => handleSignInWithRedirect('Google', navigate)}
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


// -----------------------------------------------
//                    SIGN OUT
// -----------------------------------------------

// used to sign out of users account
const handleSignOut = async () =>
{
    try {
        await signOut({global: true });
    } catch (error) {
        console.error('ERROR, could not sign out', error);
        Alert.alert(
            'Error',
            error.message,
            [
                { text: 'Ok'}
            ]
        );
    }
};

// used to clear local storage for app from device
const clearLocalStorage = async () =>
{
    try {
        await AsyncStorage.clear();
    } catch (error) {
        console.error('ERROR, could not clear local storage', error);
    }
};


// -----------------------------------------------------
//                     RESET PASSWORD
// -----------------------------------------------------

// used to reset a users password while unauthenticated
const handleResetPassword = async (username) =>
{
    try {
        const { nextStep } = await resetPassword({ username });
        handleResetPasswordNextSteps(nextStep, username);
    } catch (error) {
        return getErrorMessage(error);
    }
};

// used to evaluate what step of the process the user is on
const handleResetPasswordNextSteps = (nextStep, username) =>
{
    if (nextStep.resetPasswordStep === 'CONFIRM_RESET_PASSWORD_WITH_CODE') {
        router.push({
            pathname: '/resetPasswordConfirm',
            params: {username}
        });
    }
};

// used to confirm the password reset
const handleConfirmResetPassword = async (navigate, username, confirmationCode, newPassword, confNewPassword) =>
{
    if (newPassword !== confNewPassword) return "Passwords do not match";

    try {
        await confirmResetPassword({username, confirmationCode, newPassword});
        Alert.alert(
            'Password Reset',
            'Your password has succesfully been reset!'
        );
        navigate.reset({
            index: 0,
            routes: [{ name: '(auth)'}]
        });
    } catch (error) {
        return getErrorMessage(error);
    }
};


// --------------------------------------------------------
//                    UPDATE PASSWORD
// --------------------------------------------------------

const handleUpdatePassword = async (navigate, oldPassword, newPassword, confNewPassword) =>
{
    if (newPassword !== confNewPassword) return 'Passwords do not match';
    try {
        await updatePassword({ oldPassword, newPassword });
        Alert.alert(
            'Password Updated',
            'Your password has been updated!'
        );
        await handleRedirect(navigate);
    } catch (error) {
        return getErrorMessage(error);
    }
};


// --------------------------------------------------------
//                      DELETE USER
// --------------------------------------------------------

// used to delete the users account
const handleDeleteAccount = async (client, userId, identityId, email, inputEmail) =>
{
    if (email.toLowerCase() !== inputEmail.toLowerCase())
    {
        return 'Email is incorrect';
    }

    try {
        await handleDeleteAllTowRequests(client, userId);
        await handleDeleteAllAppointments(client, userId);
        await handleDeleteAllVehicles(client, userId);
        await handleDeleteStorage(identityId);
        await handleDeleteUser(client, userId);
        await deleteUser();
        await clearLocalStorage();

    } catch (error) {
        console.error('ERROR, could not delete user', error);
        return getErrorMessage(error);
    }
};


// ------------------------------------------------------
//                   UPDATE ATTRIBUTES
// ------------------------------------------------------

// used to update a users attributes
const handleUpdateAttributes = async (navigate, isMissingAttr, updatedEmail, updatedFirstName, updatedLastName, updatedPhone, setFirstName, setLastName, setPhoneNumber) =>
{
    if (!updatedFirstName) return 'First name cannot be empty';
    if (!updatedLastName) return 'Last name cannot be empty';
    if (!updatedEmail) return 'Email cannot be empty';
    if (!updatedPhone) return 'Phone number cannot be empty';
    const phoneNumberCheck = updatedPhone.replace(/\D/g, '');
    if (phoneNumberCheck.length !== 10) return 'The number you entered is not a valid phone number';
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
        await handleUpdateAttributesNextSteps(navigate, isMissingAttr, attributes.email.nextStep.updateAttributeStep, updatedEmail);
    } catch (error) {
        return getErrorMessage(error);
    };
};

// used to determine if an attribute that needs to be confirmed was updated
const handleUpdateAttributesNextSteps = async (navigate, isMissingAttr, nextStep, email) =>
{
    if (nextStep === 'DONE') {
        Alert.alert(
            "Account Attributes",
            "Account attributes have been updated",
            [
                { text: 'Ok'}
            ]
        );
        if (!isMissingAttr) await handleRedirect(navigate);
    }
    else if (nextStep === 'CONFIRM_ATTRIBUTE_WITH_CODE') {
        router.push({
            pathname: '/confirmAttribute',
            params: { email: email }
        });
    }
};

// used to confirm email if it was updated
const handleConfirmUserAttribute = async (navigate, userAttributeKey, confirmationCode, email, setEmail) =>
{
    try {
        await confirmUserAttribute({ userAttributeKey, confirmationCode });
        setEmail(email);
        await handleRedirect(navigate);
        Alert.alert(
            "Confirmed",
            "Email has been confirmed!",
            [
                { text: 'Ok'}
            ]
        );
    } catch (error) {
        console.error(error);
        Alert.alert(
            "Error Confirming attribute",
            error.message,
            [
                { text: 'Ok'}
            ]
        );
    }
};


// ----------------------------------------------------
//                      OTHER
// ----------------------------------------------------

// used to redirect user based on what group they belong too
const handleRedirect = async (navigate) =>
{
    try {
        const { tokens } = await fetchAuthSession();
        if (tokens?.accessToken.payload["cognito:groups"]?.includes("Admins")) {
            navigate.reset({
                index: 0,
                routes: [{ name: '(admin)' }]
            });
        } else if (tokens?.accessToken.payload["cognito:groups"]?.includes("TowDrivers")) {
            navigate.reset({
                index: 0,
                routes: [{ name: '(tow)' }]
            });
        } else {
            navigate.reset({
                index: 0,
                routes: [{ name: '(profile)' }]
            });
        }
    } catch (error) {
        console.error('ERROR, could not redirect:', error);
    }
};

// used to get the current users auth credentials
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

// used to return a UI friendly string for an error message
const getErrorMessage = (error) =>
{
    console.log(error);
    switch(error?.name) {
        case 'UserNotFoundException':
            return 'A user with that email does not exist';
        case 'UserLambdaValidationException':
            return 'A user with that email already exists';
        case 'NotAuthorizedException':
            return 'The password you entered is incorrect, please try again';
        case 'CodeMismatchException':
            return 'The code you entered is incorrect, please try again';
        case 'EmptyConfirmResetPasswordNewPassword':
            return 'Please input a new password to continue';
        case 'EmptySignInUsername':
            return 'Please enter an email and password to sign in';
        case 'EmptySignInPassword':
            return 'Please enter a password to sign in';
        case 'EmptyConfirmSignUpCode':
            return 'Verification code must be entered to continue';
        case 'EmptyResetPasswordUsername':
            return 'Email is required to reset password';
        case 'EmptyConfirmResetPasswordConfirmationCode':
            return 'Verification code cannot be empty';
        case 'LimitExceededException':
            return 'Attempts exceeded, please try again later';
        case 'InvalidPasswordException':
            return 'Password does not meet the requirements, please try again';
        case 'InvalidParameterException':
            return 'Email has not been verified, please sign in to continue with verification';
        default:
            return 'Something went wrong, please try again later';
    }
};


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
    handleUpdateAttributes,
    handleConfirmUserAttribute
};