import React from 'react';
import { View, StyleSheet, ScrollView, Linking, Alert } from 'react-native';
import ActionCardList, { BaseActionItem } from '@/src/components/ui/Pagers/ActionCardList';

const handleCall = (phone: string, name: string) => {
  Alert.alert(
    "Realizar Ligação",
    `Deseja ligar para ${name} (${phone})?`,
    [
      { text: "Cancelar", style: "cancel" },
      { text: "Ligar", onPress: () => Linking.openURL(`tel:${phone}`) }
    ]
  );
};

const canaisApoioData: BaseActionItem[] = [
  {
    id: '1',
    title: 'Disque 100',
    subtitle: 'Denúncias de maus-tratos e violações de direitos humanos.',
    action: () => handleCall('100', 'Disque 100'),
  },
  {
    id: '2',
    title: 'CVV - Apoio Emocional',
    subtitle: 'Disque 188. Prevenção do suicídio e apoio emocional.',
    action: () => handleCall('188', 'CVV'),
  },
  {
    id: '3',
    title: 'Ouvidoria SUS (Disque Saúde)',
    subtitle: 'Disque 136. Reclamações sobre atendimento e medicamentos.',
    action: () => handleCall('136', 'Disque Saúde 136'),
  }
];

const canaisJuridicosData: BaseActionItem[] = [
    {
        id: '4',
        title: 'Defensoria Pública',
        subtitle: 'Apoio jurídico gratuito para pacientes oncológicos.',
        action: () => Alert.alert("Defensoria", "Redirecionando para o site regional..."),
    }
];

export default function ReportsAreaIndex() {
  return (
    <View style={styles.container}>
      <View style={styles.headerSpacer} />
      
      <ScrollView style={styles.content} showsVerticalScrollIndicator={false}>
        <ActionCardList
          headerTitle="Canais de Denúncia" 
          description="Você não está sozinho. Utilize os canais abaixo para apoio emocional ou denúncia de irregularidades."
          data={canaisApoioData}
          containerStyle={styles.listSection}
        />

       
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#FFF',
  },
  headerSpacer: {
    height: 50, 
    width: '100%',
    backgroundColor: '#9B6CFF20', 
    borderBottomLeftRadius: 16,
    borderBottomRightRadius: 16,
  },
  content: {
    flex: 1,
    paddingHorizontal: 20, 
  },
  listSection: {
    marginTop: 10,
  }
});