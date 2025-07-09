import { View, Dimensions, Text, TouchableOpacity } from 'react-native';
import { useLocalSearchParams, router } from 'expo-router';
import * as DocumentPicker from 'expo-document-picker';
import { useState } from 'react';
import { BackgroundAlt } from '../../components/components';
import { Styles, AdminStyles } from '../../constants/styles';
import { handleUploadEstimate, sendPushNotification } from '../../components/adminComponents';
import { FontAwesome6 } from '@expo/vector-icons';
import Pdf from 'react-native-pdf';

const EstimateUpload = () =>
{
    const { userParam } = useLocalSearchParams();
    const customer = JSON.parse(userParam);

    const [ estimate, setEstimate ] = useState();
    const [ name, setName ] = useState();
    const [ loading, setLoading ] = useState();

    const data = {
        type: 'NEW_ESTIMATE'
    };

    const pickEstimate = async () =>
    {
        try {
            let result = await DocumentPicker.getDocumentAsync({
                type: 'application/pdf',
                copyToCacheDirectory: true,
                multiple: false,
            });

            if (!result.canceled) {
                setName(result.assets[0].name);
                setEstimate(result.assets[0].uri);
            }
        } catch (error) {
            console.log('Error picking estimate:', error);
        }
    };

    return (
        <BackgroundAlt style={{ rowGap: 20, justifyContent: 'center'}}>
            { estimate ? (
                <View style={AdminStyles.pdfContainer}>
                    <Pdf
                        source={{uri: estimate, cache: true}}
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
                        onPress={pickEstimate}
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
                    if (estimate) {
                        await handleUploadEstimate(customer.identityId, estimate, name);
                        await sendPushNotification(customer.pushToken, 'New Estimate', 'A new estimate has been uploaded to your account', data);
                        if (router.canDismiss()) { router.dismissAll(); }
                        router.replace('/(admin)');
                    } else {
                        await pickEstimate();
                    }
                    setLoading(false);
                }}
            >
                <Text style={Styles.actionText}>
                    { estimate ? 'Upload Estimate' : 'Select Estimate'}
                </Text>
            </TouchableOpacity>
        </BackgroundAlt>
    );
};

export default EstimateUpload;