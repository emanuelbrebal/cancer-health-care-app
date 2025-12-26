import { Image, Text, View } from 'react-native';
import { DailyMessageStyles } from './DailyMessage.style';



export default function DailyMessage() {

  const message = {
    message: 'Você tem dado o melhor que pode. E isso é o suficiente!'
  }
  return (
    <View style={DailyMessageStyles.container}>


      <View style={DailyMessageStyles.helloMessageContainer}>
        <Text style={DailyMessageStyles.text}>Mensagem do dia!</Text>
        <Text style={DailyMessageStyles.subtext}>{message.message}</Text>

      </View>

      <View style={DailyMessageStyles.imageContainer}>
        <Image source={require('@assets/images/Home/purpleMascotPlaceholder.png')} style={DailyMessageStyles.image} resizeMode="contain" />
      </View>
    </View>
  );
}
