import * as DocumentPicker from 'expo-document-picker';
import Pdf from 'react-native-pdf';
import { BackgroundAlt } from '../../components/components';
import { Styles, AdminStyles } from '../../constants/styles';
import { handleUploadInvoice, handleUploadEstimate } from '../../components/adminComponents';
import { sendPushNotification } from '../../components/notifComponents';
import { View, Dimensions, Text, TouchableOpacity } from 'react-native';
import { useLocalSearchParams } from 'expo-router';
import { useState } from 'react';
import { FontAwesome6 } from '@expo/vector-icons';
import { useNavigation } from '@react-navigation/native';

const DocumentUpload = () =>
{
    const { isInvoice, userParam } = useLocalSearchParams();
    const customer = JSON.parse(userParam);
    const navigate = useNavigation();

    const [ document, setDocument ] = useState();
    const [ name, setName ] = useState();
    const [ loading, setLoading ] = useState();

    const data = {
        type: isInvoice ? 'NEW_INVOICE' : 'NEW_ESTIMATE'
    };

    const DOCUMENT_TYPE = isInvoice ? 'Invoice' : 'Estimate';
    
    const pickDocument = async () =>
    {
        try {
            let result = await DocumentPicker.getDocumentAsync({
                type: 'application/pdf',
                copyToCacheDirectory: true,
                multiple: false,
            });

            if (!result.canceled) {
                setName(result.assets[0].name);
                setDocument(result.assets[0].uri);
            }
        } catch (error) {
            console.log(`Error picking ${DOCUMENT_TYPE}:`, error);
        }
    };

    return (
        <BackgroundAlt style={{rowGap: 20, justifyContent: 'center'}}>
            { document ? (
                <View style={AdminStyles.pdfContainer}>
                    <Pdf
                        source={{uri: document, cache: true}}
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
                        onPress={pickDocument}
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
                    if (document) {
                        if (isInvoice) {
                            await handleUploadInvoice(customer.identityId, document, name);
                        } else {
                            await handleUploadEstimate(customer.identityId, document, name);
                        }
                        await sendPushNotification(customer.pushToken, `New ${DOCUMENT_TYPE}`, `A new ${DOCUMENT_TYPE} has been uploaded to your account`, data);
                        navigate.reset({
                            index: 0,
                            routes: [{ name: '(admin)' }]
                        });
                    } else {
                        await pickDocument();
                    }
                    setLoading(false);
                }}
            >
                <Text style={Styles.actionText}>
                    { document ? 'Upload Document' : 'Select Document'}
                </Text>
            </TouchableOpacity>
        </BackgroundAlt>
    );
};

export default DocumentUpload;