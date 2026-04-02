import AsyncStorage from '@react-native-async-storage/async-storage';
import { createContext, useContext, useState } from 'react';

const AppContext = createContext();

const AppProvider = ({ children }) => {
  const [ userId, setUserId ] = useState();
  const [ client, setClient ] = useState();
  const [ identityId, setIdentityId ] = useState();
  const [ pushToken, setPushToken ] = useState();
  const [ access, setAccess ] = useState();
  const [ email, setEmail ] = useState();
  const [ firstName, setFirstName ] = useState();
  const [ lastName, setLastName ] = useState();
  const [ phoneNumber, setPhoneNumber ] = useState();
  const [ vehicles, setVehicles ] = useState();
  const [ towRequest, setTowRequest ] = useState(undefined);
  const [ driverId, setDriverId ] = useState();
  const [ appointments, setAppointments ] = useState();
  const [ newInvoice, setNewInvoice ] = useState();
  const [ newEstimate, setNewEstimate ] = useState();
  const [ vehiclePickup, setVehiclePickup ] = useState(false);
  const [ isMissingAttr, setIsMissingAttr ] = useState(false);
  const [ customNotification, setCustomNotification ] = useState();

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
      console.error('ERROR, could not set new invoice:', error);
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
      console.error('ERROR, could not set new estimate:', error);
    }
  };

  const handleCustomNotification = async (value) =>
  {
    try {
      if (value) {
        await AsyncStorage.setItem('customNotification', JSON.stringify(value));
      } else {
        await AsyncStorage.removeItem('customNotification');
      }
      setCustomNotification(value);
    } catch (error) {
      console.error('ERROR, could not set custom notification:', error);
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
        driverId,
        setDriverId,
        appointments,
        setAppointments,
        newInvoice,
        setNewInvoice: handleNewInvoice,
        newEstimate,
        setNewEstimate: handleNewEstimate,
        vehiclePickup,
        setVehiclePickup,
        isMissingAttr,
        setIsMissingAttr,
        customNotification,
        setCustomNotification: handleCustomNotification
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
