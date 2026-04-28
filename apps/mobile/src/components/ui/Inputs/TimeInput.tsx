import { useState } from 'react';
import { Platform, StyleSheet, TouchableOpacity, View, Text, Modal } from 'react-native';
import DateTimePicker, { DateTimePickerEvent } from '@react-native-community/datetimepicker';
import { Feather } from '@expo/vector-icons';
import { Colors } from '@/src/constants/Colors';

interface TimeInputProps {
  value: string;
  onChangeText: (text: string) => void;
  label?: string;
  placeholder?: string;
  error?: string;
}

function hhmmToDate(str: string): Date {
  const date = new Date();
  const [h, m] = str.split(':').map(Number);
  date.setHours(isNaN(h) ? 8 : h, isNaN(m) ? 0 : m, 0, 0);
  return date;
}

function dateToHHMM(date: Date): string {
  return `${String(date.getHours()).padStart(2, '0')}:${String(date.getMinutes()).padStart(2, '0')}`;
}

export function TimeInput({ value, onChangeText, label, placeholder = 'HH:MM', error }: TimeInputProps) {
  const [show, setShow] = useState(false);
  const [tempTime, setTempTime] = useState<Date>(new Date());

  const openPicker = () => {
    setTempTime(value ? hhmmToDate(value) : new Date());
    setShow(true);
  };

  const handleChange = (_event: DateTimePickerEvent, selected?: Date) => {
    if (Platform.OS === 'android') {
      setShow(false);
      if (selected) onChangeText(dateToHHMM(selected));
    } else {
      if (selected) setTempTime(selected);
    }
  };

  const confirmIOS = () => {
    onChangeText(dateToHHMM(tempTime));
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
        <Feather name="clock" size={18} color={error ? '#FF4C4C' : Colors.purplePrimary} style={styles.icon} />
        <Text style={[styles.valueText, !value && styles.placeholder]}>
          {value || placeholder}
        </Text>
        <Feather name="chevron-down" size={16} color="#A0A0A0" />
      </TouchableOpacity>

      {error ? <Text style={styles.errorText}>{error}</Text> : null}

      {Platform.OS === 'android' && show && (
        <DateTimePicker
          value={tempTime}
          mode="time"
          is24Hour
          display="default"
          onChange={handleChange}
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
              <Text style={styles.sheetTitle}>Hora Início</Text>
              <TouchableOpacity onPress={confirmIOS}>
                <Text style={styles.confirmText}>Confirmar</Text>
              </TouchableOpacity>
            </View>
            <DateTimePicker
              value={tempTime}
              mode="time"
              is24Hour
              display="spinner"
              onChange={handleChange}
              style={styles.picker}
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
