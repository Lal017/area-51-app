import { Background, Loading } from '../../components/components';
import { handleListInvoices, handleListEstimates, handleGetUrl } from '../../components/adminComponents';
import { useApp } from '../../components/context';
import { AdminStyles, Styles } from '../../constants/styles';
import { TouchableOpacity, Text, View } from 'react-native';
import { useEffect, useState } from 'react';
import { openURL } from 'expo-linking';
import { useLocalSearchParams } from 'expo-router';
import LottieView from 'lottie-react-native';

const Documents = () =>
{
    const { identityId } = useApp();
    const { isInvoice, userParam } = useLocalSearchParams();
    const customer = userParam ? JSON.parse(userParam) : null;

    const [ documents, setDocuments ] = useState();

    useEffect(() => {
        const initDocuments = async () => {
            const getDocuments = isInvoice ? await handleListInvoices(customer ? customer?.identityId : identityId) : await handleListEstimates(customer ? customer?.identityId : identityId);
            setDocuments(getDocuments);
        };

        initDocuments();
    }, []);

    return (
        <>
            { documents && documents?.length > 0 ? (
                <Background>
                    {documents?.map((estimate, index) => {
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
            ) : documents && documents?.length === 0 ? (
                <Background>
                    <View style={[Styles.block, {alignItems: 'center'}]}>
                        <LottieView
                            source={require('../../assets/animations/no-files.json')}
                            style={{width: 300, height: 300}}
                            speed={0.75}
                            autoPlay={true}
                            loop={false}
                        />
                        <Text style={Styles.title}>{isInvoice ? 'No Invoices' : 'No Estimates'}</Text>
                    </View>
                </Background>
            ) : (
                <Loading />
            )}
        </>
    );
};

export default Documents;