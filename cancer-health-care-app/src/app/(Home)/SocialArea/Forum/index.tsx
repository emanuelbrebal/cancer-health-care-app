
import { NewPublicationButton } from '@/src/components/ui/Buttons/Overlay/NewPublication/NewPublication';
import { SearchBar } from '@/src/components/ui/Inputs/SearchBar';
import RecomendationPager from '@/src/components/ui/Pagers/RecomendationPager';
import { mockCommunitiesData, mockTopicsData } from '@/src/constants/mockData';
import { globalStyles } from '@/src/styles/global';
import { StyleSheet, View } from 'react-native';

export default function HomeSocialIndex() {

  return (
    <View style={globalStyles.startContainer}>
      {/* lista de tópicos */}

      <SearchBar></SearchBar>
      <RecomendationPager headerTitle='Tópicos recentes' recomendationPagerData={mockTopicsData} />


      {/* lista de comunidades */}
      <RecomendationPager headerTitle="Comunidades disponíveis" recomendationPagerData={mockCommunitiesData} />

      <NewPublicationButton />
    </View>
  );
}

