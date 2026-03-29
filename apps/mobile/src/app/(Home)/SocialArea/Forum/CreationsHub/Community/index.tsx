import React, { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, StyleSheet, ScrollView } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';

// Ajuste os caminhos conforme o seu projeto
import { Colors } from '@/src/constants/Colors';
import { globalStyles } from '@/src/styles/global';
import { SelectWithIcon } from '@/src/components/ui/Inputs/SelectWithIcon';

export default function CreateCommunityScreen() {
  const router = useRouter();

  // Estados baseados no seu model Prisma
  const [name, setName] = useState('');
  const [description, setDescription] = useState('');
  const [image, setImage] = useState<string | null>(null);
  const [selectedTopicId, setSelectedTopicId] = useState<string>('');


  const handleCreate = () => {
    console.log({ name, description, image });
  };
  const topicsData = [
    { label: 'Tópico livre (sem comunidade)', value: '0' },
    { label: 'Juntos venceremos', value: '1' },
    { label: 'Cuidados e avisos', value: '2' },
  ];

  return (
    <View style={[globalStyles.scrollContainer, { marginTop: 60, paddingHorizontal: 0 }]}>
      <ScrollView contentContainerStyle={styles.scrollContent}>

        <View style={globalStyles.formContainer}>
          <View style={styles.inputGroup}>
            <Text style={styles.label}>Nome da Comunidade <Text style={styles.required}>*</Text></Text>
            <TextInput
              style={styles.input}
              placeholder="Ex: Vencendo Juntos"
              placeholderTextColor="#999"
              maxLength={150}
              value={name}
              onChangeText={setName}
            />
          </View>

          <View style={styles.inputGroup}>
            <Text style={styles.label}>Vincule um tópico: </Text>
            <SelectWithIcon
              data={topicsData}
              placeholder="Vincule uma comunidade..."
              iconLeftName="users"
              value={selectedTopicId}
              onChange={(item) => setSelectedTopicId(item.value)}
            />
          </View>

          <View style={styles.inputGroup}>
            <Text style={styles.label}>Descrição (Opcional)</Text>
            <TextInput
              style={[styles.input, styles.textArea]}
              placeholder="Sobre o que é esta comunidade?"
              placeholderTextColor="#999"
              multiline
              numberOfLines={4}
              maxLength={500}
              value={description}
              onChangeText={setDescription}
              textAlignVertical="top"
            />
          </View>
        </View>
        <View style={[styles.inputGroup, {marginHorizontal: 10, width: 'auto'}]}>
          <TouchableOpacity style={styles.imagePickerSmall} onPress={() => console.log('Abrir galeria')}>
            <Ionicons name="image-outline" size={24} color={Colors.purpleSecondary} />
            <Text style={styles.imagePickerTextSmall}>Anexar Imagem (Opcional)</Text>
          </TouchableOpacity>
        </View>

      </ScrollView>

      <View style={styles.footer}>
        <TouchableOpacity
          style={[styles.primaryButton, !name && styles.buttonDisabled]}
          disabled={!name}
          onPress={handleCreate}
        >
          <Text style={styles.primaryButtonText}>Criar Comunidade</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  scrollContent: {
    padding: 20,
    paddingBottom: 40,
  },
  imagePicker: {
    width: '100%',
    height: 160,
    backgroundColor: '#E2D4F5',
    borderRadius: 12,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 25,
    borderStyle: 'dashed',
    borderWidth: 2,
    borderColor: '#9563D9',
  },
  imagePickerText: {
    fontFamily: 'Montserrat',
    color: '#9563D9',
    marginTop: 10,
    fontWeight: '600',
  },
  inputGroup: {
    marginBottom: 20,
    width: '100%',
  },
  label: {
    fontFamily: 'Montserrat',
    fontSize: 14,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 8,
  },
  required: {
    color: 'red',
  },
  input: {
    backgroundColor: '#FFF',
    borderWidth: 1,
    borderColor: '#CCC',
    borderRadius: 8,
    paddingHorizontal: 15,
    paddingVertical: 12,
    fontSize: 16,
    fontFamily: 'Montserrat',
    color: '#333',
  },
  textArea: {
    height: 120,
    paddingTop: 12,
  },
  footer: {
    padding: 20,
    backgroundColor: '#F7F5FA',
    borderTopWidth: 1,
    borderTopColor: '#EEE',
  },
  primaryButton: {
    backgroundColor: '#9563D9',
    width: '100%',
    paddingVertical: 16,
    borderRadius: 25,
    alignItems: 'center',
    elevation: 2,
  },
  buttonDisabled: {
    backgroundColor: '#CCC',
  },
  primaryButtonText: {
    fontFamily: 'Montserrat',
    color: '#FFF',
    fontSize: 16,
    fontWeight: 'bold',
  },
  imagePickerSmall: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 12,
    paddingHorizontal: 15,
    backgroundColor: '#E2D4F5',
    borderRadius: 8,
    borderStyle: 'dashed',
    borderWidth: 1,
    borderColor: '#9563D9',
    marginTop: 10,
  },
  imagePickerTextSmall: {
    fontFamily: 'Montserrat',
    color: '#9563D9',
    fontWeight: '600',
    marginLeft: 10,
  },
});