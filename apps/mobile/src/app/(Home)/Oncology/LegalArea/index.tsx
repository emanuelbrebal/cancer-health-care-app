import DailyMessage from '@/src/components/home/DailyMessage/DailyMessage';
import { Colors } from '@/src/constants/Colors';
import { globalStyles } from '@/src/styles/global';
import { ScrollView, StyleSheet, Text, TouchableOpacity, View, Linking } from 'react-native';
import { Feather } from '@expo/vector-icons';

const CARTILHA_URL = 'https://educapes.capes.gov.br/bitstream/capes/921209/2/LEI%20dos%2060%20dias.pdf';

export default function LegalArea() {
  return (
    <ScrollView
      contentContainerStyle={globalStyles.scrollContainer}
      showsVerticalScrollIndicator={true}
    >
      <View style={styles.container}>
        <DailyMessage title='Apoio Jurídico' message="Você não está sozinho. Estamos com você." />

        <View style={styles.contentWrapper}>
          <Text style={globalStyles.title}>Pacientes com câncer possuem direitos garantidos por lei.</Text>

          <Text style={styles.text}>
            O tratamento já exige muito de você, e a legislação existe para aliviar o peso financeiro e burocrático dessa jornada.
          </Text>

          <Text style={styles.text}>
            Descubra o passo a passo para garantir o início do tratamento em até 60 dias{' '}
            <Text style={{ fontWeight: 'bold' }}>(Lei nº 12.732/2012)</Text>{' '}
            e saiba como acessar benefícios fundamentais, como:{' '}
            <Text style={{ fontWeight: 'bold' }}>auxílio-doença, saque do FGTS, isenção de impostos e mais!</Text>.
          </Text>

          <TouchableOpacity
            style={styles.cartilhaCard}
            onPress={() => Linking.openURL(CARTILHA_URL)}
            activeOpacity={0.75}
          >
            <View style={styles.cartilhaIconWrapper}>
              <Feather name="file-text" size={32} color={Colors.purplePrimary} />
            </View>
            <View style={styles.cartilhaTextWrapper}>
              <Text style={styles.cartilhaTitle}>Cartilha de Direitos</Text>
              <Text style={styles.cartilhaSubtitle}>Lei dos 60 dias — Lei nº 12.732/2012</Text>
              <View style={styles.cartilhaLink}>
                <Feather name="external-link" size={12} color={Colors.purpleSecondary} />
                <Text style={styles.cartilhaLinkText}>Abrir PDF oficial</Text>
              </View>
            </View>
            <Feather name="chevron-right" size={20} color="#CCC" />
          </TouchableOpacity>
        </View>
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: 'transparent',
    paddingTop: 30,
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
    textAlign: 'justify',
  },
  cartilhaCard: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#FFF',
    borderRadius: 16,
    padding: 16,
    borderWidth: 1,
    borderColor: '#E9DEFA',
    gap: 14,
    shadowColor: '#000',
    shadowOpacity: 0.05,
    shadowRadius: 6,
    elevation: 2,
    marginTop: 4,
  },
  cartilhaIconWrapper: {
    width: 56,
    height: 56,
    borderRadius: 14,
    backgroundColor: '#F5F0FA',
    justifyContent: 'center',
    alignItems: 'center',
  },
  cartilhaTextWrapper: {
    flex: 1,
    gap: 2,
  },
  cartilhaTitle: {
    fontSize: 15,
    fontWeight: '700',
    color: '#1A1A2E',
    fontFamily: 'Montserrat',
  },
  cartilhaSubtitle: {
    fontSize: 12,
    color: '#666',
    fontFamily: 'Montserrat',
  },
  cartilhaLink: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    marginTop: 4,
  },
  cartilhaLinkText: {
    fontSize: 12,
    color: Colors.purpleSecondary,
    fontWeight: '600',
    fontFamily: 'Montserrat',
  },
});
