import { StyleSheet } from "react-native";
import Colors from "./colors";

const Styles = StyleSheet.create({
    // Header/Tab Styles
    HeaderContainer: {
        height: 100,
        justifyContent: 'flex-end',
        alignItems: 'center',
        paddingBottom: 20,
    },
    LogoImg: {
        width: 200,
        resizeMode: 'contain',
        marginLeft: 20,
        marginTop: 50,
    },
    tabBarStyle: {
        backgroundColor: Colors.backDrop,
        elevation: 14,
    },
    carIconContainer: {
        width: 75,
        height: 75,
        backgroundColor: Colors.backDropAccent,
        borderRadius: 100,
        justifyContent: 'center',
        alignItems: 'center',
    },
// Reusable Styling components
    hr: {
        borderBottomWidth: 1,
        borderColor: Colors.textAlt,
        width: 350,
    },
    consoleBubble: {
        width: '95%',
        height: 175,
        borderRadius: 50,
        elevation: 10,
        backgroundColor: Colors.tertiary,
        alignItems: 'center',
        position: 'relative',
    },
    // Tab Select
    tabWrapper: {
        flexDirection: 'row',
        alignItems: 'center',
        position: 'relative',
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
        backgroundColor: Colors.backDrop,
        width: '100%',
        justifyContent: 'center',
        height: 75,
        elevation: 10,
        paddingLeft: 75,
    },
    // Input
    inputContainer: {
        rowGap: 20,
        alignItems: 'center'
    },
    inputWrapper: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
        position: 'relative',
        width: '80%'
    },
    input: {
        backgroundColor: Colors.backDrop,
        height: 50,
        paddingLeft: 50,
        borderWidth: 1,
        borderRadius: 25,
        width: '100%'
    },
    inputAlt: {
        backgroundColor: Colors.backDrop,
        width: '100%',
        height: 150,
        paddingLeft: 50,
        borderWidth: 1,
        borderRadius: 15,
        textAlignVertical: 'top',
        paddingTop: 15,
    },
    // button
    actionButton: {
        backgroundColor: Colors.secondary,
        padding: 10,
        width: 300,
        borderRadius: 25,
        elevation: 5,
    },
    actionText: {
        color: Colors.text,
        textAlign: 'center',
    },
    // Text
    title: {
        fontSize: 35,
        fontWeight: 300,
        textAlign: 'center',
        width: '75%'
    },
    subTitle: {
        fontSize: 20,
        textAlign: 'left',
        fontWeight: 500
    },
    text: {
        fontSize: 20,
        textAlign: 'left',
        fontWeight: 200,
    },
    // icons
    icon: {
        position: 'absolute',
        left: 20,
        zIndex: 1,
    },
    iconAlt: {
        position: 'absolute',
        left: 15,
        top: 15,
        zIndex: 1,
    },
    // container
    page: {
        flex: 1,
        backgroundColor: Colors.background,
        justifyContent: 'center',
        alignItems: 'center',
        rowGap: 35,
    },
    scrollPage: {
        backgroundColor: Colors.background,
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
});

const AuthStyles = StyleSheet.create({
    confirmContainer: {
        width: '100%',
        alignItems: 'center',
        rowGap: 10,
    },
    description: {
        color: Colors.text,
        fontSize: 15,
        textAlign: 'center',
        width: '75%',
    },
    providerContainer: {
        flexDirection: 'row',
        justifyContent: 'center',
        gap: 25,
        width: '100%',
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
    requestWrapper: {
        width: '100%',
        elevation: 10,
        backgroundColor: Colors.backDrop,
        padding: 20,
        rowGap: 20,
        alignItems: 'left',
        justifyContent: 'center'
    },
    titleWrapper: {
        flexDirection: 'row',
        alignItems: 'center',
    },
    buttonContainer: {
        width: '100%',
        alignItems: 'center',
        rowGap: 20
    }
});

const ServiceStyles = StyleSheet.create({
    calendarHeaderContainer: {
        width: '100%'
    },
    progressBar: {
        alignSelf: 'center',
        width: '75%',
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
        columnGap: 10,
    },
    progressBarLine: {
        flex: 1,
        height: 5,
        backgroundColor: Colors.backDropAccent
    },
    descriptionContainer: {
        width: '100%',
        justifyContent: 'center',
        alignItems: 'center',
        padding: 10,
        paddingBottom: 40,
        rowGap: 20,
    },
    selectionContainer: {
        width: '100%',
        alignItems: 'center',
        justifyContent: 'flex-start',
        rowGap: 20,
        padding: 30,
    },
    buttonContainer: {
        width: '100%',
        height: 100,
        alignItems: 'center',
        justifyContent: 'center',
        columnGap: 50,
        flexDirection: 'row'
    },
    directionButton: {
        backgroundColor: Colors.secondary,
        borderRadius: 25,
        alignItems: 'center',
        justifyContent: 'center',
        columnGap: 15,
        flexDirection: 'row',
        width: 150,
        height: 65,
        elevation: 10,
    },
    // schedule.jsx
    calendarContainer: {
        width: '100%',
        rowGap: 10,
        marginTop: 75
    },
    timeContainer: {
        width: '100%',
        rowGap: 10,
        justifyContent: 'space-evenly',
        backgroundColor: Colors.background,
        paddingTop: 25,
        paddingBottom: 25,
        flexWrap: 'wrap',
        flexDirection: 'row'
    },
    timeBubble: {
        backgroundColor: Colors.backDrop,
        elevation: 10,
        borderRadius: 50,
        padding: 15,
        width: '45%'
    },
    // towRequest.jsx
    informationContainer: {
        width: '100%',
        justifyContent: 'center',
        padding: 30,
        rowGap: 10,
    },
});

const ProfileStyles = StyleSheet.create({
    // Social Media links
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
    // Account info
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
    textContainer: {
        width: '80%',
        alignItems: 'flex-start',
        justifyContent: 'center',
        rowGap: 20,
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
        borderColor: Colors.backDropAccent,
        backgroundColor: Colors.backDrop,
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

const AdminStyles = StyleSheet.create({
    userContainer: {
        width: '100%',
        alignItems: 'center',
        rowGap: 5
    },
    userCard: {
        width: '95%',
        backgroundColor: Colors.backDrop,
        elevation: 10,
        borderRadius: 25,
        padding: 25,
        rowGap: 10
    },
    userInfo: {
        gap: 2
    },
    vehicleInfo: {
        width: '100%',
        flexDirection: 'row',
        flexWrap: 'wrap',
        justifyContent: 'space-evenly',
        padding: 10,
        backgroundColor: Colors.background,
        borderRadius: 25
    },
    customerBox: {
        width: '100%',
        padding: 30,
        rowGap: 10,
        backgroundColor: Colors.backDrop,
        elevation: 10
    },
    vehicleBox: {
        width: '100%',
        justifyContent: 'center',
        columnGap: 10,
        flexDirection: 'row',
        backgroundColor: Colors.backDrop,
        elevation: 10,
        paddingTop: 25,
        paddingBottom: 25,
    },
    notesBox: {
        paddingLeft: 30,
        paddingRight: 30,
        width: '100%',
        alignItems: 'flex-start'
    },
    infoContainer: {
        width: '100%',
        alignItems: 'center',
        rowGap: 25,
        paddingBottom: 25
    },
    responseContainer: {
        width: '100%',
        alignItems: 'center',
        rowGap: 25,
    }
});

export { Styles, AuthStyles, HomeStyles, ServiceStyles, ProfileStyles, AdminStyles };