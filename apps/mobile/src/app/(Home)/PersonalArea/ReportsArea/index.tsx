import React, { useState } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, Linking, Alert } from 'react-native';
import { Feather } from '@expo/vector-icons';
import { globalStyles } from '@/src/styles/global';

// --- Dados Mockados (MVP) ---
const LEGAL_INFO = {
  description: 'Você não está sozinho. O descaso, a negligência e a discriminação por conta da sua condição de saúde são inaceitáveis e ferem a lei. Você tem direito a um tratamento digno, humanizado e sem preconceitos em hospitais, no trabalho e na sociedade.',
  laws: [
    { 
      id: '1', 
      title: 'Estatuto da Pessoa com Câncer (Lei Nº 14.238/2021)', 
      desc: 'Garante o atendimento integral e prioritário, proibindo qualquer forma de negligência, discriminação ou tratamento desumano por conta da doença.' 
    },
    { 
      id: '2', 
      title: 'Negligência e Descaso (Código Civil e CDC)', 
      desc: 'Falhas no atendimento hospitalar, como ser ignorado pela equipe médica ou ter o tratamento adiado sem justificativa, configuram negligência e falha na prestação do serviço.' 
    },
    { 
      id: '3', 
      title: 'Omissão de Socorro (Art. 135, Código Penal)', 
      desc: 'É crime a recusa ou omissão no atendimento de emergência a pacientes que estejam em situação de dor extrema ou risco agravado.' 
    },
    { 
      id: '4', 
      title: 'Discriminação no Trabalho (Súmula 443, TST)', 
      desc: 'Protege o paciente oncológico contra demissões discriminatórias ou tratamento hostil e isolamento no ambiente de trabalho devido à doença.' 
    },
  ]
};

const REPORT_CHANNELS = [
  {
    id: '1',
    name: 'Ouvidoria do SUS (Nacional e Estadual)',
    description: 'Canal oficial para denunciar falta de medicamentos, demora abusiva para exames/cirurgias oncológicas, negligência ou mau atendimento na rede pública de saúde (hospitais estaduais e municipais).',
    actionText: 'Disque 136',
    icon: 'phone-call',
    type: 'phone',
    value: '136',
  },
  {
    id: '2',
    name: 'Defensoria Pública de Alagoas (DPE-AL)',
    description: 'Assistência jurídica gratuita. O Núcleo de Saúde da DPE-AL atua para garantir na Justiça o acesso a cirurgias, tratamentos e medicamentos oncológicos que foram negados ou atrasados pelo Estado.',
    actionText: 'Disque 129',
    icon: 'phone-call',
    type: 'phone',
    value: '129', // Número nacional padronizado que cai na central estadual da DPE
  },
  {
    id: '3',
    name: 'CREMAL (Conselho Regional de Medicina - AL)',
    description: 'Órgão responsável por apurar denúncias formais contra médicos no estado de Alagoas por erro médico, descaso, omissão de socorro ou infração ética.',
    actionText: 'Acessar Ouvidoria do CREMAL',
    icon: 'external-link',
    type: 'link',
    value: 'https://cremal.org.br/ouvidoria/',
  },
  {
    id: '4',
    name: 'ANS (Planos de Saúde Privados)',
    description: 'Sofreu discriminação, negativa de cobertura de quimioterapia/radioterapia ou quebra de contrato pelo seu convênio médico? Denuncie na Agência Nacional de Saúde.',
    actionText: 'Ligue 0800 701 9656',
    icon: 'phone-call',
    type: 'phone',
    value: '08007019656',
  },
  {
    id: '5',
    name: 'Ministério Público de Alagoas (MPAL)',
    description: 'A Ouvidoria do MPAL recebe denúncias graves sobre violação dos direitos da pessoa com câncer, discriminação e falhas sistêmicas na prestação de serviços de saúde em Alagoas.',
    actionText: 'Acessar Portal MPAL',
    icon: 'external-link',
    type: 'link',
    value: 'https://www.mpal.mp.br/ouvidoria/',
  }
];

