import React from 'react';
import { View, Text, StyleSheet, Image } from 'react-native';
import { Feather } from '@expo/vector-icons';
import { useAuthStore } from '@/src/store/useAuthStore';

export interface UserProfileCenterProps {
  name: string;
  email: string;
  imageUrl?: string;
}

export function UserProfileCenter({ name, email, imageUrl }: UserProfileCenterProps) {
  const profilePicture = useAuthStore((s) => s.user?.profile_picture);
  const src = imageUrl ?? profilePicture;

  return (
    <View style={styles.profileCenter}>
      <View style={styles.imageContainer}>
        {src ? (
          <Image source={{ uri: src }} style={styles.profileImageLarge} />
        ) : (
          <View style={[styles.profileImageLarge, styles.avatarPlaceholder]}>
            <Feather name="user" size={40} color="#BBB" />
          </View>
        )}
      </View>
      <Text style={styles.profileNameLarge}>{name}</Text>
      <Text style={styles.profileEmail}>{email}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  profileCenter: {
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 20,
    width: '100%',
  },
  imageContainer: {
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.1,
    shadowRadius: 10,
    elevation: 5, 
    marginBottom: 16,
  },
  profileImageLarge: {
    width: 100,
    height: 100,
    borderRadius: 50,
    borderWidth: 3,
    borderColor: '#FFF',
  },
  avatarPlaceholder: {
    backgroundColor: '#F5F5F5',
    borderWidth: 2,
    borderColor: '#E0E0E0',
    justifyContent: 'center',
    alignItems: 'center',
  },
  profileNameLarge: {
    fontSize: 22,
    fontWeight: '800',
    color: '#333',
    marginBottom: 4,
  },
  profileEmail: {
    fontSize: 15,
    color: '#777',
    fontWeight: '400',
  },
});