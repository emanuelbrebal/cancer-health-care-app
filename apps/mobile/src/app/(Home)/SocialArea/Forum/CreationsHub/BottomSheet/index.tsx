import React from 'react';
import { Modal, View, Text, TouchableOpacity, StyleSheet, TouchableWithoutFeedback } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';

interface CreationBottomSheetProps {
  visible: boolean;
  onClose: () => void;
}

export default function CreationBottomSheet({ visible, onClose }: CreationBottomSheetProps) {
  const router = useRouter();

  const handleNavigation = (route: string) => {
    onClose();
    setTimeout(() => {
      router.push(route as any);
    }, 150);
  };

  return (
    <Modal
      visible={visible}
      animationType="slide"
      transparent={true}
      onRequestClose={onClose}
    >
      <TouchableWithoutFeedback onPress={onClose}>
        <View style={styles.overlay} />
      </TouchableWithoutFeedback>

      <View style={styles.sheetContainer}>
        <View style={styles.handleBar} />

        <Text style={styles.sheetTitle}>O que você deseja criar?</Text>


        {/* Opção 1: Criar Comunidade (Community) */}
        <TouchableOpacity
          style={styles.optionButton}
          onPress={() => handleNavigation('/SocialArea/Forum/CreationsHub/Community')}
        >
          <View style={[styles.iconContainer, { backgroundColor: '#E2D4F5' }]}>
            <Ionicons name="people-outline" size={24} color="#9563D9" />
          </View>
          <View style={styles.optionTextContainer}>
            <Text style={styles.optionTitle}>Nova Comunidade</Text>
            <Text style={styles.optionDescription}>Crie um grupo sobre um tema específico</Text>
          </View>
          <Ionicons name="chevron-forward" size={20} color="#CCC" />
        </TouchableOpacity>

        {/* Opção 2: Criar Tópico (Topic) */}
        <TouchableOpacity
          style={styles.optionButton}
          onPress={() => handleNavigation('/SocialArea/Forum/CreationsHub/Topics')}
        >
          <View style={[styles.iconContainer, { backgroundColor: '#E2D4F5' }]}>
            <Ionicons name="chatbubbles-outline" size={24} color="#9563D9" />
          </View>
          <View style={styles.optionTextContainer}>
            <Text style={styles.optionTitle}>Novo Tópico</Text>
            <Text style={styles.optionDescription}>Inicie uma nova conversa ou dúvida</Text>
          </View>
          <Ionicons name="chevron-forward" size={20} color="#CCC" />
        </TouchableOpacity>


        {/* Opção 3: Criar Publicação (Post) */}

        <TouchableOpacity
          style={styles.optionButton}
          onPress={() => handleNavigation('/SocialArea/Forum/CreationsHub/Posts')}
        >
          <View style={[styles.iconContainer, { backgroundColor: '#E2D4F5' }]}>
            <Ionicons name="create-outline" size={24} color="#9563D9" />
          </View>
          <View style={styles.optionTextContainer}>
            <Text style={styles.optionTitle}>Nova Publicação</Text>
            <Text style={styles.optionDescription}>Compartilhe algo em um tópico existente</Text>
          </View>
          <Ionicons name="chevron-forward" size={20} color="#CCC" />
        </TouchableOpacity>
      </View>
    </Modal>
  );
}

const styles = StyleSheet.create({
  overlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.4)',
  },
  sheetContainer: {
    backgroundColor: '#FFF',
    borderTopLeftRadius: 24,
    borderTopRightRadius: 24,
    paddingHorizontal: 20,
    paddingBottom: 40,
    paddingTop: 10,
    position: 'absolute',
    bottom: 0,
    width: '100%',
    elevation: 10,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: -2 },
    shadowOpacity: 0.1,
    shadowRadius: 5,
  },
  handleBar: {
    width: 40,
    height: 5,
    backgroundColor: '#DDD',
    borderRadius: 3,
    alignSelf: 'center',
    marginBottom: 20,
  },
  sheetTitle: {
    fontFamily: 'Montserrat',
    fontSize: 20,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 20,
    textAlign: 'center',
  },
  optionButton: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 15,
    borderBottomWidth: 1,
    borderBottomColor: '#F0F0F0',
  },
  iconContainer: {
    width: 48,
    height: 48,
    borderRadius: 24,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 15,
  },
  optionTextContainer: {
    flex: 1,
  },
  optionTitle: {
    fontFamily: 'Montserrat',
    fontSize: 16,
    fontWeight: 'bold',
    color: '#1A1A1A',
    marginBottom: 4,
  },
  optionDescription: {
    fontFamily: 'Montserrat',
    fontSize: 13,
    color: '#666',
  },
});