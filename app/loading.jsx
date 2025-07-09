import LottieView from "lottie-react-native";
import { Background } from "../components/components";

const LoadingPage = () => {

    return (
        <Background style={{justifyContent: 'center'}}>
            <LottieView
                source={require('../assets/animations/astronaut.json')}
                loop
                autoplay
                style={{width: 150, height: 150}}
            />
        </Background>
    );
};

export default LoadingPage;