import { useEffect, useState } from 'react';
import { HorizontalBanner } from '@/src/components/ui/Images/HorizontalBanner';
import RecomendationPager from '@/src/components/ui/Pagers/RecomendationPager';
import { RecomendationType } from '@/src/constants/Mocks/mockDataOncologyRecomendations';
import { globalStyles } from '@/src/styles/global';
import { ActivityIndicator, ScrollView, StyleSheet, Text, View } from 'react-native';
import { Colors } from '@/src/constants/Colors';
import leisureService from '@/src/services/leisureService';
import { getMediaImage } from '@/src/constants/mediaImageMap';

export default function Leisure() {
  const [books, setBooks] = useState<RecomendationType[]>([]);
  const [movies, setMovies] = useState<RecomendationType[]>([]);
  const [series, setSeries] = useState<RecomendationType[]>([]);
  const [activities, setActivities] = useState<RecomendationType[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    Promise.allSettled([
      leisureService.getBooks(),
      leisureService.getMovies(),
      leisureService.getSeries(),
      leisureService.getActivities(),
    ]).then(([booksResult, moviesResult, seriesResult, activitiesResult]) => {
      if (booksResult.status === 'fulfilled') {
        setBooks(booksResult.value.map(b => ({
          id: b.id,
          title: b.title,
          image: getMediaImage(b.imagePath),
          imagePath: b.imagePath,
          route: {
            pathname: '/Oncology/Leisure/Books/[id]' as const,
            params: {
              id: b.id,
              title: b.title,
              author: b.author ?? '',
              imagePath: b.imagePath ?? '',
              genre: b.genre ?? '',
              pageCount: String(b.pageCount ?? 0),
              whereToFind: JSON.stringify(b.whereToFind ?? []),
              eduCapesLink: b.eduCapesLink ?? '',
            },
          },
        })));
      }

      if (moviesResult.status === 'fulfilled') {
        setMovies(moviesResult.value.map(m => ({
          id: m.id,
          title: m.title,
          image: getMediaImage(m.imagePath),
          imagePath: m.imagePath,
          route: {
            pathname: '/Oncology/Leisure/Movies/[id]' as const,
            params: {
              id: m.id,
              title: m.title,
              director: m.director ?? '',
              duration: m.duration ? String(m.duration) : '',
              releaseYear: m.releaseYear ? String(m.releaseYear) : '',
              imagePath: m.imagePath ?? '',
              genre: m.genre ?? '',
              whereToFind: JSON.stringify(m.whereToFind ?? []),
              externalLink: m.externalLink ?? '',
            },
          },
        })));
      }

      if (seriesResult.status === 'fulfilled') {
        setSeries(seriesResult.value.map(s => ({
          id: s.id,
          title: s.title,
          image: getMediaImage(s.imagePath),
          imagePath: s.imagePath,
          route: {
            pathname: '/Oncology/Leisure/Series/[id]' as const,
            params: {
              id: s.id,
              title: s.title,
              showrunner: s.showrunner ?? '',
              seasons: s.seasons ? String(s.seasons) : '0',
              episodes: s.episodes ? String(s.episodes) : '0',
              imagePath: s.imagePath ?? '',
              genre: s.genre ?? '',
              whereToFind: JSON.stringify(s.whereToFind ?? []),
              externalLink: s.externalLink ?? '',
            },
          },
        })));
      }

      if (activitiesResult.status === 'fulfilled') {
        setActivities(activitiesResult.value.map(a => ({
          id: a.id,
          title: a.name,
          image: getMediaImage(a.imagePath),
          imagePath: a.imagePath,
          route: {
            pathname: '/Oncology/Leisure/Activities/[id]' as const,
            params: {
              id: a.id,
              name: a.name,
              imagePath: a.imagePath ?? '',
              type: a.type ?? '',
              frequency: a.frequency ?? '',
            },
          },
        })));
      }
    }).finally(() => setLoading(false));
  }, []);

  return (
    <ScrollView contentContainerStyle={globalStyles.scrollContainer} showsVerticalScrollIndicator={true}>
      <View style={styles.container}>
        <HorizontalBanner imagePath={require('@assets/images/Banners/leisureBanner.png')} />
        <Text style={globalStyles.title}>Momentos de lazer ajudam no bem-estar emocional.</Text>
        <Text style={globalStyles.descriptionText}>Confira recomendações de atividades em casa, filmes, séries e livros rolando a tela para baixo!</Text>

        {loading ? (
          <ActivityIndicator size="large" color={Colors.purplePrimary} style={styles.loader} />
        ) : (
          <>
            <RecomendationPager headerTitle='Atividades recomendadas' seeAllRoute="/Oncology/Leisure/Activities" recomendationPagerData={activities} />
            <RecomendationPager headerTitle='Livros recomendados'     seeAllRoute="/Oncology/Leisure/Books"      recomendationPagerData={books}      />
            <RecomendationPager headerTitle='Filmes recomendados'     seeAllRoute="/Oncology/Leisure/Movies"     recomendationPagerData={movies}     />
            <RecomendationPager headerTitle='Séries recomendadas'     seeAllRoute="/Oncology/Leisure/Series"     recomendationPagerData={series}     />
          </>
        )}
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: 'transparent',
  },
  loader: {
    marginTop: 40,
  },
});
