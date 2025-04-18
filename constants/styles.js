import { StyleSheet } from "react-native";
import Colors from "./colors";

const Styles = StyleSheet.create({
// All page styles
    HeaderContainer: {
        backgroundColor: Colors.backgroundAccent,
        flexDirection: 'row',
        height: 150,
        justifyContent: 'flex-start',
        alignItems: 'center',
    },
    LogoImg: {
        width: 200,
        resizeMode: 'contain',
        marginLeft: 20,
        marginTop: 50,
    },
    tabBarStyle: {
        backgroundColor: Colors.backgroundAccent,
        elevation: 0,
        shadowOpacity: 0,
        borderTopWidth: 0,
    },
    KeyIconContainer: {
        width: 75,
        height: 75,
        backgroundColor: Colors.secondary,
        borderRadius: 100,
        justifyContent: 'center',
        alignItems: 'center',
    },
    hr: {
        borderBottomWidth: 1,
        borderColor: Colors.text,
        width: 250,
    },
// Phone Input page styles
    phonePage: {
        flex: 1,
        backgroundColor: Colors.backgroundAccent,
        justifyContent: 'center',
        alignItems: 'center',
    },
});

const AuthStyles = StyleSheet.create({
    page: {
        backgroundColor: Colors.background,
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
    },
    backgroundContainer: {
        backgroundColor: Colors.background,
        width: '100%',
        height: '80%',
        justifyContent: 'center',
        alignItems: 'center',
        position: 'absolute',
        rowGap: 200,
    },
    background: {
        backgroundColor: Colors.backgroundAccent,
        width: '110%',
        height: '1%',
        transform: [{ rotate: '15deg' }]
    },
    container: {
        backgroundColor: Colors.secondary,
        justifyContent: 'center',
        alignItems: 'center',
        width: '75%',
        rowGap: 40,
        paddingTop: 20,
        paddingBottom: 20,
        borderRadius: 15
    },
    confirmContainer: {
        width: '100%',
        alignItems: 'center',
        rowGap: 10,
        padding: 0
    },
    title: {
        color: Colors.text,
        fontSize: 30
    },
    description: {
        color: Colors.text,
        fontSize: 15,
        textAlign: 'center',
        width: '75%',
    },
    inputContainer: {
        rowGap: 20,
    },
    input: {
        backgroundColor: Colors.background,
        width: 225,
        height: 40,
        paddingLeft: 10,
        borderWidth: 1
    },
    actionButton: {
        backgroundColor: Colors.tertiary,
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
        backgroundColor: 'white',
        borderWidth: 1,
        padding: 5,
        borderRadius: 20,
        flexDirection: 'row',
        columnGap: 0,
        alignItems: 'center',
    },
    amazonSignIn: {
        backgroundColor: 'white',
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
        justifyContent: 'flex-start',
    },
    input: {
        backgroundColor: Colors.backgroundAccent,
        height: 45,
        width: 250,
        paddingLeft: 10,
        borderWidth: 1,
    },
    request: {
        backgroundColor: Colors.secondary,
        width: 250,
        height: 50,
        justifyContent: 'center',
        alignItems: 'center',
        borderRadius: 10,
        marginTop: 20,
    }
});

const RequestStyles = StyleSheet.create({
    page: {
        backgroundColor: Colors.background,
        alignItems: 'center',
        justifyContent: 'space-evenly',
        rowGap: 20,
        paddingTop: 50,
        paddingBottom: 50,
    },
    container: {
        backgroundColor: Colors.secondary,
        borderRadius: 15,
        justifyContent: 'center',
        alignItems: 'center',
        paddingTop: 50,
        paddingBottom: 50,
        width: '75%',
        rowGap: 50,
    },
    title: {
        color: Colors.text,
        fontSize: 25,
        textAlign: 'center',
    },
    messageContainer: {
        rowGap: 10,
    },
    inputTitle: {
        backgroundColor: Colors.background,
        borderWidth: 1,
        width: '75%',
        height: 40,
        paddingLeft: 10,
    },
    inputMessage: {
        backgroundColor: Colors.background,
        borderWidth: 1,
        width: '75%',
        height: 200,
        paddingLeft: 10,
        paddingTop: 10,
        textAlignVertical: 'top',
    },
    actionButton: {
        backgroundColor: Colors.tertiary,
        padding: 10,
        width: 100,
    }
});

const ProfileStyles = StyleSheet.create({
    page: {
        flex: 1,
        backgroundColor: Colors.background,
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
        textAlign: 'center',
    },
    actionButton: {
        backgroundColor: Colors.tertiary,
        padding: 10,
        width: 100,
    },
    // Index
    accountCard: {
        backgroundColor: Colors.secondary,
        flexDirection: 'row',
        width: '90%',
        height: '125',
        borderRadius: 15,
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
        backgroundColor: Colors.tertiary,
        borderWidth: 1,
        borderRadius: 10,
        width: 50,
        height: 30,
        justifyContent: 'center',
        alignItems: 'center'
    },
    // Change Password / attributes
    textContainer: {
        backgroundColor: Colors.secondary,
        padding: 25,
        borderRadius: 15,
        alignItems: 'center',
        rowGap: 20,
    },
    title: {
        color: Colors.text,
        fontSize: 25,
        textAlign: 'center',
    },
    subTitle: {
        color: Colors.text,
        fontSize: 15,
        fontWeight: 'bold',
        textAlign: 'center'
    },
    inputContainer: {
        rowGap: 20,
    },
    input: {
        backgroundColor: Colors.background,
        height: 45,
        width: 250,
        paddingLeft: 10,
        borderWidth: 1,
    },
});

export { Styles, AuthStyles, HomeStyles, RequestStyles, ProfileStyles };