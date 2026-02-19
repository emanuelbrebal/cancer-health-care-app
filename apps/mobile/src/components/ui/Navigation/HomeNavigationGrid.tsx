import { Colors } from '@/src/constants/Colors';
import { CardItem } from '@/src/interfaces/CardItem';
import { Link } from 'expo-router';
import { FlatList, Image, StyleSheet, Text, TouchableOpacity, View } from 'react-native';


interface NavigationGridProps {
  data: CardItem[];
}

export default function HomeNavigationGrid({
  data,
}: NavigationGridProps) {

  const renderCard = ({ item }: { item: CardItem }) => (
    <Link href={item.route} asChild>
      <TouchableOpacity style={styles.card}>
        <View style={styles.iconContainer}>
          <Image
            source={item.icon}
            style={styles.icon}
            resizeMode="contain"
          />
        </View>
        <Text style={styles.cardText}>{item.title}</Text>
      </TouchableOpacity>
    </Link>
  );

  return (
    <View style={styles.container}>
      <FlatList
        data={data}
        keyExtractor={(item) => item.id}
        renderItem={renderCard}
        numColumns={2}
        contentContainerStyle={styles.listContent}
        columnWrapperStyle={styles.columnWrapper}
        showsVerticalScrollIndicator={false}
        scrollEnabled={false}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 0,
    padding: 10
  },
  listContent: {
    paddingTop: 10,
  },
  columnWrapper: {
    justifyContent: 'space-between',
    marginBottom: 15,
  },
  card: {
    backgroundColor: Colors.white,
    borderRadius: 24,
    width: '48%',
    height: 130,
    alignItems: 'center',
    justifyContent: 'center',
    padding: 8,

    elevation: 4,
    shadowColor: Colors.black,
    shadowOpacity: 0.1,
    shadowRadius: 4,
    shadowOffset: { width: 0, height: 2 },
  },
  iconContainer: {
    width: 75,
    height: 75,
    borderRadius: 20,
    backgroundColor: '#F3E5F5',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 12,
  },
  icon: {
    width: 80,
    height: 80,
  },
  cardText: {
    fontSize: 14,
    fontWeight: '600',
    color: Colors.text.primary,
    textAlign: 'center',
  },
});