import React, { useState } from 'react';
import { View, Text, FlatList, TouchableOpacity, StyleSheet, Alert } from 'react-native';
import { useRouter } from 'expo-router';
import { useHeaderHeight } from '@react-navigation/elements';
import { Colors } from '@/src/constants/Colors';
import { globalStyles } from '@/src/styles/global';
import { Ionicons } from '@expo/vector-icons';

const MOCK_TRATAMENTOS = [
  { id: '1', nome: 'Quimioterapia', horario: '09:00', obs: 'Beber muita água' },
  { id: '2', nome: 'Vitamina D', horario: '12:00', obs: 'Pós almoço' },
];

export default function TreatmentIndex() {
  const router = useRouter();
  const headerHeight = useHeaderHeight();
  const [expandedId, setExpandedId] = useState<string | null>(null);

  const handleDelete = (item: any) => {
    Alert.alert(
      "Excluir Registro",
      `Deseja apagar o registro de ${item.nome}?`,
      [
        { text: "Cancelar", style: "cancel" },
        { text: "Excluir", style: "destructive", onPress: () => console.log("Delete ID:", item.id) }
      ]
    );
  };

  return (
    <View style={[globalStyles.startContainer, { paddingTop: headerHeight }]}>
      
      {/* Header Fixo */}
      <View style={[globalStyles.betweenContainer, styles.headerPadding]}>
        <View style={{ flex: 1 }}>
          <Text style={[globalStyles.textPrimary, { color: Colors.purplePrimary }]}>Tratamentos</Text>
          <Text style={globalStyles.textSecondary}>Acompanhe sua rotina</Text>
        </View>
        
        <TouchableOpacity 
          style={[styles.addButton, { backgroundColor: Colors.purplePrimary }]} 
          onPress={() => router.push("/PersonalArea/Treatment/create")}
        >
          <Ionicons name="add" size={28} color="#FFF" />
        </TouchableOpacity>
      </View>

      <FlatList
        data={MOCK_TRATAMENTOS}
        keyExtractor={(item) => item.id}
        contentContainerStyle={styles.listPadding}
        renderItem={({ item }) => {
          const isExpanded = expandedId === item.id;
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
                    <Text style={[globalStyles.textSecondary, { marginLeft: 6 }]}>{item.horario}</Text>
                  </View>
                </View>

                {/* Apenas o Chevron na linha principal */}
                <Ionicons 
                  name={isExpanded ? "chevron-up" : "chevron-down"} 
                  size={22} 
                  color={isExpanded ? Colors.purplePrimary : "#CCC"} 
                />
              </TouchableOpacity>

              {/* Conteúdo Expandido (Dropdown de Ações) */}
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

                  <View style={styles.actionMenu}>
                    <TouchableOpacity 
                      style={styles.menuItem}
                      onPress={() => router.push({ pathname: "/PersonalArea/Treatment/update", params: { id: item.id } })}
                    >
                      <Ionicons name="create-outline" size={20} color={Colors.purplePrimary} />
                      <Text style={styles.menuItemText}>Editar Tratamento</Text>
                    </TouchableOpacity>

                    <View style={styles.divider} />

                    <TouchableOpacity 
                      style={styles.menuItem}
                      onPress={() => handleDelete(item)}
                    >
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
    </View>
  );
}

const styles = StyleSheet.create({
  headerPadding: {
    flex: 0,
    paddingHorizontal: 20,
    paddingVertical: 15,
    marginBottom: 10
  },
  listPadding: {
    paddingHorizontal: 20,
    paddingBottom: 40
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
    justifyContent: 'space-between'
  },
  infoColumn: {
    flex: 1,
  },
  timeRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: -8,
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
    lineHeight: 20
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
  }
});