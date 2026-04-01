import { Background, Loading, Tab } from '../../components/components';
import { handleListInvoices, handleListEstimates, handleGetUrl } from '../../components/adminComponents';
import { useApp } from '../../hooks/useApp';
import { Styles } from '../../constants/styles';
import { Text, View } from 'react-native';
import { useEffect, useState } from 'react';
import { openURL } from 'expo-linking';
import { useLocalSearchParams } from 'expo-router';
import LottieView from 'lottie-react-native';
import { AntDesign, FontAwesome6 } from '@expo/vector-icons';

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
                    {documents?.map((file, index) => {
                        const parts = file.path.split('/');
                        const fileName = parts[parts.length - 1];
                        return (
                            <Tab
                                key={index}
                                text={`${fileName}`}
                                leftIcon={<FontAwesome6 name='file-invoice-dollar' size={30} style={Styles.icon}/>}
                                rightIcon={<AntDesign name='right' size={30} style={Styles.rightIcon}/>}
                                action={async () => {
                                    const path = await handleGetUrl(file.path);
                                    await openURL(path);
                                }}
                            />
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