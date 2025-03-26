import { View } from "react-native";
import { Styles } from "../../constants/styles";
import { useEffect } from 'react';
import { usePathname } from 'expo-router';
import { handlePermissions } from "../../components/notifComponents";

const Request = () =>
{
  const pathname = usePathname();
  
  useEffect(() => {
    if (pathname === '/request') {
      const initPermissions = async () => {
        try {
          await handlePermissions();
        } catch (error) {
          console.log(error);
        }
      };
  
      initPermissions();
    }
  }, [pathname]);

  return (
      <View style={Styles.RequestPage}>
      </View>
  )
}

export default Request;