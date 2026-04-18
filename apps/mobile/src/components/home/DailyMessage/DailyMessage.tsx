import { Image, Text, View, ImageSourcePropType } from 'react-native';
import { DailyMessageStyles } from './DailyMessage.style';
import { DailyMessages } from '@/src/constants/Mocks/mockDailyMessages';

export interface MessageItem {
  id?: string | number;
  title?: string;
  message: string;
}

interface DailyMessageProps {
  title?: string;
  message?: string | MessageItem[];
  noImg?: boolean;
  imageSource?: ImageSourcePropType | null;
}

export default function DailyMessage({
  title,
  message,
  noImg = false,
  imageSource
}: DailyMessageProps) {

  const getMessageOfTheDay = (dataArray: any[]) => {
    if (!dataArray || dataArray.length === 0) return null;

    const now = new Date();
    const start = new Date(now.getFullYear(), 0, 0);
    const diff = now.getTime() - start.getTime();
    const oneDay = 1000 * 60 * 60 * 24;
    const dayOfYear = Math.floor(diff / oneDay);

    const index = dayOfYear % dataArray.length;

    return dataArray[index];
  };

  let displayTitle = title || "Mensagem do Dia!";
  let displayMessage = "";

  if (Array.isArray(message)) {
    const todayItem = getMessageOfTheDay(message);
    if (todayItem) {
      displayTitle = todayItem.title || displayTitle;
      displayMessage = todayItem.message;
    }
  } else if (typeof message === 'object' && message !== null) {
    displayTitle = (message as any).title || displayTitle;
    displayMessage = (message as any).message;
  } else if (typeof message === 'string') {
    displayMessage = message;
  } else {
    const mockItem = getMessageOfTheDay(DailyMessages);
    if (mockItem) {
      displayMessage = mockItem.message;
    }
  }

  const shouldShowImage = !noImg && imageSource !== null && imageSource !== '';
  const finalImageSource = imageSource || require('@assets/images/Home/purpleMascotPlaceholder.png');

  return (
    <View style={DailyMessageStyles.container}>
      <View
        style={[
          DailyMessageStyles.helloMessageContainer,
          !shouldShowImage && { flex: 1, paddingLeft: 10, paddingRight: 10 }
        ]}
      >
        <Text
          style={[
            DailyMessageStyles.text,
            !shouldShowImage && { textAlign: 'justify' }
          ]}
        >
          {displayTitle}
        </Text>
        <Text
          style={[
            DailyMessageStyles.subtext,
            !shouldShowImage && { textAlign: 'justify' }
          ]}
        >
          {displayMessage}
        </Text>
      </View>

      {shouldShowImage && (
        <View style={DailyMessageStyles.imageContainer}>
          <Image
            source={finalImageSource}
            style={DailyMessageStyles.image}
            resizeMode="contain"
          />
        </View>
      )}
    </View>
  );
}