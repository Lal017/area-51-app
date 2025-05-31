import { StyleSheet } from "react-native";
import Colors from "./colors";

const Styles = StyleSheet.create({
    // Header/Tab Styles
    HeaderContainer: {
        height: 100,
        justifyContent: 'flex-end',
        alignItems: 'center',
        paddingBottom: 20,
        backgroundColor: Colors.background,
    },
    LogoImg: {
        width: 200,
        resizeMode: 'contain',
        marginLeft: 20,
        marginTop: 50,
    },
    tabBarStyle: {
        backgroundColor: Colors.background,
        borderTopWidth: 0,
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
        borderColor: Colors.text,
        width: 350,
    },
    consoleBubble: {
        width: '100%',
        flex: 1,
        alignItems: 'center',
        position: 'relative',
    },
    // Tab Select
    tabWrapper: {
        width: '100%',
        paddingLeft: 75,
        alignItems: 'center',
        flexDirection: 'row',
        position: 'relative',
        height: 75,
    },
    rightIcon: {
        position: 'absolute',
        right: 20,
        zIndex: 1,
        color: Colors.text,
    },
    // Input
    inputContainer: {
        rowGap: 20,
        alignItems: 'center'
    },
    inputWrapper: {
        flexDirection: 'row',
        alignItems: 'center',
        alignSelf: 'center',
        justifyContent: 'center',
        position: 'relative',
        width: '90%'
    },
    input: {
        color: Colors.text,
        height: 55,
        paddingLeft: 50,
        width: '100%',
        borderWidth: 1,
        borderRadius: 5,
        borderColor: Colors.text,
    },
    inputAlt: {
        width: '100%',
        height: 150,
        paddingLeft: 50,
        borderWidth: 1,
        borderRadius: 5,
        borderColor: Colors.text,
        color: Colors.text,
        textAlignVertical: 'top',
        paddingTop: 15,
    },
    // button
    actionButton: {
        backgroundColor: Colors.secondary,
        height: 50,
        width: '90%',
        justifyContent: 'center',
        borderRadius: 5,
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
        color: Colors.text,
        width: '100%',
    },
    subTitle: {
        fontSize: 20,
        textAlign: 'left',
        fontWeight: 500,
        color: Colors.text,
    },
    text: {
        fontSize: 20,
        textAlign: 'left',
        fontWeight: 200,
        color: Colors.text,
    },
    // icons
    icon: {
        position: 'absolute',
        left: 20,
        zIndex: 1,
        color: Colors.text,
    },
    iconAlt: {
        position: 'absolute',
        left: 15,
        top: 15,
        zIndex: 1,
        color: Colors.text,
    },
    // container
    page: {
        flex: 1,
        backgroundColor: Colors.background,
        alignItems: 'center',
    },
    scrollPage: {
        backgroundColor: Colors.background,
        alignItems: 'center',
        flexGrow: 1
    },
    infoContainer: {
        width: '100%',
        justifyContent: 'center',
        paddingRight: 20,
        paddingLeft: 20,
        rowGap: 10,
    },
    block: {
        paddingTop: 25,
        paddingBottom: 25,
        rowGap: 25,
        width: '100%',
    },
});

const AuthStyles = StyleSheet.create({
    imgContainer: {
        width: '100%',
        height: '20%',
        paddingLeft: 25,
        paddingTop: 25
    },
    logoImg: {
        resizeMode: 'contain',
        width: 200,
        height: 150,
    },
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
        justifyContent: 'space-between',
        width: '100%',
        paddingRight: 40,
        paddingLeft: 40
    },
    signInImg: {
        width: 25,
        height: 25,
    },
    providerSignIn: {
        backgroundColor: 'white',
        borderWidth: 1,
        width: 150,
        padding: 10,
        borderRadius: 5,
        flexDirection: 'row',
        columnGap: 10,
        alignItems: 'center',
        justifyContent: 'center',
    },
});

const HomeStyles = StyleSheet.create({

});

const ServiceStyles = StyleSheet.create({
    // components.jsx
    calendarHeaderContainer: {
        width: '100%'
    },
    // (service)
    progressBar: {
        alignSelf: 'center',
        width: '100%',
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
        columnGap: 10,
        backgroundColor: Colors.background,
        paddingLeft: 20,
        paddingRight: 20,
    },
    progressBarLine: {
        flex: 1,
        height: 5,
        backgroundColor: Colors.backDropAccent
    },
    selectionContainer: {
        width: '100%',
        rowGap: 0,
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
        marginTop: 25
    },
    timeContainer: {
        width: '100%',
        rowGap: 10,
        justifyContent: 'space-evenly',
        paddingTop: 25,
        paddingBottom: 25,
        flexWrap: 'wrap',
        flexDirection: 'row'
    },
    timeBubble: {
        backgroundColor: Colors.backDropAccent,
        borderRadius: 5,
        padding: 15,
        width: '45%'
    },
    // myAppointments.jsx
    fieldContainer: {
        width: '100%',
        borderRadius: 5,
        position: 'relative',
        rowGap: 10,
        alignItems: 'center'
    },
    // towRequest.jsx
    mapContainer: {
        elevation: 10,
        backgroundColor: Colors.background,
        width: '100%',
        height: '60%'
    },
    mapContainerAlt: {
        elevation: 10,
        backgroundColor: Colors.background,
        borderWidth: 4,
        borderColor: Colors.secondary,
        width: 325,
        height: 325,
        borderRadius: 500,
        overflow: 'hidden'
    },
    // towStatus.jsx
    requestWrapper: {
        width: '100%',
        padding: 20,
        rowGap: 20,
        alignItems: 'left',
        justifyContent: 'center'
    },
        titleWrapper: {
        flexDirection: 'row',
        alignItems: 'center'
    },
});

const ProfileStyles = StyleSheet.create({
    // index.jsx
    socialContainer: {
        flexDirection: 'row',
        justifyContent: 'space-evenly',
        width: '100%',
        alignItems: 'center',
        paddingTop: 25,
        paddingBottom: 25
    },
    socialBox: {
        alignItems: 'center',
        justifyContent: 'center',
        color: '#1877f2',
        width: 175,
        padding: 25,
        borderRadius: 25,
    },
    name: {
        fontSize: 30,
        fontWeight: 'bold',
        color: Colors.text,
    },
    // Vehicle List
    vehicleContainer: {
        width: '100%',
        alignItems: 'center',
    },
    vehicleBox: {
        backgroundColor: Colors.backDrop,
        elevation: 10,
        padding: 25,
        width: '100%',
        alignItems: 'center',
        flexDirection: 'row',
        columnGap: 25,
    },
    addVehicleButton: {
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: Colors.backDrop,
        elevation: 10,
        padding: 25,
        width: '100%',
        alignItems: 'center'
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
    customerBox: {
        width: '100%',
        padding: 30,
        rowGap: 10,
        backgroundColor: Colors.backDrop,
        elevation: 12
    },
    picker: {
        backgroundColor: Colors.backDrop,
        borderRadius: 25,
        elevation: 10,
        width: 200,
        paddingLeft: 10
    },
    // userView.jsx
    vehicleContainer: {
        width: '100%',
        backgroundColor: Colors.backDrop,
        elevation: 5,
        borderRadius: 25,
        padding: 25,
        alignItems: 'center',
        rowGap: 5
    },
    labelContainer: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        width: '100%'
    }
});

export { Styles, AuthStyles, HomeStyles, ServiceStyles, ProfileStyles, AdminStyles };