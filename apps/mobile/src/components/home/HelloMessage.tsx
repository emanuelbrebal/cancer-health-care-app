import { color, layout, space, typography } from '@/src/constants/tokens';
import { useAuthStore } from '@/src/store/useAuthStore';
import { Image, StyleSheet, Text, View } from 'react-native';

export default function HelloMessage() {

  const { user } = useAuthStore();
  const firstName = user?.name?.split(' ')[0];

  return (
    <View style={styles.container}>

      <View style={styles.helloMessageContainer}>
        <Text style={styles.text} accessibilityRole="header">Olá, {firstName ?? 'que bom te ver'}!</Text>
        <Text style={styles.subtext}>Como podemos cuidar de você hoje?</Text>
      </View>

      <Image
        source={require('@assets/images/Home/blueMascotPlaceholder.png')}
        style={styles.image}
        resizeMode="contain"
        accessibilityIgnoresInvertColors
        accessible={false}
      />
    </View>
  );
}

const styles = StyleSheet.create({

  container: {
    width: '100%',
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: space.sm,
    paddingTop: space.xl + space.lg,
  },
  helloMessageContainer: {
    flex: 1,
    gap: space.xxs,
  },
  image: {
    height: layout.mascotMd,
    width: layout.mascotMd,
    transform: [{ scaleX: -1 }],
  },
  text: {
    ...typography.title,
    color: color.text.primary,
  },
  subtext: {
    ...typography.body,
    color: color.text.secondary,
  }
});
