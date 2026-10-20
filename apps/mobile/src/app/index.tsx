import { useEffect, useRef } from 'react';
import { StatusBar } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import LottieView from 'lottie-react-native';
import * as NavigationBar from 'expo-navigation-bar';
import { router } from 'expo-router';

export default function SplashScreen() {
  const animationRef = useRef<LottieView>(null);

  useEffect(() => {
    NavigationBar.setVisibilityAsync('hidden');

    return () => {
      NavigationBar.setVisibilityAsync('visible');
    };
  }, []);

  function handleAnimationFinish() {
    NavigationBar.setVisibilityAsync('visible');
    router.replace('/(Home)');
  }

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: '#fff' }}>
      <StatusBar backgroundColor="#fff" barStyle="dark-content" />
      <LottieView
        ref={animationRef}
        source={require('../../assets/animations/lottie_citec.json')}
        onAnimationFinish={handleAnimationFinish}
        resizeMode="cover"
        style={{ width: '100%', height: '100%' }}
        autoPlay
        loop={false}
      />
    </SafeAreaView>
  );
}
