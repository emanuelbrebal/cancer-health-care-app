import React, { useState } from 'react';
import { 
  View, 
  Text, 
  FlatList, 
  TouchableOpacity, 
  StyleSheet, 
  Alert, 
} from 'react-native';
import { useRouter } from 'expo-router';
import { useHeaderHeight } from '@react-navigation/elements';
import { Colors } from '@/src/constants/Colors';
import { globalStyles } from '@/src/styles/global';
import { Ionicons, MaterialCommunityIcons } from '@expo/vector-icons';

const EMOTE_MAP: any = {
  very_happy: { icon: 'emoticon-excited-outline', color: '#D1FFBD', label: 'Incrível' },
  happy:      { icon: 'emoticon-happy-outline',   color: '#BDE3FF', label: 'Bem' },
  neutral:    { icon: 'emoticon-neutral-outline', color: '#FFFDB7', label: 'Normal' },
  sad:        { icon: 'emoticon-sad-outline',     color: '#FFD1BD', label: 'Baixo' },
  bad:        { icon: 'emoticon-confused-outline',color: '#BDBFFF', label: 'Ruim' },
};

const MOCK_DIARIOS = [
  { 
    id: 'uuid-1', 
    title: 'Progresso no Tratamento',
    content: 'Hoje me senti muito disposto. Consegui caminhar por 20 minutos e a alimentação foi bem leve. Sem efeitos colaterais por enquanto.', 
    date: '2026-03-21T10:00:00Z', 
    emotes: 'very_happy', 
    userId: 'user-123',
    updatedAt: '2026-03-21T10:00:00Z'
  },
  { 
    id: 'uuid-2', 
    title: 'Dia de Repouso',
    content: 'Senti um pouco de fadiga após o almoço. Decidi descansar e ler um livro. Amanhã espero estar melhor.', 
    date: '2026-03-20T14:30:00Z', 
    emotes: 'neutral', 
    userId: 'user-123',
    updatedAt: '2026-03-20T14:30:00Z'
  },
  { 
    id: 'uuid-3', 
    title: 'Noite Difícil',
    content: 'Tive dificuldade para pegar no sono. Muita ansiedade com os exames de amanhã.', 
    date: '2026-03-18T08:00:00Z', 
    emotes: 'sad', 
    userId: 'user-123',
    updatedAt: '2026-03-18T08:00:00Z'
  },
];

export default function DiaryIndex() {
  const router = useRouter();
  const headerHeight = useHeaderHeight();
  const [expandedId, setExpandedId] = useState<string | null>(null);

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('pt-BR', {
      day: 'numeric',
      month: 'long',
      year: 'numeric'
    });
  };

  const handleDelete = (item: any) => {
    Alert.alert(
      "Excluir Registro",
      `Deseja apagar permanentemente a anotação: "${item.title}"?`,
      [
        { text: "Cancelar", style: "cancel" },
        { 
          text: "Excluir", 
          style: "destructive", 
          onPress: () => console.log("Deletar ID:", item.id) 
        }
      ]
    );
  };

  return (
    <View style={[globalStyles.startContainer, { paddingTop: headerHeight }]}>
      
      <View style={[globalStyles.betweenContainer, styles.headerPadding]}>
        <View style={{ flex: 1 }}>
          <Text style={[globalStyles.textPrimary, { color: Colors.purplePrimary }]}>Meus diários</Text>
          <Text style={globalStyles.textSecondary}>Acompanhe sua jornada emocional</Text>
        </View>
        
        <TouchableOpacity 
          style={[styles.addButton, { backgroundColor: Colors.purplePrimary }]} 
          onPress={() => router.push("/PersonalArea/Diary/create")}
          activeOpacity={0.8}
        >
          <Ionicons name="add" size={28} color="#FFF" />
        </TouchableOpacity>
      </View>

      <FlatList
        data={MOCK_DIARIOS}
        keyExtractor={(item) => item.id}
        contentContainerStyle={styles.listPadding}
        showsVerticalScrollIndicator={false}
        renderItem={({ item }) => {
          const isExpanded = expandedId === item.id;
          const emoteInfo = EMOTE_MAP[item.emotes] || EMOTE_MAP.neutral;

          return (
            <View style={[styles.card, isExpanded && styles.cardActive]}>
              <TouchableOpacity 
                style={styles.cardMainContent}
                onPress={() => setExpandedId(isExpanded ? null : item.id)}
                activeOpacity={0.7}
              >
                <View style={styles.rowAlign}>
                  <View style={[styles.emojiBadge, { backgroundColor: emoteInfo.color }]}>
                    <MaterialCommunityIcons 
                      name={isExpanded ? (emoteInfo.icon.replace('-outline', '') as any) : emoteInfo.icon as any} 
                      size={26} 
                      color={isExpanded ? Colors.purpleSecondary : "#444"} 
                    />
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
                  name={isExpanded ? "chevron-up" : "chevron-down"} 
                  size={20} 
                  color={isExpanded ? Colors.purplePrimary : "#CCC"} 
                />
              </TouchableOpacity>

              {isExpanded && (
                <View style={styles.expandedArea}>
                  <View style={styles.contentContainer}>
                    <Text style={styles.diaryFullText}>{item.content}</Text>
                  </View>

                  <View style={styles.actionMenu}>
                    <TouchableOpacity 
                      style={styles.menuItem}
                      onPress={() => router.push({ pathname: "/PersonalArea/Diary/update", params: { id: item.id } })}
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
  cardActive: {
    borderColor: Colors.purplePrimary + '40', // Borda sutil quando aberto
    borderWidth: 1.5,
  },
  cardMainContent: {
    flexDirection: 'row',
    padding: 16,
    alignItems: 'center',
    justifyContent: 'space-between'
  },
  rowAlign: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1
  },
  emojiBadge: {
    width: 48,
    height: 48,
    borderRadius: 12,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 15
  },
  infoColumn: {
    flex: 1,
    justifyContent: 'center'
  },
  dateText: {
    fontFamily: 'Montserrat',
    fontSize: 12,
    color: Colors.text.secondary,
    marginTop: -4
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
  }
});