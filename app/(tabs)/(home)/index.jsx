import { View } from "react-native";
import { Background } from "../../../components/components";
import { HomeStyles } from "../../../constants/styles";

// Home page after login
const Index = () =>
{
  return (
    <Background>
      <View style={HomeStyles.snapContainer}></View>
    </Background>
  );
}

export default Index;