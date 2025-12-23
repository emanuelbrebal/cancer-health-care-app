import { Link } from 'expo-router';
import { FlatList, Image, StyleSheet, Text, TouchableOpacity, View } from 'react-native';

export default function NavigationGrid() {
  // ver a lógica para pegar o usuário logado e alimentar o componente "helloMessage"
  const user = {
    name: 'Emanuel'
  }

  interface CardItem {
    id: string,
    title: string,
    image: any,
    route: any
  }

  const cardItems: CardItem[] = [
    { id: '1', title: 'Área Oncológica', image: require('@assets/images/Home/oncologyAreaIcon.png'), route: '/Oncology' },
    { id: '2', title: 'Comunidade', image: require('@assets/images/Home/communityIcon.png'), route: '/SocialArea' },
    { id: '3', title: 'Área Pessoal', image: require('@assets/images/Home/personalAreaIcon.png'), route: '/PersonalArea' },
    { id: '4', title: 'Saúde Mental', image: require('@assets/images/Home/mentalHealthIcon.png'), route: '/MentalHealth' },
  ];

  const renderCard = ({ item }) => (
    <Link href={item.route} asChild>
      <TouchableOpacity style={styles.card}>
        <View style={styles.iconContainer}>
          <Image
            source={item.image}
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
        data={cardItems}
        keyExtractor={(item) => item.id}
        renderItem={renderCard}
        numColumns={2}
        contentContainerStyle={styles.listContent}
        columnWrapperStyle={styles.columnWrapper}
        showsVerticalScrollIndicator={false}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  listContent: {
    padding: 20,
    paddingTop: 50,
  },
  columnWrapper: {
    justifyContent: 'space-between',
    marginBottom: 15,
  },
  card: {
    backgroundColor: '#FFFFFF',
    borderRadius: 24,
    width: '48%',
    height: 130,
    alignItems: 'center',
    justifyContent: 'center',
    padding: 16,

    elevation: 4,
    shadowColor: '#000',
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
    color: '#1a1a1a',
    textAlign: 'center',
  },
});