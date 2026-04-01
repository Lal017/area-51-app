import AsyncStorage from '@react-native-async-storage/async-storage';
import { handleDeleteStorage, handleDeleteUser } from './userService';
import { handleDeleteAllAppointments } from './appointmentService'
import { handleDeleteAllTowRequests } from './towService';
import { handleDeleteAllVehicles } from './vehicleService';
import { getErrorMessage } from '../utils/utils';
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
    if (!given_name) throw new Error('Missing first name');
    if (!family_name) throw new Error('Missing last name');
    if (!email) throw new Error('Missing email');
    if (!phoneNumber) throw new Error('Missing phone number');

    const phoneNumberCheck = phoneNumber.replace(/\D/g, '');
    if (phoneNumberCheck.length !== 10) throw new Error('The number you entered is not a valid phone number');
    
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
        console.error(error);
        throw new Error(getErrorMessage(error));
    }
};

// used to confirm signing up with confirmation code
const handleSignUpConfirm = async (username, confirmationCode, password) =>
{
    if (!confirmationCode) throw new Error('Missing confirmation code');
    try {
        const { nextStep } = await confirmSignUp({
            username,
            confirmationCode
        });

        if (nextStep.signUpStep === 'COMPLETE_AUTO_SIGN_IN') {
            await handleAutoSignIn(username);
        } else if (nextStep.signUpStep === 'DONE') {
            await handleSignIn(username, password);
        } else {
            console.error('ERROR, could not auto sign in');
            router.replace('(auth)');
        }
    } catch (error) {
        throw new Error(getErrorMessage(error));
    }
};

// used to resend sign up code for confirmation
const handleResendSignUpCode = async (username) =>
{
    try {
        await resendSignUpCode({ username });
    } catch (error) {
        throw new Error(getErrorMessage(error));
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
        throw new Error(getErrorMessage(error));
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
const handleAutoSignIn = async (username) =>
{
    try {
        const signInOutput = await autoSignIn();
        await signInConfirm(username, signInOutput.nextStep)
    } catch (error) {
        console.error('ERROR, could not auto sign in', error);
        router.replace('(auth)');
        throw new Error(getErrorMessage(error));
    }
};

// used to sign in with an external provider Google
const handleSignInWithRedirect = async (providerName) =>
{
    try {
        await signInWithRedirect({ provider: providerName });
    } catch (error) {
        console.error('ERROR, could not sign in with redirect:', error);
        router.replace('(auth)');
        throw new Error(getErrorMessage(error));
    }
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
        throw new Error(getErrorMessage(error));
    }
};

// used to clear local storage for app from device
const clearLocalStorage = async () =>
{
    try {
        await AsyncStorage.clear();
    } catch (error) {
        throw new Error(getErrorMessage(error));
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
        throw new Error(getErrorMessage(error));
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
const handleConfirmResetPassword = async (username, confirmationCode, newPassword, confNewPassword) =>
{
    if (newPassword !== confNewPassword) return "Passwords do not match";

    try {
        await confirmResetPassword({username, confirmationCode, newPassword});
        // use react native toast to show confirmation of password reset
        router.replace('(auth)');
    } catch (error) {
        throw new Error(getErrorMessage(error));
    }
};


// --------------------------------------------------------
//                    UPDATE PASSWORD
// --------------------------------------------------------

const handleUpdatePassword = async (oldPassword, newPassword, confNewPassword) =>
{
    if (newPassword !== confNewPassword) return 'Passwords do not match';
    try {
        await updatePassword({ oldPassword, newPassword });
        // use react native toast to show confirmation of password updated
        await handleRedirect();
    } catch (error) {
        throw new Error(getErrorMessage(error));
    }
};


// --------------------------------------------------------
//                      DELETE USER
// --------------------------------------------------------

// used to delete the users account
const handleDeleteAccount = async (client, userId, identityId, email, inputEmail) =>
{
    if (email.toLowerCase() !== inputEmail.toLowerCase()) throw new Error('Email is incorrect');

    try {
        await handleDeleteAllTowRequests(client, userId);
        await handleDeleteAllAppointments(client, userId);
        await handleDeleteAllVehicles(client, userId);
        await handleDeleteStorage(identityId);
        await handleDeleteUser(client, userId);
        await deleteUser();
        await clearLocalStorage();

    } catch (error) {
        throw new Error(getErrorMessage(error));
    }
};


// ------------------------------------------------------
//                   UPDATE ATTRIBUTES
// ------------------------------------------------------

// used to update a users attributes
const handleUpdateAttributes = async (isMissingAttr, updatedEmail, updatedFirstName, updatedLastName, updatedPhone, setFirstName, setLastName, setPhoneNumber) =>
{
    if (!updatedFirstName) throw new Error('First name cannot be empty');
    if (!updatedLastName) throw new Error('Last name cannot be empty');
    if (!updatedEmail) throw new Error('Email cannot be empty');
    if (!updatedPhone) throw new Error('Phone number cannot be empty');
    const phoneNumberCheck = updatedPhone.replace(/\D/g, '');
    if (phoneNumberCheck.length !== 10) throw new Error('The number you entered is not a valid phone number');
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
        await handleUpdateAttributesNextSteps(isMissingAttr, attributes.email.nextStep.updateAttributeStep, updatedEmail);
    } catch (error) {
        throw new Error(getErrorMessage(error));
    };
};

// used to determine if an attribute that needs to be confirmed was updated
const handleUpdateAttributesNextSteps = async (isMissingAttr, nextStep, email) =>
{
    if (nextStep === 'DONE') {
        // use react native toast to confirm that attributes have been updated
        if (!isMissingAttr) {
            try {
                await handleRedirect();
            } catch (error) {
                throw error;
            }
        }
    }
    else if (nextStep === 'CONFIRM_ATTRIBUTE_WITH_CODE') {
        router.push({
            pathname: '/confirmAttribute',
            params: { email: email }
        });
    }
};

// used to confirm email if it was updated
const handleConfirmUserAttribute = async (userAttributeKey, confirmationCode, email, setEmail) =>
{
    try {
        await confirmUserAttribute({ userAttributeKey, confirmationCode });
        setEmail(email);
        await handleRedirect();
        // use react native toast to show that email has been confirmed
    } catch (error) {
        throw new Error(getErrorMessage(error));
    }
};


// ----------------------------------------------------
//                      OTHER
// ----------------------------------------------------

// used to redirect user based on what group they belong too
const handleRedirect = async () =>
{
    try {
        const { tokens } = await fetchAuthSession();
        if (tokens?.accessToken.payload["cognito:groups"]?.includes("Admins"))
            router.replace('(admin)');
        else if (tokens?.accessToken.payload["cognito:groups"]?.includes("TowDrivers"))
            router.replace('(tow)');
        else
            router.replace('(profile)');
    } catch (error) {
        throw new Error(getErrorMessage(error));
    }
};

// used to get the current users auth credentials
const handleGetCurrentUser = async () =>
{
    try {
        const { tokens } = await fetchAuthSession({ forceRefresh: true });
        return tokens;
    } catch (error) {
        // this means there is currently no user signed in
        return null;
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
    handleUpdateAttributes,
    handleConfirmUserAttribute
};