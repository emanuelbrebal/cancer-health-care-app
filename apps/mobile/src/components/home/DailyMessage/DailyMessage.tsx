import { Image, Text, View } from 'react-native';
import { DailyMessageStyles } from './DailyMessage.style';
import { DailyMessages } from '@/src/constants/Mocks/mockDailyMessages';

interface DailyMessageProps{
  title?: string,
  message: string
}
export default function DailyMessage({title, message}: DailyMessageProps) {

  const getDailyMessage = () => {
    const now = new Date();
    const start = new Date(now.getFullYear(), 0, 0);
    const diff = now.getTime() - start.getTime();
    const oneDay = 1000 * 60 * 60 * 24;
    const dayOfYear = Math.floor(diff / oneDay);

    const messageIndex = dayOfYear % DailyMessages.length;

    return DailyMessages[messageIndex].message;
  };

  const dailyMessage = getDailyMessage();

  return (
    <View style={DailyMessageStyles.container}>

      <View style={DailyMessageStyles.helloMessageContainer}>
        <Text style={DailyMessageStyles.text}>{title ? title : "Mensagem do Dia!"}</Text>
        <Text style={DailyMessageStyles.subtext}>{message ? message : dailyMessage}</Text>
      </View>

      <View style={DailyMessageStyles.imageContainer}>
        <Image source={require('@assets/images/Home/purpleMascotPlaceholder.png')} style={DailyMessageStyles.image} resizeMode="contain" />
      </View>
    </View>
  );
}
