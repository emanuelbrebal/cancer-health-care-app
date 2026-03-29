
import { ButtonPrimary } from '@/src/components/ui/Buttons/ButtonPrimary';
import { NewPublicationButton } from '@/src/components/ui/Buttons/Overlay/NewPublication/NewPublication';
import { SearchBar } from '@/src/components/ui/Inputs/SearchBar';
import RecomendationPager from '@/src/components/ui/Pagers/RecomendationPager';
import { mockCommunitiesData, mockPostsData, mockTopicsData } from '@/src/constants/mockData';
import { globalStyles } from '@/src/styles/global';
import { View } from 'react-native';

export default function HomeSocialIndex() {

  return (
    <View style={globalStyles.startContainer}>
      {/* lista de tópicos */}
      <View style={[globalStyles.scrollContainer, { marginTop: 30 }]}>

        <SearchBar></SearchBar>
         {/* lista de comunidades */}
        <RecomendationPager headerTitle="Comunidades disponíveis" recomendationPagerData={mockCommunitiesData} />
         
         {/* lista de topicos */}
        <RecomendationPager headerTitle='Tópicos recentes' recomendationPagerData={mockTopicsData} />

        {/* lista de publicações */}
        <RecomendationPager headerTitle="Publicações recentes" recomendationPagerData={mockPostsData} />

        <NewPublicationButton />
      </View>
    </View>
  );
}

