import { View, Text, StatusBar, ScrollView } from "react-native";
import { Styles } from "../../../constants/styles";

// Home page after login
const Index = () =>
{
  return (
    <ScrollView contentContainerStyle={[Styles.page, {justifyContent: 'flex-start'}]}>
      <StatusBar hidden={true}/>
    </ScrollView>
  );
}

export default Index;