import React, { useState, useCallback, useRef } from 'react';
import { View, Text, FlatList, Pressable, StyleSheet, RefreshControl } from 'react-native';
import { useFocusEffect, useRouter } from 'expo-router';
import { Feather } from '@expo/vector-icons';
import diaryService, { DailyLog } from '@/src/services/diaryService';
import { EMOTE_BY_ID } from '@/src/constants/Emotes';
import { toastService } from '@/src/services/toastService';
import { useAsyncResource } from '@/src/hooks/useAsyncResource';
import { Button } from '@/src/components/ds/Button';
import { Header } from '@/src/components/ds/Header';
import { TextField } from '@/src/components/ds/TextField';
import { ConfirmDialog } from '@/src/components/ds/ConfirmDialog';
import { EmptyState, ErrorState, LoadingState } from '@/src/components/ds/States';
import { color, iconSize, layout, radius, shadow, space, touch, typography } from '@/src/constants/tokens';

const today = () => new Date().toISOString().slice(0, 10);

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

// 404 = usuário ainda sem registros (vazio, não erro).
async function fetchEntries(): Promise<DailyLog[]> {
  try {
    return await diaryService.getAll();
  } catch (e: any) {
    if (e?.response?.status === 404) return [];
    throw e;
  }
}

const formatDate = (dateString: string) =>
  new Date(dateString).toLocaleDateString('pt-BR', { day: 'numeric', month: 'long', year: 'numeric' });

export default function DiaryIndex() {
  const router = useRouter();
  const { status, data, setData, reload, refresh, revalidate, refreshing } = useAsyncResource(fetchEntries, [], {
    emptyValue: [] as DailyLog[],
  });
  const [expandedId, setExpandedId] = useState<string | null>(null);
  const [contentMap, setContentMap] = useState<Record<string, string>>({});
  const [search, setSearch] = useState('');
  const [toDelete, setToDelete] = useState<DailyLog | null>(null);
  const [deleting, setDeleting] = useState(false);

  // Revalida ao voltar do formulário de criação/edição (sem piscar o skeleton).
  const firstFocus = useRef(true);
  useFocusEffect(useCallback(() => {
    if (firstFocus.current) { firstFocus.current = false; return; }
    setContentMap({});
    revalidate();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []));

  const entries = data ?? [];
  const todayEntry = entries.find((e) => e.date?.slice(0, 10) === today()) ?? null;
  const streak = calcStreak(entries);
  const filtered = entries.filter((e) => e.title.toLowerCase().includes(search.trim().toLowerCase()));

  const handleExpand = async (id: string) => {
    const isExpanded = expandedId === id;
    setExpandedId(isExpanded ? null : id);
    if (!isExpanded && contentMap[id] === undefined) {
      try {
        const entry = await diaryService.getOne(id);
        setContentMap((prev) => ({ ...prev, [id]: entry.content ?? '' }));
      } catch {
        setContentMap((prev) => ({ ...prev, [id]: '' }));
      }
    }
  };

  // v1: Alert.alert (sem botões no web). Agora ConfirmDialog do DS.
  const confirmDelete = async () => {
    if (!toDelete) return;
    setDeleting(true);
    try {
      await diaryService.remove(toDelete.id);
      setData(entries.filter((e) => e.id !== toDelete.id));
      if (expandedId === toDelete.id) setExpandedId(null);
      toastService.success('Registro removido do diário.');
      setToDelete(null);
    } catch {
      toastService.error('Não foi possível excluir. Tente de novo.');
    } finally {
      setDeleting(false);
    }
  };

  const goCreate = () => router.push('/PersonalArea/Diary/create');

  const header = (
    <View style={styles.header}>
      <Header level="screen" title="Meu diário" subtitle="Acompanhe sua jornada emocional." />

      {status === 'success' && (
        <>
          {streak > 0 && (
            <View style={styles.streakBadge} accessible accessibilityLabel={`Sequência de ${streak} ${streak === 1 ? 'dia' : 'dias'}`}>
              <Feather name="award" size={iconSize.sm} color={color.text.brandStrong} />
              <Text style={styles.streakText}>{streak} {streak === 1 ? 'dia seguido' : 'dias seguidos'}</Text>
            </View>
          )}
          {todayEntry ? (
            <View style={styles.todayBanner}>
              <Feather name="check-circle" size={iconSize.md} color={color.text.success} />
              <Text style={styles.todayBannerText}>Você já registrou o dia de hoje. Amanhã tem um novo espaço.</Text>
            </View>
          ) : (
            <Button title="Registrar meu dia" icon="edit-3" onPress={goCreate} fullWidth />
          )}
          <TextField label="Buscar no diário" icon="search" placeholder="Título do registro" value={search} onChangeText={setSearch} />
        </>
      )}
    </View>
  );

  if (status !== 'success') {
    return (
      <View style={styles.screen}>
        <View style={styles.list}>
          {header}
          {status === 'loading' && <LoadingState variant="list" count={4} label="Carregando seu diário" />}
          {status === 'error' && (
            // v1: toast de erro + "Nenhuma entrada ainda" ao mesmo tempo (P10).
            <ErrorState
              title="Não conseguimos abrir seu diário"
              message="Seus registros estão seguros. Verifique a conexão e tente de novo."
              onRetry={reload}
            />
          )}
          {status === 'empty' && (
            <EmptyState
              icon="book-open"
              title="Seu diário está em branco"
              message="Registrar como você se sente ajuda a perceber padrões e conversar com sua equipe de saúde."
              actionLabel="Escrever o primeiro registro"
              onAction={goCreate}
            />
          )}
        </View>
      </View>
    );
  }

  return (
    <View style={styles.screen}>
      <FlatList
        data={filtered}
        keyExtractor={(item) => item.id}
        ListHeaderComponent={header}
        contentContainerStyle={styles.list}
        showsVerticalScrollIndicator={false}
        refreshControl={
          <RefreshControl refreshing={refreshing} onRefresh={refresh} colors={[color.action.primary]} tintColor={color.action.primary} />
        }
        ListEmptyComponent={
          <EmptyState icon="search" title="Nenhum registro encontrado" message={`Nada com "${search}" no título.`} />
        }
        renderItem={({ item }) => {
          const isExpanded = expandedId === item.id;
          const emoteKey = Array.isArray(item.emotes) ? item.emotes[0] : (item.emotes as unknown as string);
          const emoteInfo = EMOTE_BY_ID[emoteKey] ?? EMOTE_BY_ID['neutral'];
          const content = contentMap[item.id];

          return (
            <View style={[styles.card, isExpanded && styles.cardActive]}>
              <Pressable
                style={({ pressed }) => [styles.cardMain, pressed && styles.cardPressed]}
                onPress={() => handleExpand(item.id)}
                accessibilityRole="button"
                accessibilityState={{ expanded: isExpanded }}
                accessibilityLabel={`${item.title}, ${formatDate(item.date)}, humor ${emoteInfo.label}`}
              >
                <View style={[styles.emojiBadge, { backgroundColor: emoteInfo.color }]}>
                  <Text style={styles.emoteEmoji}>{emoteInfo.emoji}</Text>
                </View>
                <View style={styles.infoColumn}>
                  <Text style={styles.cardTitle} numberOfLines={1}>{item.title}</Text>
                  <Text style={styles.dateText}>{formatDate(item.date)} · {emoteInfo.label}</Text>
                </View>
                <Feather
                  name={isExpanded ? 'chevron-up' : 'chevron-down'}
                  size={iconSize.md}
                  color={isExpanded ? color.text.link : color.icon.muted}
                />
              </Pressable>

              {isExpanded && (
                <View style={styles.expandedArea}>
                  <Text style={styles.diaryFullText}>
                    {content === undefined ? 'Carregando…' : content || '(sem texto)'}
                  </Text>
                  <View style={styles.actionRow}>
                    <Button
                      title="Editar"
                      icon="edit-2"
                      variant="secondary"
                      onPress={() => router.push({ pathname: '/PersonalArea/Diary/update', params: { id: item.id } })}
                      style={styles.actionButton}
                    />
                    <Button
                      title="Excluir"
                      icon="trash-2"
                      variant="ghost"
                      onPress={() => setToDelete(item)}
                      accessibilityLabel={`Excluir registro ${item.title}`}
                      style={styles.actionButton}
                    />
                  </View>
                </View>
              )}
            </View>
          );
        }}
      />

      <ConfirmDialog
        visible={!!toDelete}
        title="Excluir este registro?"
        message={toDelete ? `"${toDelete.title}" será apagado permanentemente. Essa ação não pode ser desfeita.` : ''}
        confirmLabel="Excluir registro"
        cancelLabel="Manter"
        destructive
        loading={deleting}
        onConfirm={confirmDelete}
        onCancel={() => setToDelete(null)}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  screen: {
    flex: 1,
  },
  header: {
    gap: space.sm,
    marginBottom: space.sm,
  },
  list: {
    paddingHorizontal: space.sm,
    paddingBottom: layout.tabBarHeight + space.xl * 2,
    gap: space.xs,
  },
  streakBadge: {
    alignSelf: 'flex-start',
    flexDirection: 'row',
    alignItems: 'center',
    gap: space.xxs,
    backgroundColor: color.bg.brandMuted,
    borderRadius: radius.pill,
    paddingHorizontal: space.sm,
    paddingVertical: space.xxs,
  },
  streakText: {
    ...typography.smallStrong,
    color: color.text.brandStrong,
  },
  todayBanner: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: space.xs,
    backgroundColor: color.bg.success,
    borderRadius: radius.md,
    padding: space.sm,
  },
  todayBannerText: {
    ...typography.small,
    color: color.text.success,
    flex: 1,
  },
  card: {
    backgroundColor: color.bg.surface,
    borderRadius: radius.lg,
    borderWidth: layout.borderHairline,
    borderColor: color.border.default,
    overflow: 'hidden',
    ...shadow.sm,
  },
  cardActive: {
    borderColor: color.border.brand,
  },
  cardMain: {
    minHeight: touch.comfortable + space.sm,
    flexDirection: 'row',
    alignItems: 'center',
    gap: space.sm,
    padding: space.sm,
  },
  cardPressed: {
    backgroundColor: color.bg.brandSubtle,
  },
  emojiBadge: {
    width: touch.comfortable,
    height: touch.comfortable,
    borderRadius: radius.md,
    justifyContent: 'center',
    alignItems: 'center',
  },
  emoteEmoji: {
    fontSize: typography.title.fontSize,
  },
  infoColumn: {
    flex: 1,
    gap: space.xxs,
  },
  cardTitle: {
    ...typography.bodyStrong,
    color: color.text.primary,
  },
  dateText: {
    ...typography.small,
    color: color.text.secondary,
  },
  expandedArea: {
    padding: space.sm,
    gap: space.sm,
    borderTopWidth: layout.borderHairline,
    borderColor: color.border.default,
    backgroundColor: color.bg.brandSubtle,
  },
  diaryFullText: {
    ...typography.body,
    color: color.text.primary,
  },
  actionRow: {
    flexDirection: 'row',
    gap: space.xs,
  },
  actionButton: {
    flex: 1,
  },
});
