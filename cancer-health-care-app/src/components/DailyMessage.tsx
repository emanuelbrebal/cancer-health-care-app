import { Image, StyleSheet, Text, View } from 'react-native';

export default function DailyMessage() {

  const message = {
    message: 'Você tem dado o melhor que pode. E isso é o suficiente!'
  }
  // transformar isso em um componente de mensagem + imagem de mascote genérica (para o )
  return (
    <View style={styles.container}>


      <View style={styles.helloMessageContainer}>
        <Text style={styles.text}>Mensagem do dia!</Text>
        <Text style={styles.subtext}>{message.message}</Text>

      </View>

      <View style={styles.imageContainer}>
        <Image source={require('@assets/images/Home/purpleMascotPlaceholder.png')} style={styles.image} resizeMode="contain" />
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    width: '90%',
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    fontFamily: 'Montserrat',
    padding: 10,
    gap: 15,
    backgroundColor: "#AFFFEC99",
    borderRadius: 20,

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
    height: 80,
    width: 80,
    transform: [{ scaleX: -1 }],
  },
  text: {
    fontSize: 18,
    color: "#0088FF",
    fontWeight: 'bold',
  },
  subtext: {
    fontSize: 14,
  }

});