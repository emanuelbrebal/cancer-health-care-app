import { HorizontalBanner } from '@/src/components/ui/Images/HorizontalBanner';
import { SearchBar } from '@/src/components/ui/Inputs/SearchBar';
import RecomendationPager from '@/src/components/ui/Pagers/RecomendationPager';
import { Colors } from '@/src/constants/Colors';
import { meditationData } from '@/src/constants/mockData';
import { globalStyles } from '@/src/styles/global';
import { ScrollView, StyleSheet, Text, View } from 'react-native';

export default function Meditation() {

  return (
    <ScrollView contentContainerStyle={globalStyles.scrollContainer}
      showsVerticalScrollIndicator={true}>
      <View style={styles.container}>
        <View>
          <HorizontalBanner />
          <SearchBar />
        </View>
        <View style={globalStyles.startContainer}>
          <Text style={globalStyles.title}>O que é a meditação guiada: </Text>
          <Text style={styles.text}>Lorem, ipsum dolor sit amet consectetur adipisicing elit. Blanditiis ipsam nemo velit totam nostrum iure quod nihil rem vitae in ratione perferendis, hic doloremque praesentium magnam reprehenderit amet veniam ex! </Text>
          <RecomendationPager headerTitle='Recomendações de meditações guiadas' recomendationPagerData={meditationData} />
        </View>

      </View>
    </ScrollView >
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    gap: 20,
    backgroundColor: 'transparent',
  },
  text: {
    ...globalStyles.title,
    fontSize: 12
  },
  hyperlink: {
    ...globalStyles.textHyperlink,
    color: Colors.purplePrimary,
    textAlign: 'left'
  }
});