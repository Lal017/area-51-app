import { handleGetVehicles } from "../services/vehicleService";
import { useApp } from "./useApp";

const useVehicle = (newAppointments) =>
{
    const { client, userId, setVehicles, setVehiclePickup, appointments } = useApp();

    const initVehicles = async () =>
    {
        // get vehicleIds that have an appointment scheduled for pickup
        const scheduledVehiclePickups = (newAppointments ?? appointments)
            ?.filter(appt => appt.service === 'Vehicle Pickup')
            .map(appt => appt.vehicle?.id);

        // set vehicles
        const getVehicles = await handleGetVehicles(client, userId);
        setVehicles(getVehicles);

        // filter out vehicles that already have a scheduled pickup appointment
        const filterVehicles = getVehicles
            ?.filter(item => item.readyForPickup === true)
            .filter(item => !scheduledVehiclePickups?.includes(item.id));
            
        setVehiclePickup(filterVehicles);
    }

    return { initVehicles };
};

export default useVehicle;