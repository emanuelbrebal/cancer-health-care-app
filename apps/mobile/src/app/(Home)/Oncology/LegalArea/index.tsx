import DailyMessage from '@/src/components/home/DailyMessage/DailyMessage';
import { HorizontalBanner } from '@/src/components/ui/Images/HorizontalBanner';
import { Colors } from '@/src/constants/Colors';
import { globalStyles } from '@/src/styles/global';
import { ScrollView, StyleSheet, Text, TouchableOpacity, View, Linking } from 'react-native';

export default function LegalArea() {
  const url = 'https://educapes.capes.gov.br/bitstream/capes/921209/2/LEI%20dos%2060%20dias.pdf';

  return (
    <ScrollView contentContainerStyle={globalStyles.scrollContainer}
      showsVerticalScrollIndicator={true}>
      <View style={styles.container}>
        <DailyMessage title='Apoio Jurídico' message="Você não está sozinho. Estamos com você." />

        <View style={styles.contentWrapper}>
          <Text style={globalStyles.title}>Pacientes com câncer possuem direitos garantidos por lei.</Text>

          <Text style={styles.text}>
            O tratamento já exige muito de você, e a legislação existe para aliviar o peso financeiro e burocrático dessa jornada.
          </Text>

          <Text style={styles.text}>
            Descubra o passo a passo para garantir o início do tratamento em até 60 dias <Text style={{ fontWeight: 'bold' }}>
              (Lei nº 12.732/2012) </Text> e saiba como acessar benefícios fundamentais, como: <Text style={{ fontWeight: 'bold' }}>auxílio-doença, saque do FGTS, isenção de impostos e mais!</Text>.
          </Text>

          <TouchableOpacity onPress={() => Linking.openURL(url)} style={{ marginTop: 4 }}>
            <Text style={styles.hyperlink}>Ler a cartilha completa de direitos</Text>
          </TouchableOpacity>


        </View>

      </View>
    </ScrollView >
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: 'transparent',
    paddingTop: 30
  },
  contentWrapper: {
    paddingHorizontal: 20,
    paddingVertical: 20,
    gap: 16,
  },
  text: {
    ...globalStyles.title,
    fontSize: 14,
    fontWeight: '400',
    lineHeight: 22,
    color: '#4B5563',
    textAlign: 'justify'
  },
  hyperlink: {
    ...globalStyles.textHyperlink,
    color: Colors.purplePrimary,
    textAlign: 'left',
    textDecorationLine: 'underline',
    fontWeight: '600',
  }
});