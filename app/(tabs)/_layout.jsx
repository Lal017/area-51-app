import { Tabs } from "expo-router";
import { Ionicons } from "@expo/vector-icons";
import { CustHeader } from "../../components/components";

export default function TabsLayout() {
    return (
        <Tabs
            screenOptions={{header: () => <CustHeader/>}}>
            <Tabs.Screen
                name="index"
                options={{
                title: "Home",
                tabBarIcon: ({ color, size }) => (
                    <Ionicons name="home" size={size} color={color}/>
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