import * as DocumentPicker from 'expo-document-picker';
import Pdf from 'react-native-pdf';
import { ActionButton, BackgroundAlt } from '../../components/components';
import { Styles, AdminStyles } from '../../constants/styles';
import { handleUploadInvoice, handleUploadEstimate } from '../../components/adminComponents';
import { sendPushNotification } from '../../components/notifComponents';
import { View, Dimensions, Text, TouchableOpacity } from 'react-native';
import { useLocalSearchParams } from 'expo-router';
import { useState } from 'react';
import { FontAwesome6 } from '@expo/vector-icons';

const DocumentUpload = () =>
{
    const { isInvoice, userParam } = useLocalSearchParams();
    const customer = JSON.parse(userParam);

    const [ document, setDocument ] = useState();
    const [ name, setName ] = useState();

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
            console.error(`ERROR, could not pick ${DOCUMENT_TYPE}:`, error);
        }
    };

    return (
        <BackgroundAlt style={{rowGap: 20}}>
            <View style={Styles.infoContainer}>
                <Text style={Styles.headerTitle}>PDF Upload</Text>
                <Text style={Styles.tabHeader}>Upload must be a (.pdf) file extension</Text>
            </View>
            { document ? (
                <View style={{
                    overflow: 'hidden',
                    height: '65%'
                }}>
                    <Pdf
                        source={{uri: document, cache: true}}
                        onError={(error) => console.log('PDF Error: ', error)}
                        style={{width: Dimensions.get('window').width, height: Dimensions.get('window').height, flex: 1}}
                        horizontal={true}
                        enablePaging={true}
                        enableAnnotationRendering={true}
                    />
                </View>
            ) : (
                <View style={AdminStyles.imgPickContainer}>
                    <TouchableOpacity
                        style={{
                            width: '100%', height: 225,
                            borderRadius: 10,
                            backgroundColor: 'white',
                            justifyContent: 'center', alignItems: 'center'
                        }}
                        onPress={pickDocument}
                    >
                        <FontAwesome6 name="file-pdf" size={50} color="black" />
                    </TouchableOpacity>
                </View>
            )}
            <ActionButton
                text={document ? 'Upload Document' : 'Select Document'}
                onPress={async () => {
                    try {
                        if (document) {
                            if (isInvoice) {
                                await handleUploadInvoice(customer.identityId, document, name);
                            } else {
                                await handleUploadEstimate(customer.identityId, document, name);
                            }
                            await sendPushNotification(customer.pushToken, `New ${DOCUMENT_TYPE}`, `A new ${DOCUMENT_TYPE} has been uploaded to your account`, data);
                            router.replace('(admin)');
                        } else {
                            await pickDocument();
                        }
                    } catch (error) {
                        console.error(error);
                    }
                }}
            />
        </BackgroundAlt>
    );
};

export default DocumentUpload;