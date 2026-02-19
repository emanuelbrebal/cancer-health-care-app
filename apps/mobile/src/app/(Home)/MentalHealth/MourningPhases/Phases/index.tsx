import { HorizontalBanner } from '@/src/components/ui/Images/HorizontalBanner';
import { Colors } from '@/src/constants/Colors';
import { globalStyles } from '@/src/styles/global';
import { ScrollView, StyleSheet, Text, TouchableOpacity, View } from 'react-native';

export default function Phases() {
  return (
    <ScrollView contentContainerStyle={globalStyles.scrollContainer}
      showsVerticalScrollIndicator={true}>
      <View style={styles.container}>
        <HorizontalBanner />
        <View style={globalStyles.startContainer}>
          <Text style={globalStyles.title}>Quais são as fases do luto? </Text>
          <Text style={styles.text}>Lorem, ipsum dolor sit amet consectetur adipisicing elit. Blanditiis ipsam nemo velit totam nostrum iure quod nihil rem vitae in ratione perferendis, hic doloremque praesentium magnam reprehenderit amet veniam ex! </Text>
          <TouchableOpacity>
            <Text style={[styles.text, styles.hyperlink]}>Ver mais</Text>
          </TouchableOpacity>
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
  text: {
    ...globalStyles.title,
    fontSize: 12
  },
  hyperlink: {
    ...globalStyles.textHyperlink,
    color: Colors.purplePrimary,
    textAlign: 'left'
  }
});