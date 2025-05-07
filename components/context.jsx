import { createContext, useContext, useState } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';

const AppContext = createContext();

const AppProvider = ({ children }) => {
  const [ userId, setUserId ] = useState();
  const [ client, setClient ] = useState();
  const [ pushToken, setPushToken ] = useState();
  const [ access, setAccess ] = useState('Customer');
  const [ notification, setNotification ] = useState();
  const [ email, setEmail ] = useState();
  const [ name, setName ] = useState();
  const [ phoneNumber, setPhoneNumber ] = useState();
  const [ vehicles, setVehicles ] = useState();
  const [ request, setRequest ] = useState(false);

  const handleSetRequest = async (requestBool) =>
  {
    try {
      if (requestBool) {
        await AsyncStorage.setItem('request', requestBool.toString());
      } else {
        await AsyncStorage.removeItem('request');
      }
      setRequest(requestBool);
    } catch (error) {
      console.error('error setting request:', error);
    }
  };

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
      await AsyncStorage.removeItem('request');
      setNotification(null);
      setRequest(false);
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
        name,
        setName,
        phoneNumber,
        setPhoneNumber,
        vehicles,
        setVehicles,
        request,
        setRequest: handleSetRequest
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
