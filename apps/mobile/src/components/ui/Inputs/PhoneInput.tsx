import { Platform, StyleSheet, TextInput, View, Text } from 'react-native';
import { Feather } from '@expo/vector-icons';
import { Colors } from '@/src/constants/Colors';

interface PhoneInputProps {
  value: string;
  onChangeText: (text: string) => void;
  label?: string;
  placeholder?: string;
}

function applyPhoneMask(raw: string): string {
  const digits = raw.replace(/\D/g, '').slice(0, 11);
  if (digits.length <= 2) return `(${digits}`;
  if (digits.length <= 7) return `(${digits.slice(0, 2)}) ${digits.slice(2)}`;
  if (digits.length <= 11) return `(${digits.slice(0, 2)}) ${digits.slice(2, 7)}-${digits.slice(7)}`;
  return raw;
}

export function PhoneInput({ value, onChangeText, label, placeholder = '(82) 99999-9999' }: PhoneInputProps) {
  const handleChange = (text: string) => {
    onChangeText(applyPhoneMask(text));
  };

  return (
    <View>
      {label ? <Text style={styles.label}>{label}</Text> : null}
      <View style={styles.inputRow}>
        <Feather name="phone" size={18} color={Colors.purplePrimary} style={styles.icon} />
        <TextInput
          style={styles.input}
          value={value}
          onChangeText={handleChange}
          placeholder={placeholder}
          placeholderTextColor="#A0A0A0"
          keyboardType="phone-pad"
          maxLength={15}
        />
      </View>
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
    borderColor: '#E8E8E8',
    paddingHorizontal: 14,
    paddingVertical: Platform.OS === 'ios' ? 14 : 12,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 2,
    elevation: 1,
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
});
