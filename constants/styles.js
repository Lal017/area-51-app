import { StyleSheet } from "react-native";
import { textSize } from "./utils";
import Colors from "./colors";

const Styles = StyleSheet.create({
// Reusable Styling components
    hr: {
        borderBottomWidth: 1,
        borderColor: Colors.text,
        width: '90%',
    },
    consoleBubble: {
        flex: 1, width: '95%',
        borderRadius: 10,
        flexDirection: 'row',
        alignItems: 'center', justifyContent: 'space-evenly',
        overflow: 'hidden'
    },
    consoleBubbleAlt: {
        width: '48%', height: '33%',
        borderRadius: 10,
        alignItems: 'center', justifyContent: 'space-evenly',
        overflow: 'hidden'
    },
    // Tab Select
    tabWrapper: {
        width: '100%', height: 75,
        paddingLeft: 75,
        alignItems: 'center',
        flexDirection: 'row',
        position: 'relative'
    },
    binaryTabWrapper: {
        paddingLeft: 25,
        paddingRight: 25,
        padding: 10,
        alignItems: 'center',
        justifyContent: 'center',
        backgroundColor: Colors.button
    },
    // Input
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
        height: 50, width: '90%',
        justifyContent: 'center', alignSelf: 'center',
        borderRadius: 5
    },
    actionText: {
        color: Colors.text,
        fontSize: textSize(15),
        textAlign: 'center',
        fontFamily: 'Roboto-Bold'
    },
    // Text
    headerTitle: {
        fontSize: textSize(25),
        fontFamily: 'Roboto-Condensed-Light',
        color: Colors.text
    },
    title: {
        fontSize: textSize(30),
        fontFamily: 'Roboto-Condensed-Light',
        color: Colors.text,
    },
    subTitle: {
        fontSize: textSize(22),
        fontFamily: 'Roboto-SemiCondensed-Bold',
        textAlign: 'left',
        color: Colors.text,
    },
    text: {
        fontSize: textSize(15),
        fontFamily: 'Roboto-Light',
        textAlign: 'left',
        color: Colors.text,
    },
    tabHeader: {
        fontSize: textSize(15),
        fontFamily: 'Roboto-Light',
        textAlign: 'left',
        color: Colors.grayText
    },
    tabText: {
        fontSize: textSize(15),
        fontFamily: 'Roboto-Light',
        textAlign: 'left',
        color: Colors.text
    },
    errorText: {
        fontSize: textSize(15),
        fontFamily: 'SpaceMono-Regular',
        textAlign: 'left',
        color: 'red'
    },
    // icons
    icon: {
        position: 'absolute',
        left: 25,
        color: Colors.text,
    },
    iconAlt: {
        position: 'absolute',
        left: 15,
        top: 15,
        zIndex: 1,
        color: Colors.text,
    },
    rightIcon: {
        position: 'absolute',
        right: 20,
        zIndex: 1,
        color: Colors.text,
    },
    inputIcon: {
        position: 'absolute',
        left: 15,
        zindex: 1,
        color: Colors.text
    },
    // container
    page: {
        paddingTop: 20,
        flexGrow: 1,
        alignItems: 'center',
    },
    infoContainer: {
        width: '100%',
        justifyContent: 'center',
        paddingRight: 20, paddingLeft: 20,
    },
    block: {
        paddingBottom: 20,
        rowGap: 20,
        width: '100%',
    },
    errorContainer: {
        width: '90%',
        justifyContent: 'center',
        alignItems: 'flex-start',
        alignSelf: 'center',
        paddingLeft: 50
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
    providerContainer: {
        flexDirection: 'row',
        justifyContent: 'center',
        width: '100%',
        paddingRight: 20,
        paddingLeft: 20
    },
});

const HomeStyles = StyleSheet.create({
    panel: {
        width: '95%',
        maxHeight: '20%',
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
    shortcutButton: {
        flex: 1,
        height: '100%',
        justifyContent: 'center',
        alignItems: 'center',
        borderRadius: 5,
        position: 'relative',
        overflow: 'hidden'
    },
    // index.jsx
    appointmentTitle: {
        fontSize: textSize(20),
        fontFamily: 'Roboto-Condensed-Light',
        color: Colors.grayText
    },
    appointmentText: {
        fontSize: textSize(12),
        fontFamily: 'Roboto-Light',
        color: Colors.text
    },
});

const ServiceStyles = StyleSheet.create({
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
    buttonContainer: {
        width: '100%',
        height: 75,
        alignItems: 'center', justifyContent: 'space-evenly',
        flexDirection: 'row'
    },
    directionButton: {
        backgroundColor: Colors.button,
        borderRadius: 5,
        alignItems: 'center', justifyContent: 'space-evenly',
        height: '90%', width: '42%',
        flexDirection: 'row',
        elevation: 10,
    },
    // index.jsx
    title: {
        fontSize: textSize(23),
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
        width: '45%',
        alignItems: 'center',
        flexDirection: 'row',
        borderRadius: 5,
        overflow: 'hidden',
        padding: 15
    },
    timeContainer: {
        flexDirection: 'row',
        flexWrap: 'wrap',
        justifyContent: 'space-evenly',
        rowGap: 10,
    },
    // towRequest.jsx
    mapContainer: {
        elevation: 10,
        backgroundColor: 'transparent',
        width: '90%',
        height: 300,
        borderRadius: 15,
        overflow: 'hidden'
    }
});

const ProfileStyles = StyleSheet.create({
    // index.jsx
    name: {
        fontSize: textSize(30),
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
    // resetPassword.jsx
    requirementsWrapper: {
        flexDirection: 'row',
        columnGap: 5,
        alignItems: 'center'
    }
});

const AdminStyles = StyleSheet.create({
    picker: {
        backgroundColor: Colors.button,
        borderRadius: 15,
        width: '40%',
        paddingLeft: 10, marginLeft: 20,
        overflow: 'hidden'
    },
    // index.jsx
    lottieAnim: {
        width: 100,
        height: 100
    },
    // homeSettings.jsx
    imgPickContainer: {
        borderRadius: 10,
        width: '90%',
        overflow: 'hidden',
        alignSelf: 'center'
    },
    arrow: {
        position: 'absolute',
        top: '50%',
        marginTop: -50,
        bottom: '50%',
        height: 100,
        justifyContent: 'center',
        alignItems: 'center'
    },
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
        width: '100%',
        alignItems: 'center',
        justifyContent: 'space-between',
        flexDirection: 'row'
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