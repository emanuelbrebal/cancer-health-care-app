import DailyMessage from '@/src/components/home/DailyMessage/DailyMessage';
import { HorizontalBanner } from '@/src/components/ui/Images/HorizontalBanner';
import { Colors } from '@/src/constants/Colors';
import { globalStyles } from '@/src/styles/global';
import { ScrollView, StyleSheet, Text, View } from 'react-native';

export default function PsycologicalSupport() {

  return (
    <ScrollView contentContainerStyle={globalStyles.scrollContainer}
      showsVerticalScrollIndicator={true}>
      <View style={styles.container}>

        <DailyMessage title='Mensagem:' message="Pedir ajuda é um ato de coragem, não de fraqueza." />

        {/* voltar aqui. formatar os textos como forma de tutorial passo a passo */}
        <View style={globalStyles.startContainer}>
          <Text style={globalStyles.title}>Buscar ajuda profissional é um passo importante para cuidar da sua saúde mental.</Text>
          <Text style={globalStyles.descriptionText}>
            • Procure psicólogos na rede pública (SUS)
          </Text>
          <Text style={globalStyles.descriptionText}>
            • Busque apoio em hospitais oncológicos
          </Text>
          <Text style={globalStyles.descriptionText}>
            • Converse com sua equipe de saúde
          </Text>
          <Text style={globalStyles.descriptionText}>
            • Grupos de apoio podem ajudar
          </Text>

        </View>

      </View>
    </ScrollView >
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    gap: 20,
    backgroundColor: 'transparent',
    paddingTop: 20
  },
});