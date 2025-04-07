import { View } from "react-native";
import { Tabs} from "expo-router";
import { Ionicons } from "@expo/vector-icons";
import { CustHeader } from "../../components/components";
import { Styles } from "../../constants/styles";
import Colors from "../../constants/colors";

const TabsLayout = () =>
{
    return (
        <Tabs
            screenOptions={{
                header: () => <CustHeader/>,
                tabBarStyle: Styles.tabBarStyle,
                tabBarActiveTintColor: Colors.primary,
                tabBarInactiveTintColor: Colors.secondary,
                tabBarIconStyle: Styles.tabBarIconStyle,
                tabBarShowLabel: false,
            }}>
            <Tabs.Screen
                name="index"
                options={{
                title: 'Home',
                tabBarHideOnKeyboard: true,
                tabBarIcon: ({ color, size }) => (
                    <Ionicons name="home" size={size} color={color}/>
                ),
                }}
            />
            <Tabs.Screen
                name="request"
                options={{
                    title: "Request a locksmith",
                    tabBarHideOnKeyboard: true,
                    tabBarIcon: ({ color, size, focused }) => (
                        <View style={Styles.KeyIconContainer}>
                            <Ionicons
                                name="key"
                                size={size} 
                                color={focused ? color: "white"} 
                            />
                        </View>
                    ),
                }}
            />
            <Tabs.Screen
                name="(profile)"
                options={{
                title: "Profile",
                tabBarHideOnKeyboard: true,
                tabBarIcon: ({ color, size }) => (
                    <Ionicons name="person" size={size} color={color}/>
                ),
                }}
            />
        </Tabs>
    );
};

export default TabsLayout;