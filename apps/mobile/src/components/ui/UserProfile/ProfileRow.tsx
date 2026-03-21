import React from 'react';
import { View, Text, StyleSheet, Image } from 'react-native';

export interface UserProfileProps {
  name: string;
  email: string;
  imageUrl?: string; 
}

export function UserProfileRow({ name, email, imageUrl }: UserProfileProps) {
  const defaultImage = 'https://i.pravatar.cc/150?img=47';

  return (
    <View style={styles.profileRow}>
      <Image
        source={{ uri: imageUrl || defaultImage }}
        style={styles.profileImageSmall}
      />
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
    width: 56, // Ligeiramente maior para harmonia visual
    height: 56,
    borderRadius: 28,
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