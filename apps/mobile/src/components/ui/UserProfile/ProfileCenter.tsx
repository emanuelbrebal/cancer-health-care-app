import React from 'react';
import { View, Text, StyleSheet, Image } from 'react-native';

export interface UserProfileCenterProps {
  name: string;
  email: string;
  imageUrl?: string;
}

export function UserProfileCenter({ name, email, imageUrl }: UserProfileCenterProps) {
  const defaultImage = 'https://i.pravatar.cc/150?img=47';
  return (
    <View style={styles.profileCenter}>
      <View style={styles.imageContainer}>
        <Image
          source={{ uri: imageUrl || defaultImage }}
          style={styles.profileImageLarge}
        />
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