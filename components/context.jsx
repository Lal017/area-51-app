import { createContext, useContext, useState } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';

const AppContext = createContext();

const AppProvider = ({ children }) => {
  const [ userId, setUserId ] = useState();
  const [ client, setClient ] = useState();
  const [ pushToken, setPushToken ] = useState();
  const [ access, setAccess ] = useState();
  const [ notification, setNotification ] = useState();
  const [ email, setEmail ] = useState();
  const [ firstName, setFirstName ] = useState();
  const [ lastName, setLastName ] = useState();
  const [ phoneNumber, setPhoneNumber ] = useState();
  const [ vehicles, setVehicles ] = useState();
  const [ towRequest, setTowRequest ] = useState(undefined);
  const [ isStuck, setIsStuck ] = useState(false);

  const updateNotification = async (newNotif) =>
  {
    try {
      if (newNotif) {
        await AsyncStorage.setItem('notification', JSON.stringify(newNotif));
      } else {
        await AsyncStorage.removeItem('notification');
      }
      setNotification(newNotif);
    } catch (error) {
      console.error('error updating notification:', error);
    }
  };

  const clearNotification = async () =>
  {
    try {
      await AsyncStorage.removeItem('notification');
      setNotification(null);
    } catch (error) {
      console.error('error clearing notification:', error);
    }
  };

  return (
    <AppContext.Provider value={{
        userId,
        setUserId,
        client,
        setClient,
        pushToken,
        setPushToken,
        access,
        setAccess,
        notification,
        setNotification: updateNotification,
        clearNotification,
        email,
        setEmail,
        firstName,
        setFirstName,
        lastName,
        setLastName,
        phoneNumber,
        setPhoneNumber,
        vehicles,
        setVehicles,
        towRequest,
        setTowRequest,
        isStuck,
        setIsStuck
        }}>
      {children}
    </AppContext.Provider>
  );
};

const useApp = () =>
{
    return useContext(AppContext);
}

export { AppProvider, useApp };
