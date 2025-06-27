import { TouchableOpacity, Text } from 'react-native';
import { useEffect, useState } from 'react';
import { Background, Loading } from '../../../components/components';
import { handleListInvoices } from '../../../components/adminComponents';
import { useApp } from '../../../components/context';
import { AdminStyles, Styles } from '../../../constants/styles';
import { openURL } from 'expo-linking';
import { handleGetUrl } from '../../../components/adminComponents';

const Invoices = () =>
{
    const { identityId } = useApp();

    const [ invoices, setInvoices ] = useState();

    useEffect(() => {
        const initInvoices = async () => {
            const getInvoices = await handleListInvoices(identityId);
            setInvoices(getInvoices);
        };

        initInvoices();
    }, []);

    return (
        <>
            { invoices && invoices?.length > 0 ? (
                <Background>
                    {invoices?.map((invoice, index) => {
                        const parts = invoice.path.split('/');
                        const fileName = parts[parts.length - 1];
                        return (
                            <TouchableOpacity
                                key={index}
                                onPress={async () => {
                                    const path = await handleGetUrl(invoice.path);
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
                <Loading />
            )}
        </>
    );
};

export default Invoices;