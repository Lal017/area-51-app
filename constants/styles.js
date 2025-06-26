import { StyleSheet } from "react-native";
import Colors from "./colors";

const Styles = StyleSheet.create({
    // Header/Tab Styles
    HeaderContainer: {
        height: 100,
        justifyContent: 'center',
        alignItems: 'flex-end',
        flexDirection: 'row',
        position: 'relative',
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
        elevation: 0,
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
        width: '90%',
    },
    consoleBubble: {
        flex: 1,
        width: '100%',
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        paddingRight: 25,
        paddingLeft: 25
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
        fontFamily: 'Roboto-Bold'
    },
    // Text
    title: {
        fontSize: 35,
        fontFamily: 'Roboto-Condensed-Light',
        color: Colors.text,
    },
    subTitle: {
        fontSize: 25,
        fontFamily: 'Roboto-SemiCondensed-Bold',
        textAlign: 'left',
        color: Colors.text,
    },
    text: {
        fontSize: 20,
        fontFamily: 'Roboto-Light',
        textAlign: 'left',
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
        paddingTop: 10,
        flexGrow: 1,
        alignItems: 'center',
    },
    infoContainer: {
        width: '100%',
        justifyContent: 'center',
        paddingRight: 20,
        paddingLeft: 20,
        rowGap: 10,
    },
    block: {
        paddingTop: 20,
        paddingBottom: 20,
        rowGap: 20,
        width: '100%',
    },
});

const AuthStyles = StyleSheet.create({
    imgContainer: {
        width: '100%',
        height: '20%',
        paddingLeft: 25,
        paddingTop: 25,
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
        paddingRight: 20,
        paddingLeft: 20
    },
    signInImg: {
        width: 25,
        height: 25,
    },
    providerSignIn: {
        backgroundColor: 'white',
        width: '47%',
        padding: 10,
        borderRadius: 5,
        flexDirection: 'row',
        columnGap: 10,
        alignItems: 'center',
        justifyContent: 'center',
    },
});

const HomeStyles = StyleSheet.create({
    panel: {
        width: '90%',
        flexDirection: 'row',
        columnGap: 10,
        paddingTop: 5,
        paddingBottom: 5
    },
    snapContainer: {
        flex: 1,
        borderRadius: 10,
        backgroundColor: Colors.backDropAccent,
        justifyContent: 'center',
        alignItems: 'center',
    },
    imgContainer: {
        flex: 1,
        borderRadius: 10,
        overflow: 'hidden',
        alignSelf: 'center',
    },
    welcomeContainer: {
        width: '100%',
        alignItems: 'center',
        height: 50,
    },
    activityContainer: {
        width: 30,
        height: 30,
        borderRadius: 100,
        justifyContent: 'center',
        alignItems: 'center',
        position: 'absolute',
        right: 10,
        top: -15
    },
    appointmentContainer: {
        backgroundColor: Colors.backgroundAccent,
        flex: 1,
        borderRadius: 10,
        padding: 25,
        paddingTop: 15,
        paddingBottom: 15
    },
    shortcutContainer: {
        width: '100%',
        height: 60,
        flexDirection: 'row',
        alignItems: 'center',
        paddingLeft: 20,
        paddingRight: 20,
        columnGap: 10
    },
    shortcutButton: {
        flex: 1,
        height: '100%',
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: Colors.backgroundAccent,
        borderRadius: 5,
        position: 'relative'
    },

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
        backgroundColor: 'transparent',
        padding: 20
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
    // index.jsx
    title: {
        fontSize: 30,
        fontFamily: 'Roboto-Light',
        color: Colors.text,
        width: '65%',
        textAlign: 'left',
    },
    lottieAnim: {
        width: 125,
        height: 125
    },
    // schedule.jsx
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
        backgroundColor: Colors.backgroundAccent,
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
        backgroundColor: 'transparent',
        width: '100%',
        height: '60%'
    },
    mapContainerAlt: {
        elevation: 10,
        backgroundColor: 'transparent',
        borderWidth: 4,
        borderColor: Colors.secondary,
        width: 325,
        height: 325,
        borderRadius: 500,
        overflow: 'hidden'
    },
    // towStatus.jsx
    titleWrapper: {
        flexDirection: 'row',
        alignItems: 'center',
        columnGap: 10
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
        fontFamily: 'Roboto-Bold',
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
});

const AdminStyles = StyleSheet.create({
    customerBox: {
        width: '100%',
        padding: 30,
        rowGap: 10,
        backgroundColor: Colors.backgroundAccent,
    },
    picker: {
        backgroundColor: Colors.backgroundAccent,
        borderRadius: 25,
        width: 200,
        paddingLeft: 10
    },
    // index.jsx
    lottieAnim: {
        width: 100,
        height: 100
    },
    // userView.jsx
    vehicleContainer: {
        width: '90%',
        backgroundColor: Colors.backgroundAccent,
        borderRadius: 10,
        padding: 25,
        alignItems: 'center',
        alignSelf: 'center',
        rowGap: 5
    },
    labelContainer: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        width: '100%'
    },
    pdfContainer: {
        flex: 1,
        width: '100%',
        height: '100%',
        backgroundColor: 'black'
    },
    pdf: {
        flex: 1,
    },
    // homeSettings.jsx
    imgPickContainer: {
        borderRadius: 10,
        width: '90%',
        overflow: 'hidden',
        alignSelf: 'center'
    },
    imgPick: {
        resizeMode: 'contain',
        width: 400,
        height: 225
    },
    noImg: {
        width: '100%',
        height: 225,
        borderRadius: 10,
        backgroundColor: 'white',
        justifyContent: 'center',
        alignItems: 'center'
    },
    centerPercentContainer: {
        position: 'absolute',
        borderRadius: 100,
        justifyContent: 'center',
        alignItems: 'center',
        top: 0,
        left: 0,
        right: 0,
        bottom: 0
    },
    percentContainer: {
        backgroundColor: 'white',
        width: 50,
        height: 50,
        justifyContent: 'center',
        alignItems: 'center',
        borderRadius: 100,
    }
});

export { Styles, AuthStyles, HomeStyles, ServiceStyles, ProfileStyles, AdminStyles };