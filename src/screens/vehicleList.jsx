import { router } from 'expo-router';
import { Background, Tab } from '../../components/components';
import { useApp } from '../../components/context';
import { Styles } from '../../constants/styles';
import { Ionicons, AntDesign, MaterialCommunityIcons } from '@expo/vector-icons';

const VehicleList = () =>
{
    const { vehicles } = useApp();

    return(
        <Background>
            {vehicles?.length > 0 ? (
                vehicles.map((vehicle, index) => (
                    <Tab
                        text={`${vehicle.year} ${vehicle.make} ${vehicle.model}`}
                        action={() => router.push({
                            pathname: 'vehicleEdit',
                            params: { vehicleParam: JSON.stringify(vehicle) }
                        })}
                        leftIcon={<Ionicons name='car-sport' size={30} style={Styles.icon} />}
                        rightIcon={<AntDesign name="right" size={25} style={Styles.rightIcon} />}
                        key={index}
                    />
                ))
            ) : (
                <Tab
                    text='No Vehicles'
                    leftIcon={<MaterialCommunityIcons name="cancel" size={30} style={Styles.icon} />}    
                />
            )}
            <Tab
                text='Add'
                action={() => router.push('vehicleAdd')}
                leftIcon={<Ionicons name="add-circle" size={30} style={Styles.icon} />}
                rightIcon={<AntDesign name="right" size={25} style={Styles.rightIcon} />}  
            />
        </Background>
    );
};

export default VehicleList;