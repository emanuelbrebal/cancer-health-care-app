import { Colors } from '@/src/constants/Colors';
import { Feather } from '@expo/vector-icons';
import { Linking, ScrollView, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

const SUPPORT_OPTIONS = [
  {
    icon: 'activity' as const,
    title: 'SUS — Rede Pública',
    subtitle: 'CAPS e UBS',
    description: 'Procure o Centro de Atenção Psicossocial (CAPS) ou a Unidade Básica de Saúde mais próxima. O atendimento psicológico é gratuito.',
    type: 'presencial',
  },
  {
    icon: 'home' as const,
    title: 'Hospitais Oncológicos',
    subtitle: 'Equipe multidisciplinar',
    description: 'Hospitais especializados em oncologia geralmente contam com psicólogos na equipe. Solicite ao seu médico o encaminhamento.',
    type: 'presencial',
  },
  {
    icon: 'users' as const,
    title: 'Grupos de Apoio',
    subtitle: 'Comunidade e acolhimento',
    description: 'Conectar-se com outras pessoas em situação semelhante pode trazer conforto e esperança. Pergunte ao seu hospital sobre grupos presenciais ou online.',
    type: 'comunidade',
  },
  {
    icon: 'monitor' as const,
    title: 'Psicologia Online',
    subtitle: 'Atendimento a distância',
    description: 'Plataformas como Vittude, Zenklub e Psicologia Viva oferecem sessões online com psicólogos registrados no CFP.',
    type: 'online',
    linkLabel: 'Ver profissionais no CFP',
    linkUrl: 'https://www.cfp.org.br',
  },
  {
    icon: 'phone' as const,
    title: 'CVV — Apoio Emocional',
    subtitle: 'Gratuito 24h',
    description: 'O Centro de Valorização da Vida oferece apoio emocional por telefone (188) ou chat, 24 horas por dia.',
    type: 'urgencia',
    linkLabel: 'Ligar 188',
    linkUrl: 'tel:188',
  },
];

const TYPE_COLOR: Record<string, string> = {
  presencial: '#4E56C0',
  online: '#9B5DE0',
  comunidade: '#1AD5AD',
  urgencia: '#E53935',
};

const TYPE_LABEL: Record<string, string> = {
  presencial: 'Presencial',
  online: 'Online',
  comunidade: 'Comunidade',
  urgencia: 'Urgência',
};

export default function PsychologicalSupport() {
  return (
    <SafeAreaView style={{ flex: 1  }} edges={['top']}>
      <ScrollView contentContainerStyle={styles.scroll} showsVerticalScrollIndicator={false}>

        <View style={styles.heroBanner}>
          <Feather name="heart" size={28} color="#FFF" />
          <Text style={styles.heroTitle}>Pedir ajuda é um ato de coragem</Text>
          <Text style={styles.heroSubtitle}>
            Cuidar da saúde mental é tão importante quanto o tratamento físico.
          </Text>
        </View>

        <Text style={styles.sectionTitle}>Onde buscar apoio</Text>

        {SUPPORT_OPTIONS.map((option, idx) => (
          <View key={idx} style={[styles.card, { borderLeftColor: TYPE_COLOR[option.type] }]}>
            <View style={styles.cardHeader}>
              <View style={[styles.iconBadge, { backgroundColor: TYPE_COLOR[option.type] + '20' }]}>
                <Feather name={option.icon} size={20} color={TYPE_COLOR[option.type]} />
              </View>
              <View style={{ flex: 1 }}>
                <Text style={styles.cardTitle}>{option.title}</Text>
                <Text style={styles.cardSubtitle}>{option.subtitle}</Text>
              </View>
              <View style={[styles.typeBadge, { backgroundColor: TYPE_COLOR[option.type] + '15' }]}>
                <Text style={[styles.typeBadgeText, { color: TYPE_COLOR[option.type] }]}>
                  {TYPE_LABEL[option.type]}
                </Text>
              </View>
            </View>

            <Text style={styles.cardDescription}>{option.description}</Text>

            {option.linkUrl && (
              <TouchableOpacity
                style={[styles.linkBtn, { borderColor: TYPE_COLOR[option.type] }]}
                onPress={() => Linking.openURL(option.linkUrl!)}
              >
                <Feather name="external-link" size={13} color={TYPE_COLOR[option.type]} />
                <Text style={[styles.linkBtnText, { color: TYPE_COLOR[option.type] }]}>
                  {option.linkLabel}
                </Text>
              </TouchableOpacity>
            )}
          </View>
        ))}

        <View style={styles.footerNote}>
          <Feather name="info" size={14} color="#888" />
          <Text style={styles.footerNoteText}>
            Profissionais de psicologia devem estar registrados no CFP (Conselho Federal de Psicologia).
          </Text>
        </View>

      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  scroll: {
    padding: 20,
    paddingBottom: 48,
    gap: 14,
  },
  heroBanner: {
    backgroundColor: Colors.purplePrimary,
    borderRadius: 20,
    padding: 22,
    alignItems: 'center',
    gap: 8,
  },
  heroTitle: {
    fontFamily: 'Montserrat',
    fontSize: 18,
    fontWeight: '700',
    color: '#FFF',
    textAlign: 'center',
  },
  heroSubtitle: {
    fontFamily: 'Montserrat',
    fontSize: 13,
    color: 'rgba(255,255,255,0.85)',
    textAlign: 'center',
    lineHeight: 20,
  },
  sectionTitle: {
    fontFamily: 'Montserrat',
    fontSize: 16,
    fontWeight: '700',
    color: '#333',
    marginTop: 4,
  },
  card: {
    backgroundColor: '#FFF',
    borderRadius: 14,
    padding: 16,
    borderLeftWidth: 4,
    gap: 10,
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.06,
    shadowRadius: 6,
  },
  cardHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
  },
  iconBadge: {
    width: 40,
    height: 40,
    borderRadius: 10,
    justifyContent: 'center',
    alignItems: 'center',
  },
  cardTitle: {
    fontFamily: 'Montserrat',
    fontSize: 14,
    fontWeight: '700',
    color: '#333',
  },
  cardSubtitle: {
    fontFamily: 'Montserrat',
    fontSize: 12,
    color: '#888',
  },
  typeBadge: {
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 10,
  },
  typeBadgeText: {
    fontFamily: 'Montserrat',
    fontSize: 11,
    fontWeight: '700',
  },
  cardDescription: {
    fontFamily: 'Montserrat',
    fontSize: 13,
    color: '#555',
    lineHeight: 20,
  },
  linkBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    alignSelf: 'flex-start',
    borderWidth: 1,
    borderRadius: 20,
    paddingVertical: 6,
    paddingHorizontal: 12,
  },
  linkBtnText: {
    fontFamily: 'Montserrat',
    fontSize: 12,
    fontWeight: '600',
  },
  footerNote: {
    flexDirection: 'row',
    gap: 8,
    alignItems: 'flex-start',
    marginTop: 4,
  },
  footerNoteText: {
    flex: 1,
    fontFamily: 'Montserrat',
    fontSize: 12,
    color: '#888',
    lineHeight: 18,
  },
});
