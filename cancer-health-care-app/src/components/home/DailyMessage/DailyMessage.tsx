import { Image, Text, View } from 'react-native';
import { DailyMessageStyles } from './DailyMessage.style';

interface DailyMessageProps {
  title?: string
  message: string
}

export default function DailyMessage({ title, message }: DailyMessageProps) {
  return (
    <View style={DailyMessageStyles.container}>

      <View style={DailyMessageStyles.helloMessageContainer}>
        <Text style={DailyMessageStyles.text}>{title ? title : "Mensagem do dia!"}</Text>
        <Text style={DailyMessageStyles.subtext}>{message ? message : "Mensagem do dia!"}</Text>
      </View>

      <View style={DailyMessageStyles.imageContainer}>
        <Image source={require('@assets/images/Home/purpleMascotPlaceholder.png')} style={DailyMessageStyles.image} resizeMode="contain" />
      </View>
    </View>
  );
}
