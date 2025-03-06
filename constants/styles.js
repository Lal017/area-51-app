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
        marginTop: 25,
    },
    tabBarStyle: {
        display: 'flex',
        backgroundColor: Colors.background,
        justifyContent: 'center',
        alignItems: 'center',
        elevation: 0,
        shadowOpacity: 0,
        borderTopWidth: 0,
    },
    KeyIconContainer: {
        width: 75,
        height: 75,
        backgroundColor: Colors.keyContainer,
        borderRadius: 100,
        justifyContent: 'center',
        alignItems: 'center',
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
        backgroundColor: Colors.background,
        justifyContent: 'center',
        alignItems: 'center',
    },
// Profile page styles
    ProfilePage: {
        flex: 1,
        backgroundColor: Colors.primary,
        justifyContent: 'flex-start',
        alignItems: 'center',
        rowGap: 50,
    },
    ProfileCard: {
        backgroundColor: Colors.background,
        width: '75%',
        height: '15%',
        marginTop: 50,
        borderRadius: 25,
        justifyContent: 'space-evenly',
        alignItems: 'center',
    },
    TabContainer: {
        width: '100%',
        justifyContent: 'center',
        alignItems: 'center',
    },
    SettingsTab: {
        width: '100%',
        color: Colors.text,
        alignItems: 'center',
        marginTop: 10,
    },
    SettingsTabButton: {
        width: '90%',
        borderTopColor: Colors.tertiary,
        borderBottomColor: Colors.tertiary,
        borderTopWidth: 1,
        borderBottomWidth: 1,
        padding: 10,
    },
    SettingsTabText: {
        color: Colors.text,
        textAlign: 'center',
    },
    OutButton: {
        width: 85,
        height: 25,
        backgroundColor: Colors.background,
        borderWidth: 1,
        justifyContent: 'center',
        marginTop: 15,
    },
    OutText: {
        textAlign: 'center',
    }
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
        backgroundColor: Colors.background,
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
        backgroundColor: 'white',
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
    }
});

export { Styles, AuthStyles };