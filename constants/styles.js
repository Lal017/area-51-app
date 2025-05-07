import { StyleSheet } from "react-native";
import Colors, { Auth } from "./colors";

const Styles = StyleSheet.create({
    // Header/Tab Styles
    HeaderContainer: {
        backgroundColor: Colors.background,
        height: 95,
        justifyContent: 'flex-end',
        alignItems: 'center',
        elevation: 14,
        paddingBottom: 20,
    },
    HeaderTitle: {
        fontSize: 30,
        fontWeight: '400',
    },
    LogoImg: {
        width: 200,
        resizeMode: 'contain',
        marginLeft: 20,
        marginTop: 50,
    },
    tabBarStyle: {
        backgroundColor: Colors.background,
        elevation: 14,
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
    // Reusable Styling components
    hr: {
        borderBottomWidth: 1,
        borderColor: Auth.text,
        width: 300,
    },
    tabWrapper: {
        flexDirection: 'row',
        alignItems: 'center',
        position: 'relative',
    },
    icon: {
        position: 'absolute',
        left: 25,
        zIndex: 1,
    },
    rightIcon: {
        position: 'absolute',
        right: 20,
        zIndex: 1,
    },
    tabContainer: {
        width: '100%',
        justifyContent: 'center',
        alignItems: 'center',
    },
    tab: {
        width: '100%',
        alignItems: 'center',
    },
    tabButton: {
        backgroundColor: Colors.background,
        width: '100%',
        justifyContent: 'center',
        height: 75,
        elevation: 10,
        paddingLeft: 75,
    },
});

const AuthStyles = StyleSheet.create({
    page: {
        backgroundColor: Auth.background,
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
    },
    container: {
        justifyContent: 'center',
        alignItems: 'center',
        width: '100%',
        rowGap: 40,
        paddingTop: 20,
        paddingBottom: 20,
    },
    confirmContainer: {
        width: '100%',
        alignItems: 'center',
        rowGap: 10,
        padding: 0
    },
    title: {
        color: Auth.text,
        fontSize: 30,
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
    inputWrapper: {
        flexDirection: 'row',
        alignItems: 'center',
        position: 'relative',
    },
    icon: {
        position: 'absolute',
        left: 15,
        zIndex: 1,
    },
    input: {
        backgroundColor: Colors.background,
        width: 300,
        height: 50,
        paddingLeft: 45,
        borderWidth: 1,
        borderRadius: 25,
    },
    actionButton: {
        backgroundColor: Auth.primary,
        padding: 10,
        width: 300,
        borderRadius: 25,
        elevation: 5,
    },
    shiftButton: {
        borderWidth: 0,
        padding: 10,
        borderRadius: 25,
        color: Auth.text
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
    providerSignIn: {
        backgroundColor: 'white',
        borderWidth: 1,
        width: '35%',
        padding: 10,
        paddingLeft: 10,
        paddingRight: 10,
        borderRadius: 25,
        flexDirection: 'row',
        columnGap: 0,
        alignItems: 'center',
        justifyContent: 'center',
        elevation: 4,
    },
});

const HomeStyles = StyleSheet.create({
    page: {
        backgroundColor: Auth.background,
        justifyContent: 'center',
        alignItems: 'center',
        rowGap: 50,
        paddingTop: 25,
        paddingBottom: 50,
    },
    main: {
        paddingBottom: 50,
        width: '100%',
        rowGap: 20,
    },
    towButton: {
        backgroundColor: Colors.secondary,
        width: '100%',
        elevation: 10,
        justifyContent: 'center',
        alignItems: 'center',
        padding: 25,
        rowGap: 20,
    },
    title: {
        fontSize: 25,
        textAlign: 'center',
        width: '75%'
    },
    subTitle: {
        fontSize: 20,
        textAlign: 'left',
    },
    text: {
        fontSize: 20,
        textAlign: 'left',
        fontWeight: '100',
    },
    selectionContainer: {
        width: '100%',
        alignItems: 'center',
        justifyContent: 'flex-start',
        rowGap: 35,
        elevation: 10,
    },
    vehicleSelectContainer: {
        width: '100%',
    },
    vehicleSelect: {
        backgroundColor: Colors.background,
        width: '100%',
        alignItems: 'center',
        height: 75,
        elevation: 10,
        paddingLeft: 75,
        flexDirection: 'row',
        position: 'relative',
    },
    vehicleWrapper: {
        flexDirection: 'row',
        position: 'relative',
    },
    icon: {
        position: 'absolute',
        left: 15,
        zIndex: 1,
    },
    circle: {
        right: 20,
        zIndex: 1,
        position: 'absolute',
    },
    inputContainer: {
        width: '100%',
        alignItems: 'center',
        rowGap: 25,
        paddingLeft: 50,
        paddingRight: 50,
    },
    inputWrapper: {
        flexDirection: 'row',
        alignItems: 'center',
        position: 'relative',
    },
    icon: {
        position: 'absolute',
        left: 15,
        top: 15,
        zIndex: 1,
    },
    input: {
        backgroundColor: Colors.background,
        width: 350,
        height: 150,
        paddingLeft: 50,
        borderWidth: 1,
        borderRadius: 25,
        textAlign: 'left',
        textAlignVertical: 'top',
        paddingTop: 15,
    },
    actionButton: {
        backgroundColor: Colors.secondary,
        borderRadius: 25,
        elevation: 5,
        padding: 10,
        width: 250,
    },
    descriptionContainer: {
        width: '100%',
        justifyContent: 'center',
        paddingLeft: 50,
        paddingRight: 50,
        rowGap: 20,
    },
    notifWrapper: {
        width: '100%',
        elevation: 10,
        backgroundColor: Colors.background,
        padding: 20,
        rowGap: 20,
        alignItems: 'left',
    },
    titleWrapper: {
        flexDirection: 'row',
        alignItems: 'center',
    },
    serviceModal: {
        width: '50%',
    }
});

const ScheduleStyles = StyleSheet.create({
    page: {
        backgroundColor: Auth.background,
        justifyContent: 'center',
        paddingBottom: 50,
    },
    calendarContainer: {
        backgroundColor: Colors.background,
        width: '100%',
        elevation: 10,
    },
    timeContainer: {
        flexDirection: 'row',
        padding: 15,
        gap: 10,
    },
    timeBox: {
        backgroundColor: Colors.background,
        elevation: 10,
        borderWidth: 1,
        borderRadius: 25,
        padding: 10,
    },
    scheduleContainer: {
        rowGap: 50,
        width: '100%',
        justifyContent: 'center',
        alignItems: 'center'
    },
    descriptionContainer: {
        width: '100%',
        justifyContent: 'center',
        paddingLeft: 50,
        paddingRight: 50,
        rowGap: 20,
    },
    input: {
        backgroundColor: Colors.background,
        width: 350,
        height: 150,
        paddingLeft: 50,
        borderWidth: 1,
        borderRadius: 25,
        textAlign: 'left',
        textAlignVertical: 'top',
        paddingTop: 15,
    },
    inputContainer: {
        width: '100%',
        alignItems: 'center',
        rowGap: 25,
        paddingLeft: 50,
        paddingRight: 50,
    },
    inputWrapper: {
        flexDirection: 'row',
        alignItems: 'center',
        position: 'relative',
    },
    icon: {
        position: 'absolute',
        left: 15,
        top: 15,
        zIndex: 1,
    },
    actionButton: {
        backgroundColor: Colors.secondary,
        borderRadius: 25,
        elevation: 5,
        padding: 10,
        width: 250,
    },
    picker: {
        width: '85%',
        backgroundColor: Colors.background,
        borderWidth: 1,
        borderRadius: 25,
        paddingLeft: 20
    }
});

const ProfileStyles = StyleSheet.create({
    page: {
        flex: 1,
        backgroundColor: Auth.background,
        justifyContent: 'flexStart',
        alignItems: 'center',
        rowGap: 50,
    },
    socialContainer: {
        flexDirection: 'row',
        justifyContent: 'space-evenly',
        width: '100%',
        alignItems: 'center',
        marginTop: 50,
    },
    socialBox: {
        elevation: 10,
        alignItems: 'center',
        color: '#1877f2',
        width: 150,
        padding: 25,
        borderRadius: 25,
    },
    actionButton: {
        backgroundColor: Colors.secondary,
        borderRadius: 25,
        elevation: 5,
        padding: 10,
        width: 250,
    },
    // Index
    accountCard: {
        width: '100%',
        marginTop: 50,
        justifyContent: 'center',
        alignItems: 'flex-start',
        paddingLeft: 35
    },
    accountInfo: {
        rowGap: 20
    },
    accountText: {
        rowGap: 5
    },
    name: {
        fontSize: 25,
        fontWeight: 'bold',
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
        paddingTop: 100,
        width: '80%',
        alignItems: 'flex-start',
        justifyContent: 'center',
        rowGap: 20,
    },
    title: {
        fontSize: 25,
        fontWeight: 100,
    },
    subTitle: {
        fontSize: 20,
    },
    description: {
        fontSize: 20,
        textAlign: 'center'
    },
    inputContainer: {
        rowGap: 20,
    },
    inputWrapper: {
        flexDirection: 'row',
        alignItems: 'center',
        position: 'relative',
    },
    icon: {
        position: 'absolute',
        left: 15,
        zIndex: 1,
    },
    input: {
        backgroundColor: Colors.background,
        width: 300,
        height: 50,
        paddingLeft: 40,
        borderWidth: 1,
        borderRadius: 25,
    },
    // Vehicle List
    vehicleContainer: {
        padding: 25,
        width: '100%',
        justifyContent: 'flexStart',
        flexDirection: 'row',
        flexWrap: 'wrap',
        gap: 10,
    },
    vehicleBox: {
        borderWidth: 1,
        borderColor: Colors.backgroundAccent,
        backgroundColor: Colors.background,
        elevation: 8,
        padding: 25,
        width: '45%',
        minWidth: '40%',
        margin: 5,
        borderRadius: 25,
        alignItems: 'center',
        rowGap: 10
    },
    addVehicle: {
        justifyContent: 'center',
        alignItems: 'center',
        width: '45%'
    },
    formContainer: {
        paddingTop: 50,
        width: '100%',
        rowGap: 20,
        justifyContent: 'center',
        alignItems: 'center'
    }
});

export { Styles, AuthStyles, HomeStyles, ScheduleStyles, ProfileStyles };