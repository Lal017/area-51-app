import { View } from "react-native";
import { Tabs } from "expo-router";
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
                tabBarItemStyle: Styles.tabBarItemStyle,
                tabBarIconStyle: Styles.tabBarIconStyle,
                tabBarActiveTintColor: Colors.primary,
                tabBarInactiveTintColor: Colors.secondary,
                tabBarShowLabel: false,
            }}>
            <Tabs.Screen
                name="index"
                options={{
                title: 'Home',
                tabBarIcon: ({ color, size }) => (
                    <Ionicons name="home" size={size} color={color}/>
                ),
                }}
            />
            <Tabs.Screen
                name="request"
                options={{
                    title: "Request a locksmith",
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
                name="profile"
                options={{
                title: "Profile",
                tabBarIcon: ({ color, size }) => (
                    <Ionicons name="person" size={size} color={color}/>
                ),
                }}
            />
        </Tabs>
    );
};

export default TabsLayout;