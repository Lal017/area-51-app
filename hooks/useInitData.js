import { useApp } from "./useApp";
import { handleGetUser } from "../services/userService";
import { fetchUserAttributes, fetchAuthSession } from "@aws-amplify/auth";

const useInitData = () =>
{
    const {
        client, userId,
        setDriverId, setEmail, setFirstName, setLastName,
        setIsMissingAttr, setPhoneNumber, setIdentityId
    } = useApp();

    const initData = async () =>
    {
        try {
            // get user info from database
            const user = await handleGetUser(client, userId);

            // set DriverId
            if (user?.driverId) { setDriverId(user?.driverId); }
            else { setDriverId('0'); }

            // get User Attributes
            let userAtt;
            if (!user?.email || !user?.firstName || !user?.lastName || !user?.phone || !user?.identityId) {
                userAtt = await fetchUserAttributes();
            }

            // set email
            if (!user?.email) { 
                setEmail(userAtt?.email);
            } else { setEmail(user?.email); }

            // set name
            if (!user?.firstName || !user?.lastName) {
                if (userAtt.given_name && userAtt.family_name) {
                    setFirstName(userAtt.given_name);
                    setLastName(userAtt.family_name);
                } else if (userAtt.name) {
                    const nameSplit = userAtt.name.trim().split(/\s+/);

                    if (nameSplit.length >= 2) {
                        setFirstName(nameSplit[0]);
                        setLastName(nameSplit.slice(1).join(' '));
                    } else {
                        setFirstName(nameSplit[0]);
                    }
                }

                if ((!userAtt?.given_name || !userAtt?.family_name) && !userAtt?.name) {
                    setIsMissingAttr(true);
                }
            } else { setFirstName(user?.firstName); setLastName(user?.lastName); }

            // set phone number
            if (!user?.phone) {
                setPhoneNumber(userAtt?.phone_number);
                if (!userAtt?.phone_number) {
                    setIsMissingAttr(true);
                }
            } else { setPhoneNumber(user?.phone); }

            // set identityId (for amplify storage)
            if (!user?.identityId) {
                const getDetails = await fetchAuthSession();
                setIdentityId(getDetails.identityId);
            } else { setIdentityId(user?.identityId); }
        } catch (error) {
            console.error('useInitData ERROR:', error);
        }
    };

    return { initData }
};

export default useInitData;