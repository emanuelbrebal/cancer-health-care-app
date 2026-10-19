import { Feather } from '@expo/vector-icons';
import { router } from 'expo-router';
import { Image, ImageSourcePropType, StyleSheet, Text, View } from 'react-native';
import { Button } from '@/src/components/ds/Button';
import { color, iconSize, layout, space, typography } from '@/src/constants/tokens';

interface AuthGateProps {
  title: string;
  description: string;
  benefits: string[];
  image: ImageSourcePropType;
  mirrorImage?: boolean;
}

/**
 * Tela exibida nas áreas que exigem conta (Mascote, Meu Perfil).
 * Cabe na tela sem rolagem; o usuário volta ao conteúdo aberto pelas abas.
 */
export function AuthGate({ title, description, benefits, image, mirrorImage }: AuthGateProps) {
  return (
    <View style={styles.content}>
      <Image
        source={image}
        style={[styles.image, mirrorImage && styles.mirror]}
        resizeMode="contain"
        accessible={false}
      />

      <Text style={styles.title} accessibilityRole="header">{title}</Text>
      <Text style={styles.description}>{description}</Text>

      <View style={styles.benefits}>
        {benefits.map((b) => (
          <View key={b} style={styles.benefitRow}>
            <Feather name="check-circle" size={iconSize.md} color={color.text.success} />
            <Text style={styles.benefitText}>{b}</Text>
          </View>
        ))}
      </View>

      <View style={styles.actions}>
        <Button title="Entrar" onPress={() => router.push('/(auth)/LoginScreen')} fullWidth />
        <Button title="Criar conta grátis" variant="secondary" onPress={() => router.push('/(auth)/RegisterScreen')} fullWidth />
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  content: {
    flex: 1,
    justifyContent: 'center',
    paddingHorizontal: space.md,
    paddingBottom: space.md,
    alignItems: 'center',
    gap: space.sm,
    width: '100%',
    maxWidth: layout.maxContentWidth,
    alignSelf: 'center',
  },
  image: {
    width: layout.mascotLg,
    height: layout.mascotLg,
  },
  mirror: {
    transform: [{ scaleX: -1 }],
  },
  title: {
    ...typography.title,
    color: color.text.primary,
    textAlign: 'center',
  },
  description: {
    ...typography.body,
    color: color.text.secondary,
    textAlign: 'center',
  },
  benefits: {
    alignSelf: 'stretch',
    gap: space.xs,
  },
  benefitRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: space.xs,
  },
  benefitText: {
    ...typography.body,
    color: color.text.primary,
    flex: 1,
  },
  actions: {
    alignSelf: 'stretch',
    gap: space.xs,
    marginTop: space.xs,
  },
});
