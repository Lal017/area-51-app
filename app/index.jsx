import { View } from "react-native";
import SignOutButton from "../components/components";
import Styles from "../constants/styles";

const Index = () =>
{
  return (
    <View style={Styles.page}>
      <View style={Styles.header}></View>
        <View style={Styles.body}>
          <SignOutButton />
        </View>
      <View style={Styles.footer}></View>
    </View>
  );
}

export default Index;