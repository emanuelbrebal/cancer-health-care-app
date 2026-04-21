import React from 'react';
import { View, Text, StyleSheet, Image } from 'react-native';
import { Feather } from '@expo/vector-icons';
import { useAuthStore } from '@/src/store/useAuthStore';

export interface UserProfileProps {
  name: string;
  email: string;
  imageUrl?: string;
}

export function UserProfileRow({ name, email, imageUrl }: UserProfileProps) {
  const profilePicture = useAuthStore((s) => s.user?.profile_picture);
  const src = imageUrl ?? profilePicture;

  return (
    <View style={styles.profileRow}>
      {src ? (
        <Image source={{ uri: src }} style={styles.profileImageSmall} />
      ) : (
        <View style={[styles.profileImageSmall, styles.avatarPlaceholder]}>
          <Feather name="user" size={24} color="#BBB" />
        </View>
      )}
      <View style={styles.profileInfo}>
        <Text style={styles.profileNameSmall}>{name}</Text>
        <Text style={styles.profileEmail}>{email}</Text>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  profileRow: {
    flexDirection: 'row',
    alignItems: 'center',
    width: '100%', // Garante 100% da largura
  },
  profileImageSmall: {
    width: 56,
    height: 56,
    borderRadius: 28,
  },
  avatarPlaceholder: {
    backgroundColor: '#F5F5F5',
    borderWidth: 1,
    borderColor: '#E0E0E0',
    justifyContent: 'center',
    alignItems: 'center',
  },
  profileInfo: {
    flex: 1,
    marginLeft: 16,
  },
  profileNameSmall: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#333',
  },
  profileEmail: {
    fontSize: 14,
    color: '#777',
    marginTop: 2,
  },
});