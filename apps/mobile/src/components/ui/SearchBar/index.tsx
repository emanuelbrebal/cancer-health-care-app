import { TextField } from '@/src/components/ds/TextField';

interface SearchBarProps {
  value: string;
  onChangeText: (text: string) => void;
  placeholder?: string;
  /** Rótulo visível do campo. */
  label?: string;
}

export default function SearchBar({ value, onChangeText, placeholder = 'Buscar...', label = 'Buscar' }: SearchBarProps) {
  return (
    <TextField
      label={label}
      icon="search"
      value={value}
      onChangeText={onChangeText}
      placeholder={placeholder}
      returnKeyType="search"
      autoCorrect={false}
      accessibilityRole="search"
    />
  );
}
