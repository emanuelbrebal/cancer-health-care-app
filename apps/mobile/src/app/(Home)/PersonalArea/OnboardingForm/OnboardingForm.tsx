import React from 'react';
import { View, Text, Image, TouchableOpacity, StyleSheet, ScrollView } from 'react-native';
import { Feather } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';
import { baseText, globalStyles } from '@/src/styles/global';
import { InputWithIcon } from '@/src/components/ui/Inputs/InputWithIcon';

export default function OnboardingProfileScreen() {
  return (
    <LinearGradient
      colors={['#E5B2FF', '#F9F5FF', '#FFFFFF']}
      style={globalStyles.dynamicContent}
    >
      <ScrollView contentContainerStyle={[globalStyles.scrollContainer, styles.paddingGeral]}>
        
        {/* Header */}
        <View style={styles.header}>
          <TouchableOpacity>
            <Feather name="arrow-left" size={24} color="#FFFFFF" />
          </TouchableOpacity>
          <Text style={styles.headerTitle}>Editar Perfil</Text>
        </View>

        {/* Avatar Section */}
        <View style={styles.avatarContainer}>
          <View style={styles.avatarWrapper}>
            <Image 
              source={{ uri: 'https://i.pravatar.cc/150?img=47' }} 
              style={styles.avatarImage} 
            />
            <TouchableOpacity style={styles.addBadge}>
              <Feather name="plus" size={16} color="#FFFFFF" />
            </TouchableOpacity>
          </View>
        </View>

        {/* Formulário usando seus estilos globais */}
        <View style={globalStyles.formContainer}>
          
          <View style={styles.inputGroup}>
            <Text style={styles.label}>Como deseja ser tratada?</Text>
            {/* O ideal aqui seria um componente de Select/Dropdown, mas usamos seu Input adaptado */}
            <InputWithIcon 
              iconLeftName="user" 
              iconRightName="chevron-down"
              placeholder="Seu pronome"
            />
          </View>

          <View style={styles.inputGroup}>
            <Text style={styles.label}>Digite seu nome:</Text>
            <InputWithIcon 
              iconLeftName="user" 
              placeholder="Seu nome"
            />
          </View>

          <View style={styles.inputGroup}>
            <Text style={styles.label}>Digite telefone:</Text>
            <InputWithIcon 
              iconLeftName="phone" 
              placeholder="(12) 9 9765-4321"
              keyboardType="phone-pad"
            />
          </View>

          <View style={styles.inputGroup}>
            <Text style={styles.label}>Data de nascimento</Text>
            <InputWithIcon 
              iconLeftName="calendar" 
              placeholder="Dia/Mês/Ano"
            />
          </View>

        </View>

        {/* Botões de Ação */}
        <View style={styles.actionsContainer}>
          <TouchableOpacity style={styles.primaryButton}>
            <Text style={styles.primaryButtonText}>Salvar Informações</Text>
          </TouchableOpacity>

          <TouchableOpacity style={styles.skipButton}>
            <Text style={styles.skipButtonText}>Pular</Text>
          </TouchableOpacity>
        </View>

      </ScrollView>
    </LinearGradient>
  );
}

const styles = StyleSheet.create({
  paddingGeral: {
    paddingHorizontal: 20,
    paddingBottom: 40,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    width: '100%',
    paddingTop: 10,
    paddingBottom: 30,
  },
  headerTitle: {
    ...baseText,
    color: '#FFFFFF',
    fontSize: 18,
    fontWeight: 'bold',
  },
  avatarContainer: {
    alignItems: 'center',
    marginBottom: 30,
  },
  avatarWrapper: {
    position: 'relative',
  },
  avatarImage: {
    width: 100,
    height: 100,
    borderRadius: 50,
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
  inputGroup: {
    width: '100%',
    marginBottom: 5,
  },
  label: {
    ...baseText,
    color: '#333333',
    fontSize: 14,
    marginBottom: 8,
    fontWeight: '500',
  },
  actionsContainer: {
    marginTop: 40,
    alignItems: 'center',
    width: '100%',
  },
  primaryButton: {
    backgroundColor: '#9B51E0', 
    width: '100%',
    paddingVertical: 16,
    borderRadius: 25,
    alignItems: 'center',
    marginBottom: 20,
  },
  primaryButtonText: {
    ...baseText,
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: 'bold',
  },
  skipButton: {
    paddingVertical: 10,
  },
  skipButtonText: {
    ...baseText,
    color: '#9B51E0',
    fontSize: 14,
    fontWeight: '600',
  },
});