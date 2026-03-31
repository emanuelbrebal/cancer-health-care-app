import React, { useState } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, Linking, Alert } from 'react-native';
import { Feather } from '@expo/vector-icons';
import { globalStyles } from '@/src/styles/global';
import { AccordionCard } from '@/src/components/ui/Accordion/AccordionCard';

const LEGAL_INFO = {
  description: 'Você não está sozinho. O descaso, a negligência e a discriminação por conta da sua condição de saúde são inaceitáveis. Você tem direito a um tratamento digno e humanizado.',
  laws: [
    { id: '1', title: 'Estatuto da Pessoa com Câncer (Lei Nº 14.238/2021)', desc: 'Garante o atendimento integral, proibindo qualquer forma de negligência ou discriminação.' },
    { id: '2', title: 'Negligência e Descaso (Código Civil e CDC)', desc: 'Falhas no atendimento hospitalar, como ser ignorado ou ter o tratamento adiado sem justificativa.' },
    { id: '3', title: 'Discriminação no Trabalho (Súmula 443, TST)', desc: 'Protege o paciente oncológico contra demissões discriminatórias ou tratamento hostil.' },
  ]
};

const REPORT_CHANNELS = [
  {
    id: '1',
    name: 'Ouvidoria do SUS',
    description: 'Canal oficial para denunciar falta de medicamentos, demora abusiva para exames/cirurgias oncológicas ou mau atendimento na rede pública.',
    actionText: 'Disque 136',
    icon: 'phone-call',
    type: 'phone',
    value: '136',
  },
  {
    id: '2',
    name: 'Defensoria Pública (DPE-AL)',
    description: 'Assistência jurídica gratuita para garantir na Justiça o acesso a cirurgias, tratamentos e medicamentos oncológicos negados pelo Estado.',
    actionText: 'Disque 129',
    icon: 'phone-call',
    type: 'phone',
    value: '129',
  },
  {
    id: '3',
    name: 'CREMAL (Conselho Regional)',
    description: 'Órgão responsável por apurar denúncias formais contra médicos em Alagoas por erro, descaso ou omissão de socorro.',
    actionText: 'Acessar Ouvidoria',
    icon: 'external-link',
    type: 'link',
    value: 'https://cremal.org.br/ouvidoria/',
  },
  {
    id: '4',
    name: 'ANS (Planos Privados)',
    description: 'Sofreu discriminação ou negativa de cobertura de quimioterapia/radioterapia pelo seu convênio médico? Denuncie na Agência Nacional de Saúde.',
    actionText: 'Ligue 0800 701 9656',
    icon: 'phone-call',
    type: 'phone',
    value: '08007019656',
  }
];

export default function ReportsAreaScreen() {
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

        <View style={styles.section}>
          <View style={styles.sectionHeader}>
            <Feather name="shield" size={24} color="#D32F2F" />
            <Text style={styles.sectionTitle}>Onde Denunciar</Text>
          </View>
          
          <Text style={styles.sectionSubtitle}>
            Toque em uma das opções abaixo para ver mais detalhes e acessar o canal de forma segura.
          </Text>

          <View style={styles.channelsList}>
            {REPORT_CHANNELS.map((channel) => (
              <AccordionCard
                key={channel.id}
                title={channel.name}
                description={channel.description}
                isExpanded={expandedId === channel.id}
                onToggle={() => toggleExpand(channel.id)}
                actionText={channel.actionText}
                actionIcon={channel.icon}
                onAction={() => handleAction(channel.type, channel.value)}
              />
            ))}
          </View>
        </View>

      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  scrollContent: {
    padding: 24,
    paddingTop: 32,
    paddingBottom: 60,
  },
  section: {
    marginBottom: 40,
  },
  sectionHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 16,
  },
  sectionTitle: {
    fontSize: 22,
    fontWeight: '700',
    color: '#111827',
    marginLeft: 12,
  },
  sectionSubtitle: {
    fontSize: 16,
    color: '#4B5563',
    marginBottom: 20,
    lineHeight: 24,
  },
  infoCard: {
    backgroundColor: '#FEF2F2',
    borderRadius: 16,
    padding: 24,
    borderWidth: 1,
    borderColor: '#F8B4B4',
  },
  infoDescription: {
    fontSize: 18,
    color: '#991B1B',
    lineHeight: 28,
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
    gap: 16,
  },
});