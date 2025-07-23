import AsyncStorage from '@react-native-async-storage/async-storage';
import { handleDeleteStorage, handleDeleteUser } from './userComponents';
import { handleDeleteAllAppointments } from './appointmentComponents'
import { handleDeleteAllTowRequests } from './towComponents';
import { handleDeleteAllVehicles } from './vehicleComponents';
import { AuthStyles } from '../constants/styles';
import { TouchableOpacity, Image, Text, Alert } from 'react-native';
import { FontAwesome } from '@expo/vector-icons';
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
        console.error('ERROR, could not sign up:', error);
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

// used to confirm signing up with confirmation code
const handleSignUpConfirm = async (navigate, username, confirmationCode) =>
{
    try {
        const { nextStep } = await confirmSignUp({
            username,
            confirmationCode
        });

        if (nextStep.signUpStep === 'COMPLETE_AUTO_SIGN_IN') {
            handleAutoSignIn(username);
            Alert.alert(
                "Account Created",
                "Sign up successful!",
                [
                    { text: "Ok" }
                ]
            );
        }
        else if(nextStep.signUpStep === 'DONE') {
            navigate.reset({
                index: 0,
                routes: [{ name: '(auth)' }]
            });
            Alert.alert(
                "Account Created",
                "Sign up successful!",
                [
                    { text: "Ok" }
                ]
            );
        }
        else {
            console.error('ERROR, could not auto sign in');
            navigate.reset({
                index: 0,
                routes: [{ name: '(auth)' }]
            });
        }
    } catch (error) {
        console.error('ERROR, could not confirm sign up', error);
        Alert.alert(
            "Error",
            error.message,
            [
                { text: "Ok" }
            ]
        );
    }
};

// used to resend sign up code for confirmation
const handleResendSignUpCode = async (username) =>
{
    try {
        await resendSignUpCode({ username });
        return;
    } catch (error) {
        console.error('ERROR, could not resend sign up code', error);
        Alert.alert(
            'Error',
            error.message,
            [
                { text: "Ok" }
            ]
        );
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
        signInConfirm(username, nextStep);
    } catch (error) {
        console.error('ERROR, could not sign in', error);
        Alert.alert(
            'Error',
            error.message,
            [
                { text: 'Ok'}
            ]
        );
    }
};

// used to check if user has confirmed sign up before signing them in
const signInConfirm = async (username, nextStep) =>
{
    if (nextStep.signInStep === 'CONFIRM_SIGN_UP') {
        handleResendSignUpCode(username);
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

// auto sign in after confirming sign up
const handleAutoSignIn = async (navigate, username) =>
{
    try {
        const signInOutput = await autoSignIn();
        signInConfirm(navigate, username, signInOutput.isSignedIn, signInOutput.nextStep)
    } catch (error) {
        console.error('ERROR, could not auto sign in', error);
        navigate.reset({
            index: 0,
            routes: [{ name: '(auth)' }]
        });
    }
};

// used to sign in with an external provider (Google, Amazon)
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

// Amazon sign in button component
const AmazonSignInButton = ({text, navigate}) =>
{
    return(
        <TouchableOpacity
            onPress={() => handleSignInWithRedirect('Amazon', navigate)}
            style={[AuthStyles.providerSignIn, {backgroundColor: '#37475A'}]}
        >
            <FontAwesome name='amazon' size={24} color='white' />
            <Text style={{fontFamily: 'Roboto-Regular', color: 'white', fontSize: 17}}>{text}</Text>
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
        Alert.alert(
            'Error',
            error.name === 'UserNotFoundException' ? 'A user with this email does not exist' : error.name === 'InvalidParameterException' ? 'Please sign in with Google/Amazon' : error.message,
            [
                { text: 'Ok'}
            ]
        );
    }
};

// used to evaluate what step of the process the user is on
const handleResetPasswordNextSteps = (nextStep, username) =>
{
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

// used to confirm the password reset
const handleConfirmResetPassword = async (navigate, username, confirmationCode, newPassword, confNewPassword) =>
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
        navigate.reset({
            index: 0,
            routes: [{ name: '(auth)'}]
        });
    } catch (error) {
        console.error(error);
        Alert.alert(
            "Error",
            error.message,
            [
                { text: 'Ok'}
            ]
        );
    }
};

// used to update the users password while authenticated
const handleUpdatePassword = async (navigate, oldPassword, newPassword, confNewPassword) =>
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
        await handleRedirect(navigate);
    } catch (error) {
        console.error('ERROR, could not update password', error);
        Alert.alert(
            "Error",
            error.message,
            [
                { text: 'Ok'}
            ]
        );
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
        Alert.alert(
            "Error",
            "Email is incorrect",
            [
                { text: 'Ok'}
            ]
        );
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
    } catch (error) {
        console.error('ERROR, could not delete user', error);
        Alert.alert(
            "Error",
            error.message,
            [
                { text: 'Ok'}
            ]
        );
    }
};


// ------------------------------------------------------
//                   UPDATE ATTRIBUTES
// ------------------------------------------------------

// used to update a users attributes
const handleUpdateAttributes = async (navigate, isMissingAttr, updatedEmail, updatedFirstName, updatedLastName, updatedPhone, setFirstName, setLastName, setPhoneNumber) =>
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
        handleUpdateAttributesNextSteps(navigate, isMissingAttr, attributes.email.nextStep.updateAttributeStep, updatedEmail);
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

// used to determine if an attribute that needs to be confirmed was updated
const handleUpdateAttributesNextSteps = (navigate, isMissingAttr, nextStep, email) =>
{
    if (nextStep === 'DONE') {
        Alert.alert(
            "Updated",
            "Account attributes have been updated",
            [
                { text: 'Ok'}
            ]
        );
        if (!isMissingAttr) handleRedirect(navigate);
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
    handleUpdateAttributes,
    handleConfirmUserAttribute
};