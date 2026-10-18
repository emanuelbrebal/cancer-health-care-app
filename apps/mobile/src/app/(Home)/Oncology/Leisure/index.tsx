import { HorizontalBanner } from '@/src/components/ui/Images/HorizontalBanner';
import RecomendationPager from '@/src/components/ui/Pagers/RecomendationPager';
import { RecomendationType } from '@/src/constants/Mocks/mockDataOncologyRecomendations';
import { ScrollView, StyleSheet, Text, View } from 'react-native';
import { useHeaderHeight } from 'expo-router/react-navigation';
import leisureService, { Book, LeisureActivity as Activity, Movie, Series } from '@/src/services/leisureService';
import { getMediaImage } from '@/src/constants/mediaImageMap';
import { useAsyncResource } from '@/src/hooks/useAsyncResource';
import { EmptyState, ErrorState, LoadingState } from '@/src/components/ds/States';
import { color, layout, space, typography } from '@/src/constants/tokens';

interface LeisureData {
  activities: RecomendationType[];
  books: RecomendationType[];
  movies: RecomendationType[];
  series: RecomendationType[];
  /** Seções cuja requisição falhou (as demais continuam visíveis). */
  failed: string[];
}

const EMPTY: LeisureData = { activities: [], books: [], movies: [], series: [], failed: [] };

const mapBook = (b: Book): RecomendationType => ({
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
});

const mapMovie = (m: Movie): RecomendationType => ({
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
});

const mapSeries = (s: Series): RecomendationType => ({
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
});

const mapActivity = (a: Activity): RecomendationType => ({
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
});

// v1 usava allSettled e ignorava as rejeições: falha de rede virava seções vazias sem aviso (P08).
async function fetchLeisure(): Promise<LeisureData> {
  const [books, movies, series, activities] = await Promise.allSettled([
    leisureService.getBooks(),
    leisureService.getMovies(),
    leisureService.getSeries(),
    leisureService.getActivities(),
  ]);
  const results = { books, movies, series, activities };
  const failed = Object.entries(results).filter(([, r]) => r.status === 'rejected').map(([k]) => k);
  if (failed.length === 4) throw (books as PromiseRejectedResult).reason;

  return {
    books: books.status === 'fulfilled' ? books.value.map(mapBook) : [],
    movies: movies.status === 'fulfilled' ? movies.value.map(mapMovie) : [],
    series: series.status === 'fulfilled' ? series.value.map(mapSeries) : [],
    activities: activities.status === 'fulfilled' ? activities.value.map(mapActivity) : [],
    failed,
  };
}

const SECTIONS: { key: keyof Omit<LeisureData, 'failed'>; title: string; route: string }[] = [
  { key: 'activities', title: 'Atividades para fazer em casa', route: '/Oncology/Leisure/Activities' },
  { key: 'books', title: 'Livros', route: '/Oncology/Leisure/Books' },
  { key: 'movies', title: 'Filmes', route: '/Oncology/Leisure/Movies' },
  { key: 'series', title: 'Séries', route: '/Oncology/Leisure/Series' },
];

export default function Leisure() {
  const headerHeight = useHeaderHeight();
  const { status, data, reload } = useAsyncResource(fetchLeisure, [], {
    isEmpty: (d) => SECTIONS.every((sec) => d[sec.key].length === 0),
    emptyValue: EMPTY,
  });

  return (
    <ScrollView
      contentContainerStyle={[styles.content, { paddingTop: headerHeight }]}
      showsVerticalScrollIndicator={false}
    >
      <HorizontalBanner imagePath={require('@assets/images/Banners/leisureBanner.png')} />
      <Text style={styles.intro}>
        Momentos de lazer ajudam no bem-estar emocional. Escolha algo leve para hoje.
      </Text>

      {status === 'loading' && (
        <View style={styles.loading}>
          <LoadingState variant="rail" count={3} label="Carregando recomendações de lazer" />
          <LoadingState variant="rail" count={3} label="Carregando recomendações de lazer" />
        </View>
      )}

      {status === 'error' && (
        <ErrorState
          title="Não conseguimos carregar as recomendações"
          message="Pode ser a conexão. Suas outras áreas do app continuam funcionando."
          onRetry={reload}
        />
      )}

      {status === 'empty' && (
        <EmptyState
          icon="film"
          title="Ainda não há recomendações"
          message="A equipe OncoMente está preparando livros, filmes e atividades. Volte em breve!"
        />
      )}

      {status === 'success' && data && SECTIONS.map((sec) => (
        data.failed.includes(sec.key) ? (
          <ErrorState
            key={sec.key}
            title={`${sec.title}: não foi possível carregar`}
            message="As outras recomendações estão abaixo."
            onRetry={reload}
          />
        ) : data[sec.key].length > 0 ? (
          <RecomendationPager
            key={sec.key}
            headerTitle={sec.title}
            seeAllRoute={sec.route}
            recomendationPagerData={data[sec.key]}
          />
        ) : null
      ))}
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  content: {
    paddingHorizontal: space.sm,
    paddingBottom: layout.tabBarHeight + space.xl * 2,
    gap: space.md,
  },
  intro: {
    ...typography.body,
    color: color.text.secondary,
  },
  loading: {
    gap: space.md,
  },
});
