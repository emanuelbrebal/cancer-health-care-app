import React, { useState } from 'react';
import { StyleSheet, Text, View } from 'react-native';
import { Dropdown } from 'react-native-element-dropdown';
import { Feather } from '@expo/vector-icons';
import { Colors } from '@/src/constants/Colors';
import { globalStyles } from '@/src/styles/global';
import { InputStyles } from '@/src/styles/Inputs';

interface ItemProps { label: string; value: string; }

interface SelectWithIconProps {
  data: ItemProps[];
  placeholder?: string;
  iconLeftName: keyof typeof Feather.glyphMap;
  value: string;
  onChange: (item: ItemProps) => void;
  error?: string;
}

export function SelectWithIcon({ data, placeholder = "Selecione...", iconLeftName, value, onChange, error }: SelectWithIconProps) {
  const [isFocus, setIsFocus] = useState(false);

  return (
    <View>
      <View style={[styles.container, isFocus && styles.focused, error ? styles.containerError : null]}>
        <Feather name={iconLeftName} size={20} color={error ? Colors.status.error : Colors.lilacPrimary} style={{ marginRight: 10 }} />

        <Dropdown
          style={{ flex: 1 }}
          containerStyle={styles.dropdownMenu}
          placeholderStyle={[globalStyles.textSecondary, { color: Colors.purpleSecondary }]}
          selectedTextStyle={[globalStyles.textSecondary, { color: Colors.purpleSecondary }]}
          itemTextStyle={styles.text}
          data={data}
          labelField="label"
          valueField="value"
          placeholder={placeholder}
          value={value}
          onFocus={() => setIsFocus(true)}
          onBlur={() => setIsFocus(false)}
          onChange={(item) => { onChange(item); setIsFocus(false); }}
          renderRightIcon={() => (
            <Feather name={isFocus ? "chevron-up" : "chevron-down"} size={20} color={Colors.purpleSecondary} />
          )}
        />
      </View>
      {error ? <Text style={InputStyles.errorText}>{error}</Text> : null}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'white',
    borderWidth: 1,
    borderColor: Colors.purpleSecondary,
    borderRadius: 12,
    paddingHorizontal: 12,
    height: 50,
    width: '100%',
  },
  containerError: {
    borderColor: Colors.status.error,
    borderWidth: 1.5,
  },
  focused: {
    borderColor: Colors.purplePrimary,
    borderWidth: 2,
  },
  text: {
    fontSize: 16,
    fontFamily: 'Montserrat',
    color: Colors.text.primary,
  },
  dropdownMenu: {
    borderRadius: 12,
    marginTop: 4,
    elevation: 5,
    shadowColor: '#000',
    shadowOpacity: 0.2,
    shadowRadius: 4,
    shadowOffset: { width: 0, height: 2 },
  },
});
