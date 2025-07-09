import { createContext, useContext, useState } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';

const AppContext = createContext();

const AppProvider = ({ children }) => {
  const [ userId, setUserId ] = useState();
  const [ client, setClient ] = useState();
  const [ identityId, setIdentityId ] = useState();
  const [ pushToken, setPushToken ] = useState();
  const [ access, setAccess ] = useState();
  const [ notification, setNotification ] = useState();
  const [ email, setEmail ] = useState();
  const [ firstName, setFirstName ] = useState();
  const [ lastName, setLastName ] = useState();
  const [ phoneNumber, setPhoneNumber ] = useState();
  const [ vehicles, setVehicles ] = useState();
  const [ towRequest, setTowRequest ] = useState(undefined);
  const [ appointments, setAppointments ] = useState();
  const [ isStuck, setIsStuck ] = useState(false);
  const [ newInvoice, setNewInvoice ] = useState();
  const [ newEstimate, setNewEstimate ] = useState();
  const [ vehiclePickup, setVehiclePickup ] = useState(false);

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

  const handleNewInvoice = async (value) =>
  {
    try {
      if (value) {
        await AsyncStorage.setItem('invoice', JSON.stringify(value));
      } else {
        await AsyncStorage.removeItem('invoice');
      }
      setNewInvoice(value);
    } catch (error) {
      console.error('error setting new invoice:', error);
    }
  };

  const handleNewEstimate = async (value) =>
  {
    try {
      if (value) {
        await AsyncStorage.setItem('estimate', JSON.stringify(value));
      } else {
        await AsyncStorage.removeItem('estimate');
      }
      setNewEstimate(value);
    } catch (error) {
      console.error('error setting new estimate:', error);
    }
  };

  return (
    <AppContext.Provider value={{
        userId,
        setUserId,
        client,
        setClient,
        identityId,
        setIdentityId,
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
        setIsStuck,
        appointments,
        setAppointments,
        newInvoice,
        setNewInvoice: handleNewInvoice,
        newEstimate,
        setNewEstimate: handleNewEstimate,
        vehiclePickup,
        setVehiclePickup
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
