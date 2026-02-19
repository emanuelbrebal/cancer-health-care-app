import { Image, StyleSheet, Text, View } from 'react-native';
interface patient {
  patient_name: string
}
export default function HelloMessage({ patient_name }: patient) {

  return (
    <View style={styles.container}>

      <View style={styles.helloMessageContainer}>
        <Text style={styles.text}>Olá, {patient_name? patient_name : 'Paciente'}!</Text>
        <Text style={styles.text}>Que bom te ter aqui!</Text>
        <Text style={styles.subtext}>Vamos cuidar de você hoje?</Text>
      </View>

      <View style={styles.imageContainer}>
        <Image source={require('@assets/images/Home/blueMascotPlaceholder.png')} style={styles.image} resizeMode="contain" />
      </View>
    </View>
  );
}

const styles = StyleSheet.create({

  container: {
    height: '30%',
    width: '100%',
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    fontFamily: 'Montserrat',
    paddingTop: 30
  },
  helloMessageContainer: {
    paddingLeft: 20,
    width: '68%',
  },
  imageContainer: {
    width: '30%',
    justifyContent: 'center',
    paddingRight: 20,
  },
  image: {
    height: 130,
    width: 130,
    transform: [{ scaleX: -1 }],
  },
  text: {
    fontSize: 18,
    fontWeight: 'bold',
  },
  subtext: {
    fontSize: 14,
  }
});