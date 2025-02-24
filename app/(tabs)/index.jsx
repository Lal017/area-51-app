import { View } from "react-native";
import SignOutButton from "../../components/components";
import Styles from "../../constants/styles";

// Home page after login
const Index = () =>
{
  return (
    <View style={Styles.HomePage}>
      <SignOutButton />
    </View>
  );
}

export default Index;