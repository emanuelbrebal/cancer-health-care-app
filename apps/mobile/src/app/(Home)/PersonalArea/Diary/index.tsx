import React, { useState, useCallback, useEffect } from 'react';
import {
  View,
  Text,
  FlatList,
  TouchableOpacity,
  StyleSheet,
  Alert,
  ActivityIndicator,
  TextInput,
  RefreshControl,
} from 'react-native';
import { useRouter } from 'expo-router';
import { useIsFocused } from '@react-navigation/native';
import { useHeaderHeight } from '@react-navigation/elements';
import { Colors } from '@/src/constants/Colors';
import { globalStyles } from '@/src/styles/global';
import { Ionicons } from '@expo/vector-icons';
import diaryService, { DailyLog } from '@/src/services/diaryService';
import { EMOTE_BY_ID } from '@/src/constants/Emotes';
import { toastService } from '@/src/services/toastService';

export default function DiaryIndex() {
  const router = useRouter();
  const headerHeight = useHeaderHeight();
  const isFocused = useIsFocused();
  const [entries, setEntries] = useState<DailyLog[]>([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [expandedId, setExpandedId] = useState<string | null>(null);
  const [contentMap, setContentMap] = useState<Record<string, string>>({});
  const [streak, setStreak] = useState(0);
  const [todayEntry, setTodayEntry] = useState<DailyLog | null>(null);
  const [search, setSearch] = useState('');

  const calcStreak = (data: DailyLog[]): number => {
    let s = 0;
    const cursor = new Date();
    for (const entry of data) {
      const entryDate = entry.date?.slice(0, 10);
      const cursorDate = cursor.toISOString().slice(0, 10);
      if (entryDate === cursorDate) { s++; cursor.setDate(cursor.getDate() - 1); }
      else break;
    }
    return s;
  };

  const loadEntries = useCallback(async (silent = false) => {
    try {
      if (!silent) setLoading(true);
      const data = await diaryService.getAll();
      setEntries(data);
      setContentMap({});
      const today = new Date().toISOString().slice(0, 10);
      setTodayEntry(data.find(e => e.date?.slice(0, 10) === today) ?? null);
      setStreak(calcStreak(data));
    } catch (e: any) {
      if (e?.response?.status === 404) {
        setEntries([]);
        setContentMap({});
      } else {
        toastService.error('Não foi possível carregar o diário.');
      }
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  }, []);

  // recarrega toda vez que a tela ganha foco (volta de create/update)
  useEffect(() => {
    if (isFocused) loadEntries(entries.length > 0);
  }, [isFocused]);

  const handleExpand = async (id: string) => {
    const isExpanded = expandedId === id;
    setExpandedId(isExpanded ? null : id);
    if (!isExpanded && contentMap[id] === undefined) {
      try {
        const entry = await diaryService.getOne(id);
        setContentMap(prev => ({ ...prev, [id]: entry.content ?? '' }));
      } catch {
        setContentMap(prev => ({ ...prev, [id]: '' }));
      }
    }
  };

  const handleDelete = (item: DailyLog) => {
    Alert.alert(
      'Excluir Registro',
      `Deseja apagar permanentemente a anotação: "${item.title}"?`,
      [
        { text: 'Cancelar', style: 'cancel' },
        {
          text: 'Excluir',
          style: 'destructive',
          onPress: async () => {
            try {
              await diaryService.remove(item.id);
              const updated = entries.filter(e => e.id !== item.id);
              setEntries(updated);
              if (expandedId === item.id) setExpandedId(null);
              const today = new Date().toISOString().slice(0, 10);
              setTodayEntry(updated.find(e => e.date?.slice(0, 10) === today) ?? null);
              setStreak(calcStreak(updated));
              toastService.success('Entrada removida do diário.');
            } catch {
              toastService.error('Não foi possível excluir a entrada.');
            }
          },
        },
      ]
    );
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('pt-BR', {
      day: 'numeric',
      month: 'long',
      year: 'numeric',
    });
  };

  if (loading) {
    return (
      <View style={[globalStyles.startContainer, { paddingTop: headerHeight, justifyContent: 'center', alignItems: 'center' }]}>
        <ActivityIndicator size="large" color={Colors.purplePrimary} />
      </View>
    );
  }

  return (
    <View style={[globalStyles.startContainer, { paddingTop: headerHeight }]}>

      <View style={[globalStyles.betweenContainer, styles.headerPadding]}>
        <View style={{ flex: 1 }}>
          <Text style={[globalStyles.textPrimary, { color: Colors.purplePrimary }]}>Meus diários</Text>
          <Text style={globalStyles.textSecondary}>Acompanhe sua jornada emocional</Text>
        </View>

        <View style={styles.headerRight}>
          {streak > 0 && (
            <View style={styles.streakBadge}>
              <Text style={styles.streakText}>📓 {streak} {streak === 1 ? 'dia' : 'dias'}</Text>
            </View>
          )}
          {!todayEntry && (
            <TouchableOpacity
              style={[styles.addButton, { backgroundColor: Colors.purplePrimary }]}
              onPress={() => router.push('/PersonalArea/Diary/create')}
              activeOpacity={0.8}
            >
              <Ionicons name="add" size={28} color="#FFF" />
            </TouchableOpacity>
          )}
        </View>
      </View>

      {todayEntry && (
        <View style={styles.todayBanner}>
          <Text style={styles.todayBannerText}>🎉 Você já fez seu diário hoje! Amanhã um novo espaço estará disponível.</Text>
        </View>
      )}

      <View style={styles.searchWrapper}>
        <Ionicons name="search-outline" size={18} color="#AAA" style={styles.searchIcon} />
        <TextInput
          style={styles.searchInput}
          placeholder="Buscar no diário..."
          placeholderTextColor="#BBB"
          value={search}
          onChangeText={setSearch}
          returnKeyType="search"
        />
        {search.length > 0 && (
          <TouchableOpacity onPress={() => setSearch('')} hitSlop={{ top: 8, bottom: 8, left: 8, right: 8 }}>
            <Ionicons name="close-circle" size={18} color="#BBB" />
          </TouchableOpacity>
        )}
      </View>

      <FlatList
        data={entries.filter(e => e.title.toLowerCase().includes(search.toLowerCase()))}
        keyExtractor={(item) => item.id}
        contentContainerStyle={styles.listPadding}
        showsVerticalScrollIndicator={false}
        refreshControl={
          <RefreshControl
            refreshing={refreshing}
            onRefresh={() => { setRefreshing(true); loadEntries(true); }}
            colors={[Colors.purplePrimary]}
            tintColor={Colors.purplePrimary}
          />
        }
        ListEmptyComponent={
          <View style={{ alignItems: 'center', marginTop: 60 }}>
            <Text style={{ fontFamily: 'Montserrat', color: Colors.text.secondary, fontSize: 14 }}>
              Nenhuma entrada ainda. Comece registrando seu dia!
            </Text>
          </View>
        }
        renderItem={({ item }) => {
          const isExpanded = expandedId === item.id;
          const emoteKey = Array.isArray(item.emotes) ? item.emotes[0] : (item.emotes as unknown as string);
          const emoteInfo = EMOTE_BY_ID[emoteKey] ?? EMOTE_BY_ID['neutral'];
          const content = contentMap[item.id];

          return (
            <View style={[styles.card, isExpanded && styles.cardActive]}>
              <TouchableOpacity
                style={styles.cardMainContent}
                onPress={() => handleExpand(item.id)}
                activeOpacity={0.7}
              >
                <View style={styles.rowAlign}>
                  <View style={[styles.emojiBadge, { backgroundColor: emoteInfo.color }]}>
                    <Text style={styles.emoteEmoji}>{emoteInfo.emoji}</Text>
                  </View>

                  <View style={styles.infoColumn}>
                    <Text style={[globalStyles.title, { marginBottom: 2, fontSize: 16 }]} numberOfLines={1}>
                      {item.title}
                    </Text>
                    <Text style={styles.dateText}>
                      {formatDate(item.date)}
                    </Text>
                  </View>
                </View>

                <Ionicons
                  name={isExpanded ? 'chevron-up' : 'chevron-down'}
                  size={20}
                  color={isExpanded ? Colors.purplePrimary : '#CCC'}
                />
              </TouchableOpacity>

              {isExpanded && (
                <View style={styles.expandedArea}>
                  <View style={styles.contentContainer}>
                    <Text style={styles.diaryFullText}>
                      {content === undefined ? '...' : content || '(sem conteúdo)'}
                    </Text>
                  </View>

                  <View style={styles.actionMenu}>
                    <TouchableOpacity
                      style={styles.menuItem}
                      onPress={() => router.push({ pathname: '/PersonalArea/Diary/update', params: { id: item.id } })}
                    >
                      <Ionicons name="create-outline" size={20} color={Colors.purplePrimary} />
                      <Text style={styles.menuItemText}>Editar relato</Text>
                    </TouchableOpacity>

                    <View style={styles.divider} />

                    <TouchableOpacity
                      style={styles.menuItem}
                      onPress={() => handleDelete(item)}
                    >
                      <Ionicons name="trash-outline" size={20} color={Colors.status.error} />
                      <Text style={[styles.menuItemText, { color: Colors.status.error }]}>Remover do diário</Text>
                    </TouchableOpacity>
                  </View>
                </View>
              )}
            </View>
          );
        }}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  headerPadding: {
    flex: 0,
    paddingHorizontal: 20,
    paddingVertical: 15,
    marginBottom: 10,
  },
  listPadding: {
    paddingHorizontal: 20,
    paddingBottom: 40,
  },
  addButton: {
    width: 48,
    height: 48,
    borderRadius: 14,
    justifyContent: 'center',
    alignItems: 'center',
    elevation: 4,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.1,
    shadowRadius: 5,
  },
  card: {
    backgroundColor: '#FFF',
    borderRadius: 16,
    marginBottom: 12,
    borderWidth: 1,
    borderColor: '#F0F0F0',
    overflow: 'hidden',
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 8,
  },
  cardActive: {
    borderColor: Colors.purplePrimary + '40',
    borderWidth: 1.5,
  },
  cardMainContent: {
    flexDirection: 'row',
    padding: 16,
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  rowAlign: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
  },
  emojiBadge: {
    width: 48,
    height: 48,
    borderRadius: 12,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 15,
  },
  infoColumn: {
    flex: 1,
    justifyContent: 'center',
  },
  dateText: {
    fontFamily: 'Montserrat',
    fontSize: 12,
    color: Colors.text.secondary,
    marginTop: -4,
  },
  expandedArea: {
    backgroundColor: '#FAFAFA',
    borderTopWidth: 1,
    borderColor: '#F0F0F0',
  },
  contentContainer: {
    padding: 16,
    backgroundColor: '#FFF',
    margin: 12,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: '#EEE',
    borderLeftWidth: 4,
    borderLeftColor: Colors.purplePrimary,
  },
  diaryFullText: {
    fontFamily: 'Montserrat',
    fontSize: 14,
    lineHeight: 20,
    color: '#444',
  },
  actionMenu: {
    paddingVertical: 4,
  },
  menuItem: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 14,
    paddingHorizontal: 16,
  },
  menuItemText: {
    fontFamily: 'Montserrat',
    fontSize: 14,
    fontWeight: '600',
    marginLeft: 12,
    color: '#444',
  },
  divider: {
    height: 1,
    backgroundColor: '#F0F0F0',
    marginHorizontal: 16,
  },
  headerRight: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  streakBadge: {
    backgroundColor: '#EDE7F6',
    borderRadius: 20,
    paddingHorizontal: 10,
    paddingVertical: 6,
    borderWidth: 1,
    borderColor: '#D1C4E9',
  },
  streakText: {
    fontFamily: 'Montserrat',
    fontSize: 12,
    fontWeight: '700',
    color: '#5C4B9B',
  },
  todayBanner: {
    marginHorizontal: 20,
    marginBottom: 12,
    backgroundColor: '#F0FFF4',
    borderRadius: 12,
    padding: 12,
    borderWidth: 1,
    borderColor: '#B2DFDB',
  },
  todayBannerText: {
    fontFamily: 'Montserrat',
    fontSize: 13,
    color: '#2E7D32',
    textAlign: 'center',
  },
  searchWrapper: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#F5F5F5',
    borderRadius: 14,
    marginHorizontal: 20,
    marginBottom: 12,
    paddingHorizontal: 12,
    paddingVertical: 10,
    borderWidth: 1,
    borderColor: '#EEE',
  },
  searchIcon: {
    marginRight: 8,
  },
  searchInput: {
    flex: 1,
    fontFamily: 'Montserrat',
    fontSize: 14,
    color: '#333',
    padding: 0,
  },
  emoteEmoji: {
    fontSize: 26,
  },
});
