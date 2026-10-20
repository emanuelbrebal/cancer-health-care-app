import { HorizontalBanner } from '@/src/components/ui/Images/HorizontalBanner';
import RecomendationPager from '@/src/components/ui/Pagers/RecomendationPager';
import { RecomendationType } from '@/src/constants/Mocks/mockDataOncologyRecomendations';
import { globalStyles } from '@/src/styles/global';
import { ScrollView, StyleSheet, Text, View } from 'react-native';
import leisureService from '@/src/services/leisureService';
import { getMediaImage } from '@/src/constants/mediaImageMap';
import { useAsyncResource } from '@/src/hooks/useAsyncResource';
import { EmptyState, ErrorState, LoadingState } from '@/src/components/ds/States';

interface LeisureData {
  books: RecomendationType[];
  movies: RecomendationType[];
  series: RecomendationType[];
  activities: RecomendationType[];
}

const EMPTY_LEISURE: LeisureData = { books: [], movies: [], series: [], activities: [] };

// v1 engolia a falha da API e mostrava as seções vazias, sem aviso (P08).
// Só vira erro quando as quatro buscas falham; falha parcial mostra o que carregou.
async function fetchLeisure(): Promise<LeisureData> {
  const results = await Promise.allSettled([
    leisureService.getBooks(),
    leisureService.getMovies(),
    leisureService.getSeries(),
    leisureService.getActivities(),
  ]);
  const [booksResult, moviesResult, seriesResult, activitiesResult] = results;
  if (results.every((r) => r.status === 'rejected')) throw (results[0] as PromiseRejectedResult).reason;

  const data: LeisureData = { ...EMPTY_LEISURE };
  if (booksResult.status === 'fulfilled') {
    data.books = booksResult.value.map(b => ({
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
    }));
  }

  if (moviesResult.status === 'fulfilled') {
    data.movies = moviesResult.value.map(m => ({
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
    }));
  }

  if (seriesResult.status === 'fulfilled') {
    data.series = seriesResult.value.map(s => ({
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
    }));
  }

  if (activitiesResult.status === 'fulfilled') {
    data.activities = activitiesResult.value.map(a => ({
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
    }));
  }
  return data;
}

export default function Leisure() {
  const { status, data, reload } = useAsyncResource(fetchLeisure, [], {
    isEmpty: (d) => Object.values(d).every((list) => list.length === 0),
    emptyValue: EMPTY_LEISURE,
  });
  const { books, movies, series, activities } = data ?? EMPTY_LEISURE;

  return (
    <ScrollView contentContainerStyle={globalStyles.scrollContainer} showsVerticalScrollIndicator={true}>
      <View style={styles.container}>
        <HorizontalBanner imagePath={require('@assets/images/Banners/leisureBanner.png')} />
        <Text style={globalStyles.title}>Momentos de lazer ajudam no bem-estar emocional.</Text>
        <Text style={globalStyles.descriptionText}>Confira recomendações de atividades em casa, filmes, séries e livros rolando a tela para baixo!</Text>

        {status === 'loading' && <LoadingState variant="rail" count={4} label="Carregando recomendações" />}
        {status === 'error' && <ErrorState title="Não conseguimos carregar as recomendações" onRetry={reload} />}
        {status === 'empty' && (
          <EmptyState icon="film" title="Nenhuma recomendação por aqui ainda" message="Novas sugestões chegam em breve." />
        )}
        {status === 'success' && (
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
});
