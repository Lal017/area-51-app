import { TouchableOpacity, View, Text } from "react-native";
import { ProfileStyles } from "../../constants/styles";

const Request = () =>
{

  return (
      <View style={ProfileStyles.page}>
        <TouchableOpacity
          style={ProfileStyles.actionButton}
        >
          <Text style={{color: 'white', textAlign: 'center'}}>Send</Text>
        </TouchableOpacity>
      </View>
  )
}

export default Request;