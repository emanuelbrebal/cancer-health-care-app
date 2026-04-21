import React from 'react';
import { View, StyleSheet } from 'react-native';
import { AccordionMedia } from './MediaAccordion';

export interface MediaItem {
  id: string;
  title: string;
  url: any;
  description?: string;
  series?: number;
  reps?: string;
}

export interface MediaListProps {
  items: MediaItem[];
}

export function MediaList({ items }: MediaListProps) {
  if (!items || items.length === 0) return null;

  return (
    <View style={styles.container}>
      {items.map((item) => (
        <AccordionMedia
          key={item.id}
          title={item.title}
          url={item.url}
          description={item.description}
          series={item.series}
          reps={item.reps}
        />
      ))}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    width: '100%',
  }
});
