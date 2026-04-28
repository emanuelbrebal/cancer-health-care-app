import { useRef, useState } from 'react';
import { Platform, StyleSheet, TouchableOpacity, View, Text, Modal } from 'react-native';
import DateTimePicker, { DateTimePickerEvent } from '@react-native-community/datetimepicker';
import { Feather } from '@expo/vector-icons';
import { Colors } from '@/src/constants/Colors';

interface BirthdayDateInputProps {
  value: string;
  onChangeText: (text: string) => void;
  label?: string;
  placeholder?: string;
  error?: string;
}

function ddmmyyyyToDate(str: string): Date {
  const [d, m, y] = str.split('/').map(Number);
  if (d && m && y) return new Date(y, m - 1, d);
  return new Date(1990, 0, 1);
}

function dateToDDMMYYYY(date: Date): string {
  return [
    String(date.getDate()).padStart(2, '0'),
    String(date.getMonth() + 1).padStart(2, '0'),
    date.getFullYear(),
  ].join('/');
}

const MAX_DATE = new Date();

export function BirthdayDateInput({
  value,
  onChangeText,
  label,
  placeholder = 'DD/MM/AAAA',
  error,
}: BirthdayDateInputProps) {
  const [show, setShow] = useState(false);
  const [pickerDate, setPickerDate] = useState<Date>(new Date(1990, 0, 1));
  const selectedDateRef = useRef<Date>(new Date(1990, 0, 1));

  const openPicker = () => {
    const initial = value ? ddmmyyyyToDate(value) : new Date(1990, 0, 1);
    selectedDateRef.current = initial;
    setPickerDate(initial);
    setShow(true);
  };

  const handleChange = (_event: DateTimePickerEvent, selected?: Date) => {
    if (Platform.OS === 'android') {
      setShow(false);
      if (selected) onChangeText(dateToDDMMYYYY(selected));
    } else {
      if (selected) selectedDateRef.current = selected;
    }
  };

  const confirmIOS = () => {
    onChangeText(dateToDDMMYYYY(selectedDateRef.current));
    setShow(false);
  };

  return (
    <View>
      {label ? <Text style={styles.label}>{label}</Text> : null}

      <TouchableOpacity
        style={[styles.inputRow, error ? styles.inputRowError : null]}
        onPress={openPicker}
        activeOpacity={0.7}
      >
        <Feather name="calendar" size={18} color={error ? '#FF4C4C' : Colors.purplePrimary} style={styles.icon} />
        <Text style={[styles.valueText, !value && styles.placeholder]}>
          {value || placeholder}
        </Text>
        <Feather name="chevron-down" size={16} color="#A0A0A0" />
      </TouchableOpacity>

      {error ? <Text style={styles.errorText}>{error}</Text> : null}

      {Platform.OS === 'android' && show && (
        <DateTimePicker
          value={pickerDate}
          mode="date"
          display="default"
          onChange={handleChange}
          maximumDate={MAX_DATE}
        />
      )}

      {Platform.OS === 'ios' && (
        <Modal visible={show} transparent animationType="slide">
          <TouchableOpacity style={styles.backdrop} activeOpacity={1} onPress={() => setShow(false)} />
          <View style={styles.sheet}>
            <View style={styles.sheetHeader}>
              <TouchableOpacity onPress={() => setShow(false)}>
                <Text style={styles.cancelText}>Cancelar</Text>
              </TouchableOpacity>
              <Text style={styles.sheetTitle}>Data de Nascimento</Text>
              <TouchableOpacity onPress={confirmIOS}>
                <Text style={styles.confirmText}>Confirmar</Text>
              </TouchableOpacity>
            </View>
            <DateTimePicker
              value={pickerDate}
              mode="date"
              display="spinner"
              onChange={handleChange}
              maximumDate={MAX_DATE}
              style={styles.picker}
              locale="pt-BR"
              textColor="#333333"
            />
          </View>
        </Modal>
      )}
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
  icon: { marginRight: 10 },
  valueText: {
    flex: 1,
    fontSize: 16,
    fontFamily: 'Montserrat',
    color: '#333',
  },
  placeholder: { color: '#A0A0A0' },
  errorText: {
    fontFamily: 'Montserrat',
    fontSize: 12,
    color: '#FF4C4C',
    marginTop: 4,
    marginLeft: 4,
  },
  backdrop: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.35)',
  },
  sheet: {
    backgroundColor: '#FFF',
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    paddingBottom: 34,
  },
  sheetHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingVertical: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#F0F0F0',
  },
  sheetTitle: {
    fontFamily: 'Montserrat',
    fontSize: 15,
    fontWeight: '700',
    color: '#333',
  },
  cancelText: {
    fontFamily: 'Montserrat',
    fontSize: 14,
    color: '#999',
  },
  confirmText: {
    fontFamily: 'Montserrat',
    fontSize: 14,
    fontWeight: '700',
    color: Colors.purplePrimary,
  },
  picker: { width: '100%' },
});
