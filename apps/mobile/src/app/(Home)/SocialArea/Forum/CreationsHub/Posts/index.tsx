import React, { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, StyleSheet, ScrollView } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';

import { Colors } from '@/src/constants/Colors';
import { globalStyles } from '@/src/styles/global';
import { SelectWithIcon } from '@/src/components/ui/Inputs/SelectWithIcon';

export default function CreatePostScreen() {
  const router = useRouter();

  // Estados baseados no Prisma: Post
  const [content, setContent] = useState('');
  const [image, setImage] = useState<string | null>(null);
  const [selectedTopicId, setSelectedTopicId] = useState<string>('');

  const handleCreate = () => {
    console.log({ content, image, selectedTopicId });
    // router.back();
  };

  const isFormValid = content.trim().length > 0 && selectedTopicId !== null;

   const postsData = [
    { label: 'Tópico livre (sem comunidade)', value: '0' },
    { label: 'Juntos venceremos', value: '1' },
    { label: 'Cuidados e avisos', value: '2' },
  ];


  return (
    <View style={globalStyles.scrollContainer}>
      <ScrollView contentContainerStyle={styles.scrollContent}>

        {/* Seleção de Tópico (Obrigatório) */}
        <View style={styles.inputGroup}>
          <Text style={styles.label}>Vincule um tópico: </Text>
          <SelectWithIcon
            data={postsData}
            placeholder="Selecione"
            iconLeftName="users"
            value={selectedTopicId}
            onChange={(item) => setSelectedTopicId(item.value)}
          />
        </View>

        <View style={styles.inputGroup}>
          <Text style={styles.label}>Conteúdo da Publicação <Text style={styles.required}>*</Text></Text>
          <TextInput
            style={[styles.input, styles.textAreaLarge]}
            placeholder="O que você quer compartilhar?"
            placeholderTextColor="#999"
            multiline
            numberOfLines={8}
            value={content}
            onChangeText={setContent}
            textAlignVertical="top"
          />
        </View>

        <TouchableOpacity style={styles.imagePickerSmall} onPress={() => console.log('Abrir galeria')}>
          <Ionicons name="image-outline" size={24} color={Colors.purpleSecondary} />
          <Text style={styles.imagePickerTextSmall}>Anexar Imagem (Opcional)</Text>
        </TouchableOpacity>

      </ScrollView>

      <View style={styles.footer}>
        <TouchableOpacity
          style={[styles.primaryButton, !isFormValid && styles.buttonDisabled]}
          disabled={!isFormValid}
          onPress={handleCreate}
        >
          <Text style={styles.primaryButtonText}>Publicar</Text>
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
  textAreaLarge: {
    height: 180,
    paddingTop: 12,
  },
  charCount: {
    textAlign: 'right',
    fontSize: 12,
    color: '#999',
    marginTop: 4,
    fontFamily: 'Montserrat',
  },
  selectorButton: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    backgroundColor: '#FFF',
    borderWidth: 1,
    borderColor: '#CCC',
    borderRadius: 8,
    paddingHorizontal: 15,
    paddingVertical: 14,
  },
  selectorText: {
    fontSize: 16,
    fontFamily: 'Montserrat',
    color: '#333',
  },
  placeholderText: {
    color: '#999',
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
});