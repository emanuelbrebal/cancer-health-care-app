import React, { useState } from 'react';
import { View, Text, Image, TouchableOpacity, StyleSheet, ScrollView, KeyboardAvoidingView, Platform } from 'react-native';
import { Feather } from '@expo/vector-icons';
import { baseText, globalStyles } from '@/src/styles/global';
import { InputWithIcon } from '@/src/components/ui/Inputs/InputWithIcon';
import { SelectWithIcon } from '@/src/components/ui/Inputs/SelectWithIcon';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useAuthStore } from '@/src/store/useAuthStore';
import * as ImagePicker from 'expo-image-picker';
import api from '@/src/services/api';
import { router, useLocalSearchParams } from 'expo-router';
import { BirthdayDateInput } from '@/src/components/ui/Inputs/BirthdayDateInput';
import { PhoneInput } from '@/src/components/ui/Inputs/PhoneInput';
import { toastService } from '@/src/services/toastService';

const pronounOptions = [
  { label: 'Sr', value: 'SR' },
  { label: 'Sra', value: 'SRA' },
  { label: 'Srta', value: 'SRTA' },
  { label: 'Prefiro não informar', value: 'NOT_INFORMED' },
];

const PLACEHOLDER_AVATAR = require('@assets/images/Home/purpleMascotSunglasses.png');

function normalizeBirthday(raw: string | null | undefined): string {
  if (!raw) return '';
  if (/^\d{2}\/\d{2}\/\d{4}$/.test(raw)) return raw;
  const d = new Date(raw);
  if (isNaN(d.getTime())) return '';
  return [
    String(d.getUTCDate()).padStart(2, '0'),
    String(d.getUTCMonth() + 1).padStart(2, '0'),
    d.getUTCFullYear(),
  ].join('/');
}

