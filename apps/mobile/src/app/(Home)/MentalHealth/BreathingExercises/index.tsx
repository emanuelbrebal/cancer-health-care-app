import DailyMessage from '@/src/components/home/DailyMessage/DailyMessage';
import { HorizontalBanner } from '@/src/components/ui/Images/HorizontalBanner';
import { Colors } from '@/src/constants/Colors';
import { globalStyles } from '@/src/styles/global';
import { ScrollView, StyleSheet, Text, View } from 'react-native';

export default function BreathingExercises() {

  return (
    <ScrollView contentContainerStyle={globalStyles.scrollContainer}
      showsVerticalScrollIndicator={true}>
      <View style={styles.container}>
        <View>
          <HorizontalBanner />
        </View>
        {/* voltar aqui. formatar os textos como forma de tutorial passo a passo */}
        <View style={globalStyles.startContainer}>
          <Text style={globalStyles.title}>Respire e desacelere</Text>
          <Text style={globalStyles.descriptionText}>A respiração consciente ajuda a reduzir a ansiedade e trazer sensação de calma.

            Exercício guiado:
            Inspire pelo nariz contando até 4…
            Segure por 2 segundos…
            Expire lentamente pela boca contando até 6…

            Repita por alguns minutos.</Text>
          <DailyMessage title='Orientação:' message="Seu corpo responde ao seu ritmo. Respire com calma." />


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
  },
});