import { TouchableOpacity, Text } from 'react-native';
import { useEffect, useState } from 'react';
import { Background, Loading } from '../../../components/components';
import { handleListEstimates } from '../../../components/adminComponents';
import { useApp } from '../../../components/context';
import { AdminStyles, Styles } from '../../../constants/styles';
import { openURL } from 'expo-linking';
import { handleGetUrl } from '../../../components/adminComponents';

const Estimates = () =>
{
    const { identityId } = useApp();

    const [ estimates, setEstimates ] = useState();

    useEffect(() => {
        const initEstimates = async () => {
            const getEstimates = await handleListEstimates(identityId);
            setEstimates(getEstimates);
        };

        initEstimates();
    }, []);

    return (
        <>
            { estimates && estimates?.length > 0 ? (
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
            ) : (<Loading />)}
        </>
    );
};

export default Estimates;