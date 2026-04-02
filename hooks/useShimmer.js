import { useEffect } from "react";
import { useAnimatedStyle, useSharedValue, withRepeat, withTiming, Easing } from "react-native-reanimated";

const useShimmer = (dependency, duration = 3000) =>
{
    const shimmer = useSharedValue(-10);

    useEffect(() => {
        shimmer.value = withRepeat(
            withTiming(1, { duration, easing: Easing.inOut(Easing.ease) }),
            -1,
            false
        );
    }, [dependency]);

    const shimmerStyle = useAnimatedStyle(() => ({
        transform: [{ translateX: shimmer.value * 100 }]
    }));

    return shimmerStyle;
};

export default useShimmer;