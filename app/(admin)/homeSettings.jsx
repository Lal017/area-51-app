import * as ImagePicker from 'expo-image-picker';
import Carousel from 'react-native-reanimated-carousel';
import Colors from '../../constants/colors';
import { useApp } from '../../hooks/useApp';
import { AdminStyles, Styles } from '../../constants/styles';
import { ActionButton, Background, FloatingBlock, Loading, Tab } from '../../components/components';
import { sendMassPushNotification } from '../../components/notifComponents';
import { handleUploadHomeImage, handleGetURLs, handleRemoveHomeImage } from '../../components/adminComponents';
import { TouchableOpacity, Text, Image, View, Dimensions, Alert, TextInput, KeyboardAvoidingView } from 'react-native';
import { AntDesign, Entypo, Ionicons, MaterialIcons } from '@expo/vector-icons';
import { useEffect, useRef, useState } from 'react';

const screenWidth = Dimensions.get("window").width;

const HomeSettings = () =>
{
    const { client } = useApp();

    const [ image, setImage ] = useState();
    const [ fileType, setFileType ] = useState();
    const [ urls, setUrls ] = useState();
    const [ loading, setLoading ] = useState(true);
    const [ currentIndex, setCurrentIndex ] = useState();
    const [ title, setTitle ] = useState('');
    const [ body, setBody ] = useState('');

    const carouselRef = useRef();
    const indexRef = useRef();

    const pickImage = async () =>
    {
        try {
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
        } catch (error) {
            console.error('PickImage ERROR:', error);
            throw error;
        }
    };

    useEffect(() => {
        const uploadImage = async () =>
        {
            try {
                setLoading(true);
                await handleUploadHomeImage(image, fileType);
                setImage(undefined);
                setLoading(false);
            } catch (error) {
                console.error('upload ERROR:', error);
            }
        };

        if (image) {
            uploadImage();
        }
    }, [image]);

    useEffect(() => {
        const initUrls = async () =>
        {
            try {
                const getUrls = await handleGetURLs();
                setUrls(getUrls);
                setLoading(false);
            } catch (error) {
                console.error('Error initializing homeSettings:', error);
            }
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
                <Background hasTab={false}>
                    <View style={Styles.block}>
                        <View style={Styles.infoContainer}>
                            <Text style={Styles.headerTitle}>Images</Text>
                            <Text style={Styles.tabHeader}>Preview of images currently on the home screen</Text>
                        </View>
                        { urls && (
                            <>
                                <View style={AdminStyles.imgPickContainer}>
                                    <Carousel
                                        ref={carouselRef}
                                        data={urls}
                                        width={screenWidth * 0.9}
                                        height={225}
                                        autoPlay
                                        autoPlayInterval={10000}
                                        onProgressChange={(_, absoluteProgress) => {
                                            const roundedIndex = Math.round(absoluteProgress);
                                            if (roundedIndex !== indexRef.current) {
                                                indexRef.current = roundedIndex;
                                                setCurrentIndex(roundedIndex);
                                            }
                                        }}
                                        renderItem={({item}) => (
                                            <>
                                                <Image
                                                    source={{uri: item.url}}
                                                    style={{width: '100%', height: '100%'}}
                                                />
                                                <TouchableOpacity
                                                    style={{
                                                        position: 'absolute',
                                                        right: 10, top: 10,
                                                        borderRadius: 5,
                                                        backgroundColor: Colors.error,
                                                        padding: 2
                                                    }}
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
                                                                        try {
                                                                            const imageUrl = urls?.[currentIndex]?.url;
                                                                            if (!imageUrl) return;
                                                                            await handleRemoveHomeImage(imageUrl);
                                                                        } catch (error) {
                                                                            console.error('remove image ERROR:', error);
                                                                        }
                                                                        setLoading(false);
                                                                    }
                                                                }
                                                            ]
                                                        );
                                                    }}
                                                >
                                                    <Entypo name='cross' size={35} color='white'/>
                                                </TouchableOpacity>
                                            </>
                                        )}
                                    />
                                    <TouchableOpacity
                                        style={[AdminStyles.arrow, {right: 10}]}
                                        onPress={() => carouselRef.current?.next()}
                                    >
                                        <AntDesign name='right' size={35} color='white'/>
                                    </TouchableOpacity>
                                    <TouchableOpacity
                                        style={[AdminStyles.arrow, {left: 10}]}
                                        onPress={() => carouselRef.current?.prev()}
                                    >
                                        <AntDesign name='left' size={35} color='white'/>
                                    </TouchableOpacity>
                                </View>
                            </>
                        )}
                    </View>
                    <View style={Styles.block}>
                        <View style={Styles.infoContainer}>
                            <Text style={Styles.headerTitle}>Image Upload</Text>
                            <Text style={Styles.tabHeader}>Upload an image to appear on the home screen for customers</Text>
                        </View>
                        { !image && (
                            <Tab
                                text='Upload Image'
                                leftIcon={<AntDesign name='upload' size={30} style={Styles.icon}/>}
                                action={pickImage}
                            />
                        )}
                    </View>
                    <FloatingBlock>
                        <View style={Styles.infoContainer}>
                            <Text style={Styles.headerTitle}>Send Notification</Text>
                            <Text style={Styles.tabHeader}>Send a push notification to all users</Text>
                        </View>
                        <View style={Styles.inputWrapper}>
                            <Ionicons name='notifications' size={20} style={Styles.inputIcon} />
                            <TextInput
                                placeholder='Title'
                                placeholderTextColor={Colors.grayText}
                                value={title}
                                onChangeText={setTitle}
                                style={Styles.input}
                            />
                        </View>
                        <View style={Styles.inputWrapper}>
                            <MaterialIcons name='subject' size={20} style={Styles.inputIcon} />
                            <TextInput
                                placeholder='Body'
                                placeholderTextColor={Colors.grayText}
                                value={body}
                                onChangeText={setBody}
                                style={Styles.input}
                            />
                        </View>
                        <ActionButton
                            text='Send'
                            onPress={async () => {
                                Alert.alert(
                                    'Notification Confirmation',
                                    'Would you like to send this notification to all customers?',
                                    [
                                        { text: 'No'},
                                        {
                                            text: 'Yes',
                                            onPress: async () => {
                                                if (loading) return;
                                                setLoading(true);
                                                try {
                                                    await sendMassPushNotification(client, title, body, { type: 'CUSTOM_NOTIFICATION' });
                                                    // use react native toast to show confirmation message sent
                                                    setBody('');
                                                    setTitle('');
                                                } catch (error) {
                                                    console.error(error);
                                                }
                                                setLoading(false);
                                            }
                                        }
                                    ]
                                );
                            }}
                        />
                    </FloatingBlock>
                </Background>
            </KeyboardAvoidingView>
        ) : (
            <Loading/>
        )}
        </>
    );
}

export default HomeSettings;