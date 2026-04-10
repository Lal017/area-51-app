import { useApp } from "./useApp";
import { handleGetCurrentUser } from "../services/authService";

// get and set user cognito info
const useUser = () =>
{
    const { setAccess, setUserId } = useApp();

    const initUser = async () =>
    {
        try {
            const userInfo = await handleGetCurrentUser();
            const userId = userInfo.accessToken.payload.sub;
            const access_arr = userInfo.accessToken.payload["cognito:groups"];
            const access = access_arr.includes('Admins') ? 'Admins'
                : access_arr.includes('TowDrivers') ? 'TowDrivers'
                : 'Customers';
            
            setAccess(access);
            setUserId(userId);
        } catch (error) {
            console.error('useUser ERROR:', error);
            throw error;
        }
    };

    return { initUser };
};

export default useUser;