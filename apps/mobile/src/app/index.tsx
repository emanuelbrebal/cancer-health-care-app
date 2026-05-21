import { useEffect, useRef } from 'react';
import { SafeAreaView, StatusBar } from 'react-native';
import LottieView from 'lottie-react-native';
import * as NavigationBar from 'expo-navigation-bar';
import { router } from 'expo-router';

export default function SplashScreen() {
  const animationRef = useRef<LottieView>(null);

  useEffect(() => {
    NavigationBar.setVisibilityAsync('hidden');
    animationRef.current?.play();

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
        autoPlay={false}
        loop={false}
      />
    </SafeAreaView>
  );
}
