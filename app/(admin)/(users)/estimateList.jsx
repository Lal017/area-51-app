import { Text, TouchableOpacity } from 'react-native';
import { useLocalSearchParams } from 'expo-router';
import { Background } from '../../../components/components';
import { handleGetUrl, handleListEstimates } from '../../../components/adminComponents';
import { useEffect, useState } from 'react';
import { Styles, AdminStyles } from '../../../constants/styles';
import { openURL } from 'expo-linking';

const EstimateList = () =>
{
    const { userParam } = useLocalSearchParams();
    const customer = JSON.parse(userParam);

    const [ estimates, setEstimates ] = useState();

    useEffect(() => {
        const initEstimates = async () =>
        {
            const getEstimates = await handleListEstimates(customer.identityId);
            setEstimates(getEstimates);
        }

        initEstimates();
    }, []);

    return (
        <>
            { estimates && estimates.length > 0 ? (
                <Background>
                    {estimates?.map((estimate, index) => {
                        const parts = estimate.path.split('/');
                        const fileName = parts[parts.length - 1];
                        return (
                            <TouchableOpacity
                                key={index}
                                onPress={async () => {
                                    const path = await handleGetUrl(estimate.path);
                                    await openURL(path);
                                }}
                                style={AdminStyles.invoiceItem}
                            >
                                <Text style={Styles.subTitle}>{fileName}</Text>
                            </TouchableOpacity>
                        );
                    })}
                </Background>
            ) : (
                <Background style={{justifyContent: 'center'}}>
                    <Text style={Styles.subTitle}>No Estimates</Text>
                </Background>
            )}
        </>
    );
};

export default EstimateList;