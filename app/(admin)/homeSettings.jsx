import * as ImagePicker from 'expo-image-picker';
import Carousel from 'react-native-reanimated-carousel';
import Colors from '../../constants/colors';
import { useApp } from '../../components/context';
import { AdminStyles, Styles } from '../../constants/styles';
import { Background, Loading } from '../../components/components';
import { sendMassPushNotification } from '../../components/notifComponents';
import { handleUploadHomeImage, handleGetURLs, handleRemoveHomeImage } from '../../components/adminComponents';
import { TouchableOpacity, Text, Image, View, Dimensions, Alert, TextInput, KeyboardAvoidingView } from 'react-native';
import { Ionicons, MaterialCommunityIcons, MaterialIcons } from '@expo/vector-icons';
import { useEffect, useRef, useState } from 'react';

const screenWidth = Dimensions.get("window").width;

const HomeSettings = () =>
{
    const { client } = useApp();

    const [ image, setImage ] = useState();
    const [ fileType, setFileType ] = useState();
    const [ urls, setUrls ] = useState();
    const [ loading, setLoading ] = useState(false);
    const [ currentIndex, setCurrentIndex ] = useState();
    const [ title, setTitle ] = useState();
    const [ body, setBody ] = useState();

    const carouselRef = useRef();
    const indexRef = useRef();

    const pickImage = async () =>
    {
        let result = await ImagePicker.launchImageLibraryAsync({
            mediaTypes: ['images'],
            allowsEditing: true,
            aspect: [16, 9],
            quality: 1,
        });

        if (!result.canceled) {
            setImage(result.assets[0].uri);
            setFileType(result.assets[0].mimeType.split('/').pop());
        }
    };

    useEffect(() => {
        const initUrls = async () =>
        {
            const getUrls = await handleGetURLs();
            setUrls(getUrls);
        }

        initUrls();
    }, []);

    return (
        <>
        { !loading ? (
            <KeyboardAvoidingView
                behavior='height'
                style={{flex: 1}}
            >
                <Background>
                    <View style={Styles.block}>
                        <View style={[Styles.infoContainer, {rowGap: 0}]}>
                            <Text style={Styles.subTitle}>Current Images</Text>
                            <Text style={Styles.text}>Preview of images currently on the home screen</Text>
                        </View>
                        { urls ? (
                            <>
                                <View style={AdminStyles.imgPickContainer}>
                                    <Carousel
                                        ref={carouselRef}
                                        data={urls}
                                        width={screenWidth * 0.9}
                                        height={225}
                                        autoPlay
                                        autoPlayInterval={5000}
                                        onProgressChange={(_, absoluteProgress) => {
                                            const roundedIndex = Math.round(absoluteProgress);
                                            if (roundedIndex !== indexRef.current) {
                                                indexRef.current = roundedIndex;
                                                setCurrentIndex(roundedIndex);
                                            }
                                        }}
                                        renderItem={({item}) => (
                                            <Image
                                                source={{uri: item.url}}
                                                style={{width: '100%', height: '100%'}}
                                            />
                                        )}
                                    />
                                </View>
                                <TouchableOpacity
                                    style={[Styles.actionButton, {alignSelf: 'center', backgroundColor: 'red'}]}
                                    onPress={() => {
                                        Alert.alert(
                                            'Remove Image',
                                            'Are you sure you want to remove this image',
                                            [
                                                { text: 'No'},
                                                {
                                                    text: 'Yes',
                                                    onPress: async () => {
                                                        if (loading) return;
                                                        setLoading(true);
                                                        const imageUrl = urls?.[currentIndex]?.url;
                                                        if (!imageUrl) return;
                                                        await handleRemoveHomeImage(imageUrl);
                                                        setLoading(false);
                                                    }
                                                }
                                            ]
                                        )
                                    }}
                                >
                                    <Text style={Styles.actionText}>Remove</Text>
                                </TouchableOpacity>
                            </>
                        ) : null}
                    </View>
                    <View style={Styles.block}>
                        <View style={[Styles.infoContainer, {rowGap: 0}]}>
                            <Text style={Styles.subTitle}>Image Upload</Text>
                            <Text style={Styles.text}>Upload an image to appear on the home screen for customers</Text>
                        </View>
                        <View style={AdminStyles.imgPickContainer}>
                            {image ? (
                                <Image source={{ uri: image }} style={AdminStyles.imgPick}/>
                            ) : (
                                <TouchableOpacity
                                    style={AdminStyles.noImg}
                                    onPress={pickImage}
                                    disabled={loading}
                                >
                                    <MaterialCommunityIcons name='image-plus' size={50} />
                                </TouchableOpacity>
                            )}
                        </View>
                        <TouchableOpacity
                            style={[Styles.actionButton, image && {backgroundColor: Colors.secondary}, loading && {opacity: 0.5}, {alignSelf: 'center'}]}
                            disabled={loading}
                            onPress={async () => {
                                if (loading) return;
                                setLoading(true);
                                if (image) {
                                    await handleUploadHomeImage(image, fileType);
                                } else {
                                    await pickImage();
                                }
                                setLoading(false);
                            }}
                        >
                            <Text style={Styles.actionText}>
                                { image ? 'Upload Image' : 'Pick Image'}
                            </Text>
                        </TouchableOpacity>
                    </View>
                    <View style={Styles.block}>
                        <View style={[Styles.infoContainer, {rowGap: 0}]}>
                            <Text style={Styles.subTitle}>Send Notification</Text>
                            <Text style={Styles.text}>Send a push notification to all users</Text>
                        </View>
                        <View style={Styles.inputContainer}>
                            <View style={Styles.inputWrapper}>
                                <Ionicons name='notifications' size={20} style={Styles.icon} />
                                <TextInput
                                    placeholder='Title'
                                    placeholderTextColor={Colors.text}
                                    value={title}
                                    onChangeText={setTitle}
                                    style={Styles.input}
                                />
                            </View>
                            <View style={Styles.inputWrapper}>
                                <MaterialIcons name='subject' size={20} style={Styles.icon} />
                                <TextInput
                                    placeholder='Body'
                                    placeholderTextColor={Colors.text}
                                    value={body}
                                    onChangeText={setBody}
                                    style={Styles.input}
                                />
                            </View>
                        </View>
                        <TouchableOpacity
                            onPress={async () => {
                                if (loading) return;
                                setLoading(true);
                                Alert.alert(
                                    'Confirmation',
                                    `Send this notification?\n\n${title}\n${body}`,
                                    [
                                        { text: 'No'},
                                        {
                                            text: 'Yes',
                                            onPress: async () => {
                                                const data = {
                                                    type: "CUSTOM_NOTIFICATION"
                                                };
                                                await sendMassPushNotification(client, title, body, data);
                                            }
                                        }
                                    ]
                                )
                                setLoading(false);
                            }}
                            style={[Styles.actionButton, {alignSelf: 'center'}, loading && {opacity: 0.5}]}
                            disabled={loading}
                        >
                            <Text style={Styles.actionText}>Send</Text>
                        </TouchableOpacity>
                    </View>
                </Background>
            </KeyboardAvoidingView>
        ) : (
            <Loading/>
        )}
        </>
    );
}

export default HomeSettings;