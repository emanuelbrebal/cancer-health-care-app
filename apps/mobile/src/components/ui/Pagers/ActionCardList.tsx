import React from 'react';
import { StyleSheet, View, Text, TouchableOpacity, FlatList, StyleProp, ViewStyle } from 'react-native';
import { Colors } from '@/src/constants/Colors'; 
import PagerHeader from './PagerHeader'; 
import { Href, router } from 'expo-router';

const COLORS = {
  textDark: '#333333', 
  textLight: '#666666', 
  chevronColor: Colors.lilacPrimary,
  cardBg: '#F7F7F7', 
};

export interface BaseActionItem {
  id: string | number;
  title: string;
  subtitle?: string;
  route?: Href;
  action?: () => void;
  textColor?: string;
}

interface ActionCardListProps<T extends BaseActionItem> {
  headerTitle?: string;
  description?: string;
  data: T[];
  containerStyle?: StyleProp<ViewStyle>;
}

export default function ActionCardList<T extends BaseActionItem>({ 
  headerTitle, 
  description, 
  data, 
  containerStyle 
}: ActionCardListProps<T>) {

  const handlePress = (item: T) => {
    if (item.action) {
      item.action();
    } else if (item.route) {
      router.push(item.route);
    }
  };

  const renderActionItem = (item: T) => (
    <TouchableOpacity
      style={styles.actionItem}
      onPress={() => handlePress(item)}
      activeOpacity={0.7}
    >
      <View style={styles.textContainer}>
        <Text style={[styles.titleText, item.textColor ? { color: item.textColor } : {}]}>{item.title}</Text>
        {item.subtitle && <Text style={styles.subtitleText}>{item.subtitle}</Text>}
      </View>
      <Text style={styles.chevron}>›</Text>
    </TouchableOpacity>
  );

  return (
    <View style={[styles.container, containerStyle]}>
      {headerTitle && <PagerHeader title={headerTitle} />}
      {description && <Text style={styles.descriptionText}>{description}</Text>}
      
      <FlatList
        data={data}
        keyExtractor={(item) => item.id.toString()}
        scrollEnabled={false} 
        contentContainerStyle={{ gap: 12 }}
        renderItem={({ item }) => renderActionItem(item)}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    paddingVertical: 16,
  },
  actionItem: {
    width: '100%',
    backgroundColor: COLORS.cardBg, 
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingVertical: 14,
    paddingHorizontal: 16,
    borderRadius: 12,
  },
  textContainer: {
    flex: 1,
  },
  titleText: {
    fontSize: 16,
    fontWeight: '500',
    color: COLORS.textDark,
  },
  subtitleText: {
    fontSize: 13,
    color: COLORS.textLight,
    marginTop: 2,
  },
  chevron: {
    fontSize: 22,
    color: COLORS.chevronColor, 
    fontWeight: '600',
    marginLeft: 12,
  },
  descriptionText: {
    fontSize: 14,
    color: COLORS.textLight,
    marginBottom: 16,
    paddingHorizontal: 4,
    lineHeight: 20,
  }
});