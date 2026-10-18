import React from 'react';
import { View, Text, StyleSheet, Image } from 'react-native';
import { Feather } from '@expo/vector-icons';
import { useAuthStore } from '@/src/store/useAuthStore';
import { color, iconSize, layout, radius, space, touch, typography } from '@/src/constants/tokens';

export interface UserProfileProps {
  name: string;
  email: string;
  imageUrl?: string;
}

export function UserProfileRow({ name, email, imageUrl }: UserProfileProps) {
  const profilePicture = useAuthStore((s) => s.user?.profile_picture);
  const src = imageUrl ?? profilePicture;

  return (
    <View style={styles.profileRow} accessible accessibilityLabel={`${name}, ${email}`}>
      {src ? (
        <Image source={{ uri: src }} style={styles.avatar} />
      ) : (
        <View style={[styles.avatar, styles.avatarPlaceholder]}>
          <Feather name="user" size={iconSize.lg} color={color.icon.brand} />
        </View>
      )}
      <View style={styles.profileInfo}>
        <Text style={styles.name}>{name}</Text>
        <Text style={styles.email}>{email}</Text>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  profileRow: {
    flexDirection: 'row',
    alignItems: 'center',
    width: '100%',
    gap: space.sm,
  },
  avatar: {
    width: touch.comfortable + space.xs,
    height: touch.comfortable + space.xs,
    borderRadius: radius.pill,
  },
  avatarPlaceholder: {
    backgroundColor: color.bg.brandSubtle,
    borderWidth: layout.borderHairline,
    borderColor: color.border.default,
    justifyContent: 'center',
    alignItems: 'center',
  },
  profileInfo: {
    flex: 1,
    gap: space.xxs,
  },
  name: {
    ...typography.subtitle,
    color: color.text.primary,
  },
  email: {
    ...typography.small,
    color: color.text.secondary,
  },
});