export default function OnboardingProfileScreen() {
  const { firstTime } = useLocalSearchParams<{ firstTime?: string }>();
  const user = useAuthStore((s) => s.user);
  const login = useAuthStore((s) => s.login);
  const token = useAuthStore((s) => s.token);

  const [pronoun, setPronoun] = useState(user?.pronoun ?? '');
  const [name, setName] = useState(user?.name ?? '');
  const [phone, setPhone] = useState(user?.phone_number ?? '');
  const [birthday, setBirthday] = useState(() => normalizeBirthday(user?.birthday));
  const [avatarUri, setAvatarUri] = useState<string | null>(user?.profile_picture ?? null);
  const [saving, setSaving] = useState(false);

  const handlePickImage = async () => {
    const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync();
    if (status !== 'granted') {
      toastService.error('Permita o acesso à galeria nas configurações do dispositivo.');
      return;
    }
    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: true,
      aspect: [1, 1],
      quality: 0.7,
      base64: true,
    });
    if (!result.canceled && result.assets[0]) {
      const asset = result.assets[0];
      const base64 = asset.base64 ? `data:image/jpeg;base64,${asset.base64}` : null;
      setAvatarUri(base64 ?? asset.uri);
    }
  };

  const handleSave = async () => {
    if (!user?.id || !token) return;

    let birthdayISO: string | undefined;
    if (birthday) {
      const [d, m, y] = birthday.split('/').map(Number);
      const parsed = new Date(y, m - 1, d);
      if (isNaN(parsed.getTime()) || parsed >= new Date()) {
        toastService.error('Data de nascimento inválida. Informe uma data no passado.');
        return;
      }
      birthdayISO = parsed.toISOString();
    }

    setSaving(true);
    try {
      const response = await api.patch(`/users/${user.id}`, {
        name: name || undefined,
        pronoun: pronoun || undefined,
        phone_number: phone || undefined,
        birthday: birthdayISO,
        profile_picture: avatarUri || undefined,
      });
      login(token, response.data);
      toastService.success('Perfil atualizado com sucesso!');
      if (firstTime === '1') {
        router.replace('/(Home)/PersonalArea/Hub');
      } else {
        router.back();
      }
    } catch {
      toastService.error('Não foi possível salvar as alterações. Tente novamente.');
    } finally {
      setSaving(false);
    }
  };

  const avatarSource = avatarUri ? { uri: avatarUri } : PLACEHOLDER_AVATAR;

  return (
    <KeyboardAvoidingView behavior={Platform.OS === 'ios' ? 'padding' : 'height'} style={{ flex: 1 }}>
      <SafeAreaView style={globalStyles.startContainer}>
        <ScrollView
          contentContainerStyle={styles.paddingGeral}
          keyboardShouldPersistTaps="handled"
          showsVerticalScrollIndicator={false}
        >
          <View style={styles.avatarContainer}>
            <View style={styles.avatarWrapper}>
              <Image source={avatarSource} style={styles.avatarImage} />
              <TouchableOpacity style={styles.addBadge} onPress={handlePickImage}>
                <Feather name="camera" size={14} color="#FFFFFF" />
              </TouchableOpacity>
            </View>
            <Text style={styles.avatarHint}>Toque no ícone para alterar a foto</Text>
          </View>

          <View style={globalStyles.formContainer}>

            <View style={styles.inputGroup}>
              <Text style={styles.label}>Como deseja ser tratado? <Text style={styles.optional}>(opcional)</Text></Text>
              <SelectWithIcon
                data={pronounOptions}
                iconLeftName='user'
                placeholder='Pronome de tratamento'
                value={pronoun}
                onChange={(item) => setPronoun(item.value)}
              />
            </View>

            <View style={styles.inputGroup}>
              <Text style={styles.label}>Nome completo:</Text>
              <InputWithIcon
                iconLeftName="user"
                placeholder="Seu nome"
                value={name}
                onChangeText={setName}
              />
            </View>

            <View style={styles.inputGroup}>
              <Text style={styles.label}>Telefone: <Text style={styles.optional}>(opcional)</Text></Text>
              <PhoneInput value={phone} onChangeText={setPhone} />
            </View>

            <View style={styles.inputGroup}>
              <Text style={styles.label}>Data de nascimento: <Text style={styles.optional}>(opcional)</Text></Text>
              <BirthdayDateInput value={birthday} onChangeText={setBirthday} />
            </View>

          </View>

          <View style={styles.actionsContainer}>
            <TouchableOpacity style={styles.primaryButton} onPress={handleSave} disabled={saving}>
              <Text style={styles.primaryButtonText}>{saving ? 'Salvando...' : 'Salvar Informações'}</Text>
            </TouchableOpacity>
          </View>
        </ScrollView>
      </SafeAreaView>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  paddingGeral: {
    paddingBottom: 40,
    paddingHorizontal: 30,
    flexGrow: 1,
  },
  avatarContainer: {
    alignItems: 'center',
    marginBottom: 24,
    marginTop: 8,
  },
  avatarWrapper: {
    position: 'relative',
  },
  avatarImage: {
    width: 90,
    height: 90,
    borderRadius: 45,
  },
  addBadge: {
    position: 'absolute',
    bottom: 0,
    right: 0,
    backgroundColor: '#1AD5AD',
    width: 28,
    height: 28,
    borderRadius: 14,
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 2,
    borderColor: '#FFFFFF',
  },
  avatarHint: {
    marginTop: 8,
    fontSize: 12,
    color: '#888',
  },
  inputGroup: {
    width: '100%',
    marginBottom: 2,
  },
  label: {
    ...baseText,
    color: '#333333',
    fontSize: 14,
    marginBottom: 8,
    fontWeight: '500',
  },
  optional: {
    fontSize: 12,
    color: '#999',
    fontWeight: '400',
  },
  actionsContainer: {
    marginTop: 20,
    alignItems: 'center',
    width: '100%',
    paddingBottom: 40,
  },
  primaryButton: {
    backgroundColor: '#9B51E0',
    width: '100%',
    paddingVertical: 16,
    borderRadius: 25,
    alignItems: 'center',
  },
  primaryButtonText: {
    ...baseText,
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: 'bold',
  },
});
