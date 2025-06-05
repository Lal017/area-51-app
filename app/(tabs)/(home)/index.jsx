import { Text, TouchableOpacity, Linking, View } from "react-native";
import { router } from "expo-router";
import { Background } from "../../../components/components";
import { HomeStyles, Styles } from "../../../constants/styles";
import { Entypo, Ionicons, MaterialCommunityIcons } from "@expo/vector-icons";
import { useApp } from "../../../components/context";

// Home page after login
const Index = () =>
{
  const { firstName, towRequest } = useApp();
  
  return (
    <Background>
      <View style={HomeStyles.shortcutContainer}>
        <TouchableOpacity
          style={HomeStyles.shortcutButton}
          onPress={() => {
          if (towRequest !== undefined) {
            router.push('/towStatus');
          } else {
            router.push('/towRequest')
          }
        }}
        >
          <MaterialCommunityIcons name="tow-truck" size={30} color="white" />
        </TouchableOpacity>
        <TouchableOpacity
          style={HomeStyles.shortcutButton}
          onPress={() => router.push('/schedule')}
        >
          <Entypo name='calendar' size={30} color="white" />
        </TouchableOpacity>
        <TouchableOpacity
          style={HomeStyles.shortcutButton}
          onPress={() => router.push('/vehicleList')}  
        >
          <Ionicons name='settings' size={30} color="white" />
        </TouchableOpacity>
      </View>
      <View style={HomeStyles.welcomeContainer}>
        <Text style={Styles.text}>Welcome {firstName}!</Text>
      </View>
      <TouchableOpacity
        style={HomeStyles.snapContainer}
        onPress={() => Linking.openURL('https://apply.snapfinance.com/snap-loan/landing?paramId=BEQypIc2AUit0%2BNU%2Fm1jaPTPmNwVgcoBY9btcVvwhMCDJ8qdDYWfFVb5WW%2BxBO51f%2BgPNPmcvPPGEqOKyqcCy57l581i30Mhc54AQ4Uv4I9COQxyDewFNEYSJJRGvQ379a7K2SmTgeFlpEssm%2FParIJh1%2FqwsslQ14TK0wPysRM%2B5wQQIZY5lILxig1G1ms0SOVMj1t76bwiCSSvuzFBeA%3D%3D&source=QR_CODE&merchantId=490307391&lang=en')}  
      >
        <Text style={Styles.title}>Snap Finance</Text>
      </TouchableOpacity>
    </Background>
  );
}

export default Index;