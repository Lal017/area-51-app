import { View, Dimensions, Text, TouchableOpacity } from 'react-native';
import { useLocalSearchParams, router } from 'expo-router';
import * as DocumentPicker from 'expo-document-picker';
import { useState } from 'react';
import { BackgroundAlt } from '../../components/components';
import { Styles, AdminStyles } from '../../constants/styles';
import { handleUploadInvoice, sendPushNotification } from '../../components/adminComponents';
import { FontAwesome6 } from '@expo/vector-icons';
import Pdf from 'react-native-pdf';

const InvoiceUpload = () =>
{
    const { userParam } = useLocalSearchParams();
    const customer = JSON.parse(userParam);

    const [ invoice, setInvoice ] = useState();
    const [ name, setName ] = useState();
    const [ loading, setLoading ] = useState();

    const data = {
        type: 'NEW_INVOICE'
    };
    
    const pickInvoice = async () =>
    {
        try {
            let result = await DocumentPicker.getDocumentAsync({
                type: 'application/pdf',
                copyToCacheDirectory: true,
                multiple: false,
            });

            if (!result.canceled) {
                setName(result.assets[0].name);
                setInvoice(result.assets[0].uri);
            }
        } catch (error) {
            console.log('Error picking invoice:', error);
        }
    };

    return (
        <BackgroundAlt style={{paddingBottom: 50, rowGap: 20, justifyContent: 'center'}}>
            { invoice ? (
                <View style={AdminStyles.pdfContainer}>
                    <Pdf
                        source={{uri: invoice, cache: true}}
                        onError={(error) => console.log('PDF Error: ', error)}
                        style={[AdminStyles.pdf, {width: Dimensions.get('window').width, height: Dimensions.get('window').height}]}
                        horizontal={true}
                        enablePaging={true}
                        enableAnnotationRendering={true}
                    />
                </View>
            ) : (
                <View style={AdminStyles.imgPickContainer}>
                    <TouchableOpacity
                        style={AdminStyles.noImg}
                        onPress={pickInvoice}
                        disabled={loading}
                    >
                        <FontAwesome6 name="file-pdf" size={50} color="black" />
                    </TouchableOpacity>
                </View>
            ) }
            <TouchableOpacity
                style={[Styles.actionButton, loading && {opacity: 0.5}, {alignSelf: 'center'}]}
                onPress={async () =>{
                    if (loading) return;
                    setLoading(true);
                    if (invoice) {
                        await handleUploadInvoice(customer.identityId, invoice, name);
                        await sendPushNotification(customer.pushToken, 'New Invoice', 'A new invoice has been uploaded to your account', data);
                        router.replace({
                            pathname: '/(admin)/userView',
                            params: { userParam }
                        });
                    } else {
                        await pickInvoice();
                    }
                    setLoading(false);
                }}
            >
                <Text style={Styles.actionText}>
                    { invoice ? 'Upload Invoice' : 'Select Invoice'}
                </Text>
            </TouchableOpacity>
        </BackgroundAlt>
    );
};

export default InvoiceUpload;