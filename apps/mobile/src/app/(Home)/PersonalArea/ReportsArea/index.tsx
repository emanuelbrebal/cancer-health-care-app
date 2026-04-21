import React, { useState } from 'react';
import { View, Text, StyleSheet, ScrollView, Alert, Linking } from 'react-native';
import { Feather } from '@expo/vector-icons';
import { useHeaderHeight } from '@react-navigation/elements';
import { globalStyles } from '@/src/styles/global';
import { AccordionCard } from '@/src/components/ui/Accordion/AccordionCard';

const DISCRIMINATION_TYPES = [
  { id: '1', title: 'No trabalho', description: 'Demissão, rebaixamento, recusa de promoção ou assédio moral motivados pelo diagnóstico de câncer. A Súmula 443 do TST presume discriminatória qualquer dispensa de portador de doença grave.' },
  { id: '2', title: 'No plano de saúde', description: 'Negativa de cobertura de quimioterapia, radioterapia, cirurgia ou medicamentos. A ANS proíbe exclusões arbitrárias para doenças oncológicas.' },
  { id: '3', title: 'No atendimento de saúde', description: 'Tratamento desumano, descaso, ignorar queixas ou atrasar procedimentos sem justificativa clínica. O Estatuto da Pessoa com Câncer (Lei 14.238/2021) garante atendimento integral e humanizado.' },
  { id: '4', title: 'Social e familiar', description: 'Isolamento, constrangimento ou julgamento por conta do diagnóstico, da aparência (perda de cabelo, cicatrizes) ou das limitações físicas causadas pelo tratamento.' },
];

const PREVENTION_TIPS = [
  { id: '1', title: 'Documente tudo', description: 'Guarde laudos, receitas, conversas por escrito (e-mail, WhatsApp), protocolos de atendimento e qualquer negativa recebida. Registros são sua maior proteção.' },
  { id: '2', title: 'Conheça seus direitos', description: 'Leia a aba "Benefícios Legais" neste aplicativo. Saber o que a lei garante é o primeiro passo para defender seus direitos.' },
  { id: '3', title: 'Não aceite negativas verbais', description: 'Exija sempre respostas por escrito — de planos de saúde, empregadores e hospitais. Negativas verbais são difíceis de contestar.' },
  { id: '4', title: 'Busque apoio', description: 'Grupos de pacientes, assistentes sociais e o CAVIDA em Maceió podem orientar e apoiar antes mesmo de uma denúncia formal.' },
];

const REPORT_CHANNELS = [
  { id: '1', title: 'Ouvidoria do SUS — Disque 136', description: 'Denúncie falta de medicamentos, demora abusiva para exames e cirurgias oncológicas ou mau atendimento na rede pública de saúde.', type: 'phone', value: '136', action: 'Ligar para 136' },
  { id: '2', title: 'ANS — Planos de Saúde Privados', description: 'Sofreu negativa de cobertura pelo seu convênio? A Agência Nacional de Saúde Suplementar recebe e investiga sua reclamação.', type: 'phone', value: '08007019656', action: 'Ligue 0800 701 9656' },
  { id: '3', title: 'Defensoria Pública — Disque 129', description: 'Assistência jurídica gratuita para garantir na Justiça o acesso a cirurgias, tratamentos e medicamentos negados.', type: 'phone', value: '129', action: 'Ligar para 129' },
  { id: '4', title: 'CREMAL — Conselho Regional de Medicina', description: 'Denúncias formais contra médicos por erro, descaso ou omissão de socorro no Estado de Alagoas.', type: 'link', value: 'https://cremal.org.br/ouvidoria/', action: 'Acessar ouvidoria online' },
  { id: '5', title: 'Procon Alagoas', description: 'Problemas com planos de saúde, cobranças indevidas ou descumprimento de contrato. Atende presencialmente e pelo site.', type: 'link', value: 'https://www.procon.al.gov.br', action: 'Acessar site do Procon' },
];

export default function ReportsAreaScreen() {
  const headerHeight = useHeaderHeight();
  const [expandedAwareness, setExpandedAwareness] = useState<string | null>(null);
  const [expandedPrevention, setExpandedPrevention] = useState<string | null>(null);
  const [expandedChannel, setExpandedChannel] = useState<string | null>(null);

  const handleAction = async (type: string, value: string) => {
    try {
      const url = type === 'phone' ? `tel:${value.replace(/\D/g, '')}` : value;
      const supported = await Linking.canOpenURL(url);
      if (supported) {
        await Linking.openURL(url);
      } else {
        Alert.alert('Atenção', 'Não foi possível abrir este link ou realizar a chamada.');
      }
    } catch {
      Alert.alert('Erro', 'Ocorreu um erro ao tentar acessar o canal.');
    }
  };

  return (
    <View style={[globalStyles.startContainer, { paddingTop: headerHeight }]}>
      <ScrollView contentContainerStyle={styles.content} showsVerticalScrollIndicator={false}>

        <View style={styles.heroBanner}>
          <Feather name="shield" size={28} color="#7C3AED" />
          <Text style={styles.heroTitle}>Você não merece passar por isso.</Text>
          <Text style={styles.heroSubtitle}>
            Discriminação por causa do câncer é inaceitável e punível por lei. Aqui você encontra informação e os canais certos para agir.
          </Text>
        </View>

        <Section icon="help-circle" label="O que é discriminação?" color="#7C3AED">
          <Text style={styles.bodyText}>
            É qualquer tratamento injusto, humilhante ou prejudicial motivado pelo diagnóstico de câncer — seja no trabalho, no sistema de saúde, nos planos de saúde ou nas relações sociais e familiares.
          </Text>
          <Text style={[styles.bodyText, { marginTop: 10 }]}>
            Não se resume a atos explícitos. Ignorar, atrasar, negligenciar ou isolar também são formas de discriminação.
          </Text>
        </Section>

        <Section icon="list" label="Tipos mais comuns" color="#0284C7">
          {DISCRIMINATION_TYPES.map(item => (
            <AccordionCard
              key={item.id}
              title={item.title}
              description={item.description}
              isExpanded={expandedAwareness === item.id}
              onToggle={() => setExpandedAwareness(p => p === item.id ? null : item.id)}
              chevronColor="#0284C7"
              expandedBorderColor="#BFDBFE"
            />
          ))}
        </Section>

        <Section icon="lock" label="Como se prevenir" color="#059669">
          {PREVENTION_TIPS.map(item => (
            <AccordionCard
              key={item.id}
              title={item.title}
              description={item.description}
              isExpanded={expandedPrevention === item.id}
              onToggle={() => setExpandedPrevention(p => p === item.id ? null : item.id)}
              chevronColor="#059669"
              expandedBorderColor="#A7F3D0"
            />
          ))}
        </Section>

        <Section icon="phone-call" label="Como denunciar" color="#DC2626">
          {REPORT_CHANNELS.map(item => (
            <AccordionCard
              key={item.id}
              title={item.title}
              description={item.description}
              isExpanded={expandedChannel === item.id}
              onToggle={() => setExpandedChannel(p => p === item.id ? null : item.id)}
              actionText={item.action}
              actionIcon={item.type === 'phone' ? 'phone-call' : 'external-link'}
              onAction={() => handleAction(item.type, item.value)}
              actionButtonColor="#DC2626"
              chevronColor="#DC2626"
              expandedBorderColor="#FECACA"
            />
          ))}
        </Section>

      </ScrollView>
    </View>
  );
}

function Section({ icon, label, color, children }: { icon: string; label: string; color: string; children: React.ReactNode }) {
  return (
    <View style={styles.section}>
      <View style={styles.sectionHeader}>
        <Feather name={icon as any} size={20} color={color} />
        <Text style={[styles.sectionTitle, { color }]}>{label}</Text>
      </View>
      <View style={styles.sectionBody}>{children}</View>
    </View>
  );
}

const styles = StyleSheet.create({
  content: {
    padding: 20,
    paddingTop: 24,
    paddingBottom: 60,
    gap: 28,
  },
  heroBanner: {
    backgroundColor: '#F5F3FF',
    borderRadius: 20,
    padding: 24,
    alignItems: 'center',
    gap: 12,
    borderWidth: 1,
    borderColor: '#DDD6FE',
  },
  heroTitle: {
    fontSize: 22,
    fontWeight: '800',
    color: '#4C1D95',
    textAlign: 'center',
  },
  heroSubtitle: {
    fontSize: 15,
    color: '#5B21B6',
    textAlign: 'center',
    lineHeight: 22,
  },
  section: {
    gap: 14,
  },
  sectionHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: '700',
  },
  sectionBody: {
    gap: 10,
  },
  bodyText: {
    fontSize: 15,
    color: '#374151',
    lineHeight: 24,
  },
});
