import DailyMessage from '@/src/components/home/DailyMessage/DailyMessage';
import { HorizontalBanner } from '@/src/components/ui/Images/HorizontalBanner';
import { SearchBar } from '@/src/components/ui/Inputs/SearchBar';
import { MediaList } from '@/src/components/ui/Media/MediaList';
import { Colors } from '@/src/constants/Colors';
import { meditationData } from '@/src/constants/Mocks/mockDataOncologyRecomendations';
import { globalStyles } from '@/src/styles/global';
import { ScrollView, StyleSheet, Text, View } from 'react-native';

export default function Meditation() {

  return (
    <ScrollView contentContainerStyle={globalStyles.scrollContainer}
      showsVerticalScrollIndicator={true}>
      <View style={styles.container}>
        <View style={globalStyles.startContainer}>
          <Text style={globalStyles.title}>Um momento para respirar</Text>
          <Text style={globalStyles.descriptionText}>A meditação pode ajudar a acalmar a mente, reduzir a ansiedade e trazer mais equilíbrio emocional.</Text>
          <Text style={globalStyles.title}>Orientação:</Text>
          <Text style={globalStyles.descriptionText}>Reserve alguns minutos do seu dia, encontre um lugar tranquilo e foque na sua respiração.</Text>
          <Text style={globalStyles.descriptionText}>Abaixo: reunimos uma playlist de vídeos de meditação guiada para te auxiliar.</Text>

          <MediaList items={meditationData} key={'id'}></MediaList>
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
    paddingTop: 20
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