import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import { Feather, MaterialCommunityIcons, Ionicons } from '@expo/vector-icons';

export interface NavCardProps {
  title: string;
  subtitle?: string;
  icon: string;
  iconLib?: 'Feather' | 'MaterialCommunityIcons' | 'Ionicons';
  color?: string;
  bgColor?: string;
  iconBg?: string;
  borderColor?: string;
  onPress: () => void;
}

export function NavCard({
  title,
  subtitle,
  icon,
  iconLib = 'Feather',
  color = '#9B5DE0',
  bgColor = '#F5F0FA',
  iconBg = '#E9DEFA',
  borderColor = '#D2AEF0',
  onPress,
}: NavCardProps) {
  const renderIcon = () => {
    if (iconLib === 'MaterialCommunityIcons')
      return <MaterialCommunityIcons name={icon as any} size={24} color={color} />;
    if (iconLib === 'Ionicons')
      return <Ionicons name={icon as any} size={24} color={color} />;
    return <Feather name={icon as any} size={22} color={color} />;
  };

  return (
    <TouchableOpacity
      style={[styles.card, { backgroundColor: bgColor, borderColor }]}
      onPress={onPress}
      activeOpacity={0.75}
    >
      <View style={styles.content}>
        <View style={[styles.iconWrapper, { backgroundColor: iconBg }]}>
          {renderIcon()}
        </View>
        <View style={styles.textGroup}>
          <Text style={[styles.title, { color }]}>{title}</Text>
          {subtitle ? <Text style={[styles.subtitle, { color, opacity: 0.8 }]}>{subtitle}</Text> : null}
        </View>
      </View>
      <Feather name="chevron-right" size={20} color={color} style={{ opacity: 0.35 }} />
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  card: {
    width: '100%',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    borderRadius: 18,
    padding: 14,
    borderWidth: 1,
  },
  content: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
  },
  iconWrapper: {
    width: 46,
    height: 46,
    borderRadius: 14,
    justifyContent: 'center',
    alignItems: 'center',
  },
  textGroup: {
    marginLeft: 14,
    flex: 1,
  },
  title: {
    fontSize: 16,
    fontWeight: '700',
    fontFamily: 'Montserrat',
  },
  subtitle: {
    fontSize: 13,
    marginTop: 2,
    fontFamily: 'Montserrat',
  },
});