export default function ReportsAreaScreen() {
  // Estado para controlar qual card do dropdown está aberto
  const [expandedId, setExpandedId] = useState<string | null>(null);
  
  const handleAction = async (type: string, value: string) => {
    try {
      const url = type === 'phone' ? `tel:${value}` : value;
      const supported = await Linking.canOpenURL(url);
      
      if (supported) {
        await Linking.openURL(url);
      } else {
        Alert.alert('Atenção', 'Não foi possível abrir este link ou realizar a chamada no seu dispositivo.');
      }
    } catch (error) {
      Alert.alert('Erro', 'Ocorreu um erro ao tentar acessar o canal de denúncia.');
    }
  };

  const toggleExpand = (id: string) => {
    setExpandedId(prevId => (prevId === id ? null : id));
  }; 

  return (
    <View style={globalStyles.scrollContainer}>
      <ScrollView contentContainerStyle={styles.scrollContent} showsVerticalScrollIndicator={false}>
        
        {/* Seção 1: Orientações e Direitos */}
        <View style={styles.section}>
          <View style={styles.sectionHeader}>
            <Feather name="book-open" size={24} color="#D32F2F" />
            <Text style={styles.sectionTitle}>Seus Direitos</Text>
          </View>
          
          <View style={styles.infoCard}>
            <Text style={styles.infoDescription}>{LEGAL_INFO.description}</Text>
            
            <View style={styles.divider} />
            
            {LEGAL_INFO.laws.map((law) => (
              <View key={law.id} style={styles.lawItem}>
                <Text style={styles.lawTitle}>{law.title}</Text>
                <Text style={styles.lawDesc}>{law.desc}</Text>
              </View>
            ))}
          </View>
        </View>

        {/* Seção 2: Canais de Denúncia (Dropdowns) */}
        <View style={styles.section}>
          <View style={styles.sectionHeader}>
            <Feather name="shield" size={24} color="#D32F2F" />
            <Text style={styles.sectionTitle}>Onde Denunciar</Text>
          </View>
          
          <Text style={styles.sectionSubtitle}>
            Toque em uma das opções abaixo para ver mais detalhes e acessar o canal de forma segura.
          </Text>

          <View style={styles.channelsList}>
            {REPORT_CHANNELS.map((channel) => {
              const isExpanded = expandedId === channel.id;
              
              return (
                <View key={channel.id} style={[styles.accordionCard, isExpanded && styles.accordionCardExpanded]}>
                  {/* Cabeçalho do Dropdown */}
                  <TouchableOpacity 
                    style={styles.accordionHeader}
                    activeOpacity={0.7}
                    onPress={() => toggleExpand(channel.id)}
                  >
                    <Text style={styles.channelName}>{channel.name}</Text>
                    <Feather 
                      name={isExpanded ? "chevron-up" : "chevron-down"} 
                      size={24} 
                      color="#D32F2F" 
                    />
                  </TouchableOpacity>
                  
                  {/* Conteúdo do Dropdown (Exibido apenas se estiver expandido) */}
                  {isExpanded && (
                    <View style={styles.accordionContent}>
                      <Text style={styles.channelDesc}>{channel.description}</Text>
                      
                      <TouchableOpacity 
                        style={styles.actionButton}
                        activeOpacity={0.8}
                        onPress={() => handleAction(channel.type, channel.value)}
                      >
                        <Feather name={channel.icon as any} size={20} color="#FFF" />
                        <Text style={styles.actionButtonText}>{channel.actionText}</Text>
                      </TouchableOpacity>
                    </View>
                  )}
                </View>
              );
            })}
          </View>
        </View>

      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  scrollContent: {
    padding: 24,
    paddingTop: 32, // Mais respiro no topo sem o header
    paddingBottom: 60,
  },
  section: {
    marginBottom: 40, // Maior separação entre as seções
  },
  sectionHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 16,
  },
  sectionTitle: {
    fontSize: 20, // Fonte maior
    fontWeight: '700',
    color: '#111827',
    marginLeft: 12,
  },
  sectionSubtitle: {
    fontSize: 16, // Fonte maior
    color: '#4B5563',
    marginBottom: 20,
    lineHeight: 24, // Mais espaço entre linhas
  },
  infoCard: {
    backgroundColor: '#FEF2F2',
    borderRadius: 16,
    padding: 24, // Mais padding interno
    borderWidth: 1,
    borderColor: '#F8B4B4',
  },
  infoDescription: {
    fontSize: 16, // Fonte bem maior para leitura confortável
    color: '#991B1B',
    lineHeight: 28, // Respiro entre as linhas
  },
  divider: {
    height: 1,
    backgroundColor: '#F8B4B4',
    marginVertical: 20,
    opacity: 0.6,
  },
  lawItem: {
    marginBottom: 16,
  },
  lawTitle: {
    fontSize: 16,
    fontWeight: '700',
    color: '#991B1B',
    marginBottom: 6,
  },
  lawDesc: {
    fontSize: 15,
    color: '#B91C1C',
    lineHeight: 22,
  },
  channelsList: {
    gap: 16, // Mais espaço entre os cards
  },
  accordionCard: {
    backgroundColor: '#FFF',
    borderRadius: 16,
    borderWidth: 1,
    borderColor: '#E5E7EB',
    overflow: 'hidden', // Mantém o conteúdo dentro das bordas
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 8,
    elevation: 3,
  },
  accordionCardExpanded: {
    borderColor: '#F8B4B4', // Muda a cor da borda quando aberto para dar destaque
  },
  accordionHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    padding: 20, // Área de clique maior
    backgroundColor: '#FFF',
  },
  channelName: {
    fontSize: 16, // Nome do canal maior
    fontWeight: '700',
    color: '#111827',
    flex: 1,
    paddingRight: 16,
  },
  accordionContent: {
    paddingHorizontal: 20,
    paddingBottom: 20,
    backgroundColor: '#FFF',
  },
  channelDesc: {
    fontSize: 16,
    color: '#4B5563',
    lineHeight: 24,
    marginBottom: 20, // Espaço antes do botão
  },
  actionButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#D32F2F', // Botão vermelho sólido e de alta conversão
    paddingVertical: 14,
    borderRadius: 12,
    gap: 8, // Espaço entre ícone e texto
  },
  actionButtonText: {
    fontSize: 16,
    fontWeight: '700',
    color: '#FFF',
  },
});