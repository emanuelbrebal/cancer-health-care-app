import { Colors } from '@/src/constants/Colors';
import { CardItem } from '@/src/interfaces/CardItem';
import { Link } from 'expo-router';
import { FlatList, Image, StyleSheet, Text, TouchableOpacity, View } from 'react-native';

interface NavigationGridProps {
  data: CardItem[];
  singleElement?: boolean
}

export default function NavigationGrid({
  data,
  singleElement = false,
}: NavigationGridProps) {

  const renderCard = ({ item }: { item: CardItem }) => (
    <Link href={item.route} asChild>
      <TouchableOpacity style={styles.card}>
        <View style={styles.iconContainer}>
          <Image
            source={item.icon? item.icon : undefined}
            style={styles.icon}
            resizeMode="contain"
          />
        </View>
        <Text style={styles.cardText}>{item.title}</Text>
      </TouchableOpacity>
    </Link>
  );

  const containerStyle = singleElement ? styles.verticalContainer : styles.container

  return (
    <View style={containerStyle}>
      <FlatList
        data={data}
        keyExtractor={(item) => item.id.toString()}
        key={singleElement ? 'one-column' : 'two-columns'}
        renderItem={renderCard}
        numColumns={singleElement ? 1 : 2}

        contentContainerStyle={styles.listContent}
        columnWrapperStyle={singleElement ? undefined : styles.columnWrapper}

        showsVerticalScrollIndicator={true}
        scrollEnabled={false}
      />
    </View>
  );
}
const styles = StyleSheet.create({
  container: {
    flex: 0,
  },
  verticalContainer: {
    flex: 0,
    flexDirection: 'column'
  },
  listContent: {
    paddingHorizontal: 5,
  },
  columnWrapper: {
    justifyContent: 'space-between',
    marginBottom: 15,
    gap: 8,
  },
  card: {
    height: 55,
    width: 'auto',
    minWidth: '49%',
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 12,
    borderRadius: 24,
    borderWidth: 2,
    borderColor: Colors.cyan,
    elevation: 2,
    shadowColor: Colors.black,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.25,
    shadowRadius: 4,
    backgroundColor: Colors.white,
    marginBottom: 7,
  },
  iconContainer: {
    width: 35,
    height: 35,
    marginRight: 8,
    backgroundColor: 'transparent',
    justifyContent: 'center',
    alignItems: 'center',
  },
  icon: {
    width: 32,
    height: 32,
  },
  cardText: {
    fontSize: 14,
    textAlign: 'center',
    flexShrink: 1,
    color: Colors.black,
    flex: 1,

  },
});