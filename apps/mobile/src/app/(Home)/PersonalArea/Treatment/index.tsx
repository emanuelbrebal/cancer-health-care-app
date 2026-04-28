import React, { useState, useCallback } from 'react';
import { View, Text, FlatList, TouchableOpacity, StyleSheet, Alert } from 'react-native';
import { useRouter } from 'expo-router';
import { useHeaderHeight } from '@react-navigation/elements';
import { useFocusEffect } from 'expo-router';
import { Colors } from '@/src/constants/Colors';
import { globalStyles } from '@/src/styles/global';
import { Ionicons } from '@expo/vector-icons';
import treatmentService, { Treatment, getDaysRemaining, getProgress } from '@/src/services/treatmentService';
import { cancelTreatmentNotifications, removeHistoryByTreatmentId } from '@/src/services/notificationService';
import { toastService } from '@/src/services/toastService';

export default function TreatmentIndex() {
  const router = useRouter();
  const headerHeight = useHeaderHeight();
  const [expandedId, setExpandedId] = useState<string | null>(null);
  const [treatments, setTreatments] = useState<Treatment[]>([]);

  useFocusEffect(useCallback(() => {
    treatmentService.getAll()
      .then(setTreatments)
      .catch((e: any) => {
        if (e?.response?.status === 404) {
          setTreatments([]);
        } else {
          toastService.error('Não foi possível carregar os tratamentos.');
        }
      });
  }, []));

  const handleDelete = (item: Treatment) => {
    Alert.alert(
      'Excluir Registro',
      `Deseja apagar o registro de ${item.nome}?`,
      [
        { text: 'Cancelar', style: 'cancel' },
        {
          text: 'Excluir',
          style: 'destructive',
          onPress: async () => {
            try {
              if (item.notificationIds?.length) {
                await cancelTreatmentNotifications(item.notificationIds);
              }
              await removeHistoryByTreatmentId(item.id);
              await treatmentService.remove(item.id);
              setTreatments((prev) => prev.filter((t) => t.id !== item.id));
              toastService.success('Tratamento removido com sucesso.');
            } catch {
              toastService.error('Não foi possível remover o tratamento.');
            }
          },
        },
      ],
    );
  };

  return (
    <View style={[globalStyles.startContainer, { paddingTop: headerHeight }]}>

      <View style={[globalStyles.betweenContainer, styles.headerPadding]}>
        <View style={{ flex: 1 }}>
          <Text style={[globalStyles.textPrimary, { color: Colors.purplePrimary }]}>Tratamentos</Text>
          <Text style={globalStyles.textSecondary}>Acompanhe sua rotina</Text>
        </View>
        <TouchableOpacity
          style={[styles.addButton, { backgroundColor: Colors.purplePrimary }]}
          onPress={() => router.push('/PersonalArea/Treatment/create')}
        >
          <Ionicons name="add" size={28} color="#FFF" />
        </TouchableOpacity>
      </View>

      {treatments.length === 0 ? (
        <View style={styles.emptyState}>
          <Ionicons name="medkit-outline" size={48} color="#CCC" />
          <Text style={styles.emptyText}>Nenhum tratamento cadastrado.</Text>
          <Text style={styles.emptySubText}>Toque no + para adicionar.</Text>
        </View>
      ) : (
        <FlatList
          data={treatments}
          keyExtractor={(item) => item.id}
          contentContainerStyle={styles.listPadding}
          renderItem={({ item }) => {
            const isExpanded = expandedId === item.id;
            const progress = getProgress(item);
            const daysLeft = getDaysRemaining(item);
            return (
              <View style={styles.card}>
                <TouchableOpacity
                  style={styles.cardMainContent}
                  onPress={() => setExpandedId(isExpanded ? null : item.id)}
                  activeOpacity={0.7}
                >
                  <View style={styles.infoColumn}>
                    <Text style={globalStyles.title}>{item.nome}</Text>
                    <View style={styles.timeRow}>
                      <Ionicons name="time-outline" size={16} color={Colors.text.secondary} />
                      <Text style={[globalStyles.textSecondary, { marginLeft: 6 }]}>{item.horaInicio} · {item.frequencia}</Text>
                    </View>
                    <View style={styles.progressBar}>
                      <View style={[styles.progressFill, { width: `${progress}%` }]} />
                    </View>
                    <Text style={styles.progressLabel}>{progress}% concluído · {daysLeft} dias restantes</Text>
                  </View>
                  <Ionicons
                    name={isExpanded ? 'chevron-up' : 'chevron-down'}
                    size={22}
                    color={isExpanded ? Colors.purplePrimary : '#CCC'}
                  />
                </TouchableOpacity>

                {isExpanded && (
                  <View style={styles.expandedArea}>
                    {item.obs ? (
                      <View style={styles.obsContainer}>
                        <Text style={[globalStyles.textSecondary, styles.obsText]}>
                          <Text style={{ fontWeight: '700', color: Colors.purplePrimary }}>Obs: </Text>
                          {item.obs}
                        </Text>
                      </View>
                    ) : null}
                    {(item.nomeMedico || item.nomeHospital) && (
                      <View style={styles.obsContainer}>
                        {item.nomeMedico ? (
                          <Text style={styles.obsText}>Médico: {item.nomeMedico}{item.contatoMedico ? ` · ${item.contatoMedico}` : ''}</Text>
                        ) : null}
                        {item.nomeHospital ? (
                          <Text style={styles.obsText}>Hospital: {item.nomeHospital}</Text>
                        ) : null}
                      </View>
                    )}
                    <View style={styles.actionMenu}>
                      <TouchableOpacity
                        style={styles.menuItem}
                        onPress={() => router.push({
                          pathname: '/PersonalArea/Treatment/update',
                          params: {
                            id: item.id,
                            currentNome: item.nome,
                            currentFreq: item.frequencia,
                            currentHora: item.horaInicio,
                            currentFim: item.dataFim,
                            currentMedico: item.nomeMedico ?? '',
                            currentContato: item.contatoMedico ?? '',
                            currentHospital: item.nomeHospital ?? '',
                          },
                        })}
                      >
                        <Ionicons name="create-outline" size={20} color={Colors.purplePrimary} />
                        <Text style={styles.menuItemText}>Editar Tratamento</Text>
                      </TouchableOpacity>
                      <View style={styles.divider} />
                      <TouchableOpacity style={styles.menuItem} onPress={() => handleDelete(item)}>
                        <Ionicons name="trash-outline" size={20} color={Colors.status.error} />
                        <Text style={[styles.menuItemText, { color: Colors.status.error }]}>Excluir Registro</Text>
                      </TouchableOpacity>
                    </View>
                  </View>
                )}
              </View>
            );
          }}
        />
      )}
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
  emptyState: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
  },
  emptyText: {
    fontSize: 16,
    color: '#999',
    fontFamily: 'Montserrat',
  },
  emptySubText: {
    fontSize: 13,
    color: '#BBB',
    fontFamily: 'Montserrat',
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
  cardMainContent: {
    flexDirection: 'row',
    padding: 18,
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  infoColumn: {
    flex: 1,
    gap: 4,
  },
  timeRow: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  progressBar: {
    height: 6,
    backgroundColor: '#F0F0F0',
    borderRadius: 3,
    overflow: 'hidden',
    marginTop: 8,
    marginRight: 12,
  },
  progressFill: {
    height: '100%',
    backgroundColor: Colors.purplePrimary,
    borderRadius: 3,
  },
  progressLabel: {
    fontSize: 11,
    color: '#999',
    fontFamily: 'Montserrat',
  },
  expandedArea: {
    backgroundColor: '#FAFAFA',
    borderTopWidth: 1,
    borderColor: '#F0F0F0',
  },
  obsContainer: {
    padding: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#F0F0F0',
  },
  obsText: {
    fontSize: 14,
    lineHeight: 20,
    color: '#666',
    fontFamily: 'Montserrat',
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
    fontSize: 15,
    fontWeight: '500',
    marginLeft: 12,
    color: '#444',
  },
  divider: {
    height: 1,
    backgroundColor: '#F0F0F0',
    marginHorizontal: 16,
  },
});
