import { createContext, useContext, useState } from 'react';

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
        setNotification,
        email,
        setEmail,
        name,
        setName,
        phoneNumber,
        setPhoneNumber
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
