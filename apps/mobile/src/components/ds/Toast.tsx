import { Feather } from '@expo/vector-icons';
import { StyleSheet, Text, View } from 'react-native';
import { ToastConfig, ToastConfigParams } from 'react-native-toast-message';
import { color, iconSize, layout, radius, shadow, space, typography } from '@/src/constants/tokens';

type Tone = 'success' | 'error' | 'info';

const TONES: Record<Tone, { bg: string; fg: string; icon: keyof typeof Feather.glyphMap }> = {
  success: { bg: color.bg.success, fg: color.text.success, icon: 'check-circle' },
  error: { bg: color.bg.danger, fg: color.text.danger, icon: 'alert-circle' },
  info: { bg: color.bg.info, fg: color.text.info, icon: 'info' },
};

export function ToastView({ tone, text1, text2 }: { tone: Tone; text1?: string; text2?: string }) {
  const t = TONES[tone];
  return (
    <View
      style={[styles.toast, { backgroundColor: t.bg, borderColor: t.fg }]}
      accessibilityRole="alert"
      accessibilityLiveRegion="polite"
    >
      <Feather name={t.icon} size={iconSize.lg} color={t.fg} />
      <View style={styles.texts}>
        {text1 ? <Text style={[styles.title, { color: t.fg }]}>{text1}</Text> : null}
        {text2 ? <Text style={[styles.message, { color: t.fg }]}>{text2}</Text> : null}
      </View>
    </View>
  );
}

const render = (tone: Tone) => function ToastRenderer({ text1, text2 }: ToastConfigParams<unknown>) {
  return <ToastView tone={tone} text1={text1} text2={text2} />;
};

/** Configuração do react-native-toast-message com os tokens do DS. */
export const toastConfig: ToastConfig = {
  success: render('success'),
  error: render('error'),
  info: render('info'),
};

const styles = StyleSheet.create({
  toast: {
    width: '92%',
    maxWidth: layout.maxContentWidth,
    flexDirection: 'row',
    alignItems: 'center',
    gap: space.sm,
    paddingVertical: space.sm,
    paddingHorizontal: space.sm,
    borderRadius: radius.lg,
    borderLeftWidth: space.xxs,
    ...shadow.md,
  },
  texts: {
    flex: 1,
    gap: space.xxs,
  },
  title: {
    ...typography.bodyStrong,
  },
  message: {
    ...typography.small,
  },
});
