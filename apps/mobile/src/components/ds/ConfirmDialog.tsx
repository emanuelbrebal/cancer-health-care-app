import { Modal, StyleSheet, Text, View } from 'react-native';
import { color, layout, radius, shadow, space, typography } from '@/src/constants/tokens';
import { Button } from './Button';

interface ConfirmDialogProps {
  visible: boolean;
  title: string;
  message: string;
  confirmLabel: string;
  cancelLabel?: string;
  destructive?: boolean;
  loading?: boolean;
  onConfirm: () => void;
  onCancel: () => void;
}

/**
 * Confirmação antes de ações destrutivas (prevenção de erros).
 * Substitui Alert.alert, que não exibe botões no Expo Web.
 */
export function ConfirmDialog({
  visible, title, message, confirmLabel, cancelLabel = 'Cancelar', destructive, loading, onConfirm, onCancel,
}: ConfirmDialogProps) {
  return (
    <Modal visible={visible} transparent animationType="fade" onRequestClose={onCancel}>
      <View style={styles.overlay}>
        <View style={styles.dialog} accessibilityViewIsModal accessibilityRole="alert">
          <Text style={styles.title} accessibilityRole="header">{title}</Text>
          <Text style={styles.message}>{message}</Text>
          <View style={styles.actions}>
            <Button
              title={confirmLabel}
              variant={destructive ? 'danger' : 'primary'}
              onPress={onConfirm}
              loading={loading}
              fullWidth
            />
            <Button title={cancelLabel} variant="secondary" onPress={onCancel} disabled={loading} fullWidth />
          </View>
        </View>
      </View>
    </Modal>
  );
}

const styles = StyleSheet.create({
  overlay: {
    flex: 1,
    backgroundColor: color.bg.overlay,
    justifyContent: 'center',
    padding: space.md,
  },
  dialog: {
    backgroundColor: color.bg.surface,
    borderRadius: radius.xl,
    padding: space.md,
    gap: space.sm,
    width: '100%',
    maxWidth: layout.maxContentWidth,
    alignSelf: 'center',
    ...shadow.md,
  },
  title: {
    ...typography.title,
    color: color.text.primary,
  },
  message: {
    ...typography.body,
    color: color.text.secondary,
  },
  actions: {
    gap: space.xs,
    marginTop: space.xs,
  },
});
