import { forwardRef, useEffect } from 'react';
import { View } from 'react-native';

// Stub web: lottie-react-native exige @lottiefiles/dotlottie-react no web.
// A splash apenas encerra a animação para seguir o fluxo normal.
const LottieView = forwardRef<View, { onAnimationFinish?: (isCancelled: boolean) => void; style?: any }>(
  function LottieView({ onAnimationFinish, style }, ref) {
    useEffect(() => {
      const timer = setTimeout(() => onAnimationFinish?.(false), 0);
      return () => clearTimeout(timer);
    }, [onAnimationFinish]);
    return <View ref={ref} style={style} />;
  },
);

export default LottieView;
