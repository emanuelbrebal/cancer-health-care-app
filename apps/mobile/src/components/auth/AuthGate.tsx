import { Feather } from '@expo/vector-icons';
import { router } from 'expo-router';
import { useHeaderHeight } from 'expo-router/react-navigation';
import { Image, ImageSourcePropType, ScrollView, StyleSheet, Text, View } from 'react-native';
import { Button } from '@/src/components/ds/Button';
import { color, iconSize, layout, radius, space, typography } from '@/src/constants/tokens';

interface AuthGateProps {
  title: string;
  description: string;
  benefits: string[];
  image: ImageSourcePropType;
  mirrorImage?: boolean;
}

/**
 * Tela exibida nas áreas que exigem conta (Mascote, Meu Perfil).
 * Deixa explícita a fronteira público/privado e oferece o caminho de volta ao conteúdo aberto (P14).
 */
export function AuthGate({ title, description, benefits, image, mirrorImage }: AuthGateProps) {
  const headerHeight = useHeaderHeight();

  return (
    <ScrollView contentContainerStyle={[styles.content, { paddingTop: headerHeight }]}>
      <Image
        source={image}
        style={[styles.image, mirrorImage && styles.mirror]}
        resizeMode="contain"
        accessible={false}
      />

      <View style={styles.lockBadge}>
        <Feather name="lock" size={iconSize.sm} color={color.text.brandStrong} />
        <Text style={styles.lockText}>Área com login</Text>
      </View>

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
        <Button
          title="Continuar sem conta"
          variant="ghost"
          onPress={() => router.navigate('/(Home)')}
          accessibilityHint="Volta ao Início; Oncologia e Saúde Mental são abertas"
          fullWidth
        />
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  content: {
    paddingHorizontal: space.md,
    paddingBottom: layout.tabBarHeight + space.xl * 2,
    alignItems: 'center',
    gap: space.sm,
    width: '100%',
    maxWidth: layout.maxContentWidth,
    alignSelf: 'center',
  },
  image: {
    width: layout.mascotMd,
    height: layout.mascotMd,
  },
  mirror: {
    transform: [{ scaleX: -1 }],
  },
  lockBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: space.xxs,
    backgroundColor: color.bg.brandMuted,
    paddingHorizontal: space.sm,
    paddingVertical: space.xxs,
    borderRadius: radius.pill,
  },
  lockText: {
    ...typography.smallStrong,
    color: color.text.brandStrong,
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
