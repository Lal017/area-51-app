import { StyleSheet } from "react-native";
import Colors from "./colors";

const Styles = StyleSheet.create({
// All page styles
    HeaderContainer: {
        backgroundColor: Colors.background,
        flexDirection: 'row',
        height: 125,
        justifyContent: 'flex-start',
        alignItems: 'center',
    },
    LogoImg: {
        width: 100,
        height: 100,
        marginLeft: 25,
    },
    tabBarStyle: {
        backgroundColor: Colors.background,
        elevation: 0,
        shadowOpacity: 0,
        borderTopWidth: 0,
    },
    tabBarIconStyle: {
        width: 50,
    },
    KeyIconContainer: {
        width: 75,
        height: 75,
        backgroundColor: Colors.keyContainer,
        borderRadius: 100,
        justifyContent: 'center',
        alignItems: 'center',
    },
    hr: {
        borderBottomWidth: 1,
        width: 250,
    },
// Home page styles
    HomePage: {
        flex: 1,
        backgroundColor: Colors.background,
        justifyContent: 'center',
        alignItems: 'center',
    },
// Request page styles
    RequestPage: {
        flex: 1,
        backgroundColor: Colors.primary,
        justifyContent: 'center',
        alignItems: 'center',
    },
});

const AuthStyles = StyleSheet.create({
    page: {
        backgroundColor: Colors.primary,
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
    },
    backgroundContainer: {
        backgroundColor: Colors.primary,
        width: '100%',
        height: '80%',
        justifyContent: 'center',
        alignItems: 'center',
        position: 'absolute',
        rowGap: 200,
    },
    background: {
        backgroundColor: Colors.background,
        width: '110%',
        height: '1%',
        transform: [{ rotate: '15deg' }]
    },
    container: {
        backgroundColor: Colors.tertiary,
        justifyContent: 'center',
        alignItems: 'center',
        width: '75%',
        rowGap: 40,
        paddingTop: 20,
        paddingBottom: 20,
        borderRadius: 20
    },
    confirmContainer: {
        width: '100%',
        alignItems: 'center',
        rowGap: 10,
        padding: 0
    },
    title: {
        fontSize: 30
    },
    description: {
        fontSize: 15,
        textAlign: 'center',
        width: '75%',
    },
    inputContainer: {
        rowGap: 20,
    },
    input: {
        backgroundColor: Colors.tertiary,
        color: '#000',
        width: 225,
        height: 40,
        paddingLeft: 10,
        borderWidth: 1
    },
    actionButton: {
        backgroundColor: Colors.secondary,
        padding: 10,
        width: 100,
    },
    linkContainer: {
        flexDirection: 'row',
        justifyContent: 'space-evenly',
        gap: 50
    },
    providerContainer: {
        flexDirection: 'row',
        justifyContent: 'space-evenly',
        gap: 25
    },
    signInImg: {
        width: 25,
        height: 25,
    },
    googleSignIn: {
        borderWidth: 1,
        padding: 5,
        borderRadius: 20,
        flexDirection: 'row',
        columnGap: 0,
        alignItems: 'center',
    },
    amazonSignIn: {
        borderWidth: 1,
        padding: 5,
        borderRadius: 20,
        flexDirection: 'row',
        columnGap: 0,
        alignItems: 'center',
    },
    signInText: {
        padding: 5,
    }
});

const HomeStyles = StyleSheet.create({
    page: {
        flex: 1,
        backgroundColor: Colors.background,
        alignItems: 'center',
    },
    input: {
        backgroundColor: Colors.tertiary,
        height: 45,
        width: 250,
        paddingLeft: 10,
        borderWidth: 1,
    },
})

const ProfileStyles = StyleSheet.create({
    page: {
        flex: 1,
        backgroundColor: Colors.primary,
        paddingTop: 75,
        justifyContent: 'flexStart',
        alignItems: 'center',
        rowGap: 50,
    },
    tabContainer: {
        width: '100%',
        justifyContent: 'center',
        alignItems: 'center',
    },
    tab: {
        width: '100%',
        color: Colors.text,
        alignItems: 'center',
        marginTop: 10,
    },
    tabButton: {
        width: '90%',
        borderTopColor: Colors.tertiary,
        borderBottomColor: Colors.tertiary,
        borderTopWidth: 1,
        borderBottomWidth: 1,
        padding: 10,
    },
    tabText: {
        color: Colors.text,
        textAlign: 'center',
    },
    actionButton: {
        backgroundColor: Colors.secondary,
        padding: 10,
        width: 100,
    },
    // Index
    accountCard: {
        backgroundColor: Colors.tertiary,
        flexDirection: 'row',
        width: '90%',
        height: '125',
        borderRadius: 25,
        columnGap: 100,
        marginTop: 10,
        justifyContent: 'flexStart',
        alignItems: 'center',
        paddingLeft: 35
    },
    accountText: {
        rowGap: 10
    },
    editAccount: {
        height: '75%',

    },
    editButton: {
        backgroundColor: Colors.secondary,
        borderWidth: 1,
        borderRadius: 10,
        width: 50,
        height: 30,
        justifyContent: 'center',
        alignItems: 'center'
    },
    // Change Password / attributes
    textContainer: {
        backgroundColor: Colors.tertiary,
        padding: 25,
        borderRadius: 25,
        alignItems: 'center',
        rowGap: 20,
    },
    title: {
        fontSize: 25,
        textAlign: 'center',
    },
    subTitle: {
        fontSize: 17,
        fontWeight: '600',
        textAlign: 'center'
    },
    inputContainer: {
        rowGap: 20,
    },
    input: {
        backgroundColor: Colors.tertiary,
        height: 45,
        width: 250,
        paddingLeft: 10,
        borderWidth: 1,
    },
});

export { Styles, AuthStyles, HomeStyles, ProfileStyles };