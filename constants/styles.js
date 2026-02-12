import { StyleSheet } from "react-native";
import { RFValue } from "react-native-responsive-fontsize";
import Colors from "./colors";

const Styles = StyleSheet.create({
    // Header/Tab Styles
    HeaderContainer: {
        height: 100,
        justifyContent: 'center',
        alignItems: 'center',
        flexDirection: 'row',
        position: 'relative',
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
        width: '95%',
        borderRadius: 10,
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-evenly',
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
    binaryTabWrapper: {
        width: '40%',
        borderRadius: 10,
        paddingLeft: 25,
        paddingRight: 25,
        alignItems: 'center',
        justifyContent: 'space-around',
        flexDirection: 'row',
        position: 'relative',
        height: 50,
        backgroundColor: Colors.backgroundAccent
    },
    binaryTabContainer: {
        width: '100%',
        height: 50,
        flexDirection: 'row',
        columnGap: 50,
        justifyContent: 'center',
        alignItems: 'center',
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
        height: 45,
        paddingLeft: 50,
        width: '100%',
        borderBottomWidth: 1,
        borderRadius: 0,
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
        backgroundColor: Colors.button,
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
    signOutButton: {
        position: 'absolute',
        right: 20,
        top: 45,
        justifyContent: 'center',
        alignItems: 'center'
    },
    // Text
    headerTitle: {
        fontSize: RFValue(25),
        fontFamily: 'Roboto-Condensed-Light',
        color: Colors.text
    },
    title: {
        fontSize: RFValue(30),
        fontFamily: 'Roboto-Condensed-Light',
        color: Colors.text,
    },
    subTitle: {
        fontSize: RFValue(22),
        fontFamily: 'Roboto-SemiCondensed-Bold',
        textAlign: 'left',
        color: Colors.text,
    },
    text: {
        fontSize: RFValue(15),
        fontFamily: 'Roboto-Light',
        textAlign: 'left',
        color: Colors.text,
    },
    tabHeader: {
        fontSize: RFValue(15),
        fontFamily: 'Roboto-Light',
        textAlign: 'left',
        color: Colors.text,
        opacity: 0.5
    },
    tabText: {
        fontSize: RFValue(15),
        fontFamily: 'Roboto-Light',
        textAlign: 'left',
        color: Colors.text
    },
    // icons
    icon: {
        position: 'absolute',
        left: 17,
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
        paddingBottom: 20,
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
    floatingBlock: {
        width: '95%',
        padding: 10,
        paddingTop: 25,
        paddingBottom: 25,
        borderRadius: 15,
        backgroundColor: Colors.backgroundAccent
    },
    errorContainer: {
        width: '100%',
        justifyContent: 'center',
        alignItems: 'center',
        textAlign: 'center',
        paddingLeft: 20,
        paddingRight: 20
    }
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
        fontSize: RFValue(15),
        textAlign: 'center',
        width: '75%',
    },
    providerContainer: {
        flexDirection: 'row',
        justifyContent: 'center',
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
        width: '100%',
        padding: 10,
        borderRadius: 25,
        flexDirection: 'row',
        columnGap: 10,
        alignItems: 'center',
        justifyContent: 'center',
    },
    checkBox: {
        width: 30,
        height: 30,
        backgroundColor: Colors.backDropAccent,
        borderRadius: 5,
        justifyContent: 'center',
        alignItems: 'center'
    }
});

const HomeStyles = StyleSheet.create({
    panel: {
        width: '95%',
        maxHeight: '25%',
        flexDirection: 'row',
        flexWrap: 'wrap',
        gap: 5,
        paddingTop: 5,
        paddingBottom: 5,
    },
    panelContainer: {
        flex: 1,
        minWidth: '30%',
        maxHeight: '100%',
        borderRadius: 10,
        justifyContent: 'center',
        alignItems: 'center',
    },
    imgContainer: {
        width: '100%',
        borderRadius: 10,
        overflow: 'hidden',
        alignSelf: 'center',
    },
    welcomeContainer: {
        width: '100%',
        alignItems: 'center',
        justifyContent: 'center',
        padding: 15,
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
        minWidth: '40%',
        maxHeight: '100%',
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
    // index.jsx
    appointmentTitle: {
        fontSize: RFValue(25),
        fontFamily: 'Roboto-Condensed-Light',
        color: Colors.text
    },
    appointmentText: {
        fontSize: RFValue(12),
        fontFamily: 'Roboto-Light',
        color: Colors.text
    },
    // vehiclePickup.jsx
    pickupContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: Colors.backDrop,
        padding: 20,
        rowGap: 20,
        width: '95%',
        borderRadius: 10
    },
    pickupInfo: {
        flexDirection: 'row',
        columnGap: 20
    },
    pickupButton: {
        width: 50,
        height: 50,
        borderRadius: 10,
        backgroundColor: Colors.button,
        justifyContent: 'center',
        alignItems: 'center'
    }
});

const ServiceStyles = StyleSheet.create({
    // components.jsx
    calendarHeaderContainer: {
        width: '100%'
    },
    // (service)
    subTitle: {
        fontSize: RFValue(12),
        fontFamily: 'Roboto-bold',
        textAlign: 'left',
        color: Colors.text,
    },
    text: {
        fontSize: RFValue(22),
        fontFamily: 'Roboto-light',
        textAlign: 'left',
        color: Colors.text,
    },
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
        backgroundColor: Colors.button,
        borderRadius: 10,
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
        fontSize: RFValue(23),
        fontFamily: 'Roboto-Light',
        color: Colors.text,
        textAlign: 'left',
        width: '50%',
    },
    lottieAnim: {
        width: 125,
        height: 125
    },
    // schedule.jsx
    timeSelectContainer: {
        width: '90%',
        backgroundColor: Colors.contrast,
        alignItems: 'center',
        justifyContent: 'center',
        flexDirection: 'row',
        borderRadius: 15,
        padding: 10
    },
    timeContainer: {
        flexDirection: 'row',
        flexWrap: 'wrap',
        justifyContent: 'space-evenly',
        rowGap: 15,
    },
    timeBubble: {
        backgroundColor: 'rgba(0,0,0,0.5)',
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
        width: '90%',
        height: 300,
        borderRadius: 15,
        overflow: 'hidden'
    },
    mapContainerAlt: {
        elevation: 10,
        backgroundColor: 'transparent',
        width: '90%',
        height: 250,
        borderRadius: 15,
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
    name: {
        fontSize: RFValue(30),
        fontFamily: 'Roboto-Bold',
        color: Colors.text,
    },
    tabContainer: {
        width: '100%',
        position: 'relative'
    },
    activityContainer: {
        width: 30,
        height: 30,
        borderRadius: 100,
        justifyContent: 'center',
        alignItems: 'center',
        position: 'absolute',
        left: 10,
        top: 5,
        zIndex: 1,
    },
    // Vehicle List
    vehicleContainer: {
        width: '100%',
        alignItems: 'center',
    },
    vehicleBox: {
        backgroundColor: Colors.backDrop,
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
    // resetPassword.jsx
    requirementsContainer: {
        justifyContent: 'flex-start',
        paddingLeft: 20
    },
    requirementsWrapper: {
        flexDirection: 'row',
        columnGap: 5,
        alignItems: 'center'
    }
});

const AdminStyles = StyleSheet.create({
    customerBox: {
        width: '100%',
        padding: 30,
        rowGap: 10,
        backgroundColor: Colors.backgroundAccent,
    },
    picker: {
        backgroundColor: Colors.backDropAccent,
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
        width: '100%',
        paddingLeft: 25,
        paddingRight: 25,
        alignItems: 'center',
        alignSelf: 'center',
        rowGap: 5
    },
    labelContainer: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
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
    inputContainer: {
        width: '100%',
        backgroundColor: 'white',
    },
    // invoiceList.jsx
    invoiceItem: {
        width: '100%',
        padding: 25,
        textAlign: 'center',
        backgroundColor: Colors.backgroundAccent,
    },
    // (appointment)/index.jsx
    agendaList: {
        width: '100%',
        padding: 20
    }
});

const TowStyles = StyleSheet.create({
    dualButtonContainer: {
        width: '100%',
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        paddingLeft: 20,
        paddingRight: 20
    },
    button: {
        width: '48%',
        height: 65,
        borderRadius: 10,
        justifyContent: 'center',
        alignItems: 'center',
        flexDirection: 'row',
    },
    inputWrapper: {
        flexDirection: 'row',
        alignItems: 'center',
        alignSelf: 'center',
        justifyContent: 'center',
        position: 'relative',
        width: '35%'
    },
    input: {
        color: Colors.text,
        height: 55,
        paddingLeft: 55,
        paddingRight: 10,
        width: '100%',
        borderWidth: 1,
        borderRadius: 5,
        borderColor: Colors.text,
    },
    // mapstyles
    mainContainer: {
        position: 'absolute',
        width: '100%',
        justifyContent: 'center',
        alignItems: 'center',
        top: 25
    },
    secondaryContainer: {
        position: 'absolute',
        width: '100%',
        alignItems: 'center',
        justifyContent: 'space-between',
        flexDirection: 'row',
        bottom: 0,
        padding: 15,
        paddingBottom: 30,
        borderTopLeftRadius: 15,
        borderTopRightRadius: 15,
        backgroundColor: Colors.backgroundFade
    },
    stepContainer: {
        width: '95%',
        alignItems: 'center',
        justifyContent: 'space-between',
        flexDirection: 'row',
        borderRadius: 15,
        padding: 15,
        backgroundColor: Colors.tertiary
    },
    textContainer: {
        width: '60%',
        justifyContent: 'center',
        alignItems: 'flex-start',
        textAlign: 'left'
    },
    lowerTextContainer: {
        width: '60%',
        justifyContent: 'center',
        alignItems: 'center',
        textAlign: 'center'
    },
    iconContainer: {
        width: '20%',
        justifyContent: 'center',
        alignItems: 'center'
    }
});

export { Styles, AuthStyles, HomeStyles, ServiceStyles, ProfileStyles, AdminStyles, TowStyles };