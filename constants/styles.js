import { StyleSheet } from "react-native";
import { SettingsTab } from "../components/components";

const Styles = StyleSheet.create({
// All page styles
    HeaderContainer: {
        flexDirection: 'row',
        height: 100,
        justifyContent: 'flex-start',
        alignItems: 'center',
    },
// Home page styles
    HomePage: {
        flex: 1,
        backgroundColor: '#58833B',
        justifyContent: 'center',
        alignItems: 'center',
    },
    OutButton: {
        width: 75,
        height: 20,
        backgroundColor: 'white',
    },
// Profile page styles
    ProfilePage: {
        flex: 1,
        backgroundColor: '#58833B',
        justifyContent: 'flex-start',
        alignItems: 'center',
    },
    ProfileCard: {
        backgroundColor: 'white',
        width: '90%',
        height: '35%',
        marginTop: 50,
        borderRadius: 25,
        justifyContent: 'space-evenly',
        alignItems: 'center',
    },
    SettingsTab: {
        width: '100%',
        color: 'white',
        alignItems: 'center',
        marginTop: 10,
    },
    SettingsTabButton: {
        width: '90%',
        borderTopColor: 'white',
        borderBottomColor: 'white',
        borderTopWidth: 1,
        borderBottomWidth: 1,
        padding: 10,
    }
})

export default Styles;