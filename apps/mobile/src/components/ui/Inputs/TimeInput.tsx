import { Platform, StyleSheet, TextInput, View, Text } from 'react-native';
import { Feather } from '@expo/vector-icons';
import { Colors } from '@/src/constants/Colors';

interface TimeInputProps {
  value: string;
  onChangeText: (text: string) => void;
  label?: string;
  placeholder?: string;
  error?: string;
}

function applyTimeMask(raw: string): string {
  const digits = raw.replace(/\D/g, '').slice(0, 4);
  if (digits.length <= 2) return digits;
  const h = Math.min(Number(digits.slice(0, 2)), 23).toString().padStart(2, '0');
  const m = digits.slice(2);
  const validM = m.length === 2 ? Math.min(Number(m), 59).toString().padStart(2, '0') : m;
  return `${h}:${validM}`;
}

export function TimeInput({ value, onChangeText, label, placeholder = 'HH:MM', error }: TimeInputProps) {
  const handleChange = (text: string) => {
    onChangeText(applyTimeMask(text));
  };

  return (
    <View>
      {label ? <Text style={styles.label}>{label}</Text> : null}
      <View style={[styles.inputRow, error ? styles.inputRowError : null]}>
        <Feather name="clock" size={18} color={error ? '#FF4C4C' : Colors.purplePrimary} style={styles.icon} />
        <TextInput
          style={styles.input}
          value={value}
          onChangeText={handleChange}
          placeholder={placeholder}
          placeholderTextColor="#A0A0A0"
          keyboardType="numeric"
          maxLength={5}
        />
      </View>
      {error ? <Text style={styles.errorText}>{error}</Text> : null}
    </View>
  );
}

const styles = StyleSheet.create({
  label: {
    fontFamily: 'Montserrat',
    fontSize: 14,
    fontWeight: '600',
    color: '#444',
    marginBottom: 10,
    marginLeft: 4,
  },
  inputRow: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#FFF',
    borderRadius: 12,
    borderWidth: 1,
    borderColor: Colors.purplePrimary,
    paddingHorizontal: 14,
    paddingVertical: Platform.OS === 'ios' ? 14 : 12,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 2,
    elevation: 1,
  },
  inputRowError: {
    borderColor: '#FF4C4C',
    borderWidth: 1.5,
  },
  icon: {
    marginRight: 10,
  },
  input: {
    flex: 1,
    fontSize: 16,
    fontFamily: 'Montserrat',
    color: '#333',
  },
  errorText: {
    fontFamily: 'Montserrat',
    fontSize: 12,
    color: '#FF4C4C',
    marginTop: 4,
    marginLeft: 4,
  },
});
