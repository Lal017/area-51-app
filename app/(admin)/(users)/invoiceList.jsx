import { Text, TouchableOpacity } from 'react-native';
import { useLocalSearchParams } from 'expo-router';
import { Background } from '../../../components/components';
import { handleGetUrl, handleListInvoices } from '../../../components/adminComponents';
import { useEffect, useState } from 'react';
import { Styles, AdminStyles } from '../../../constants/styles';
import { openURL } from 'expo-linking';

const InvoiceList = () =>
{
    const { userParam } = useLocalSearchParams();
    const customer = JSON.parse(userParam);

    const [ invoices, setInvoices ] = useState();

    useEffect(() => {
        const initInvoices = async () =>
        {
            const getInvoices = await handleListInvoices(customer.identityId);
            setInvoices(getInvoices);
        }

        initInvoices();
    }, []);

    return (
        <>
            { invoices && invoices.length > 0 ? (
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
                <Background style={{justifyContent: 'center'}}>
                    <Text style={Styles.subTitle}>No Invoices</Text>
                </Background>
            )}
        </>
    );
};

export default InvoiceList;