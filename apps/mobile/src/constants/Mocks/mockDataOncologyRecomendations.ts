import { Href } from "expo-router";
import { ImageSourcePropType } from "react-native";
import { MediaItem } from "./mockDataOncologyMedias";

export type RecomendationType = {
  id: number | string;
  title: string;
  description?: string;
  image?: ImageSourcePropType;
  imagePath?: string;
  route?: Href;
};

export const meditationData: MediaItem[] = [
  { id: 1, title: "Meditação para acalmar a mente e o coração.",                           url: "https://www.youtube.com/watch?v=jQ8fn7Th2ok" },
  { id: 2, title: "Mindfulness: Meditação Guiada",                                         url: "https://www.youtube.com/watch?v=OeEJP4ij2Jo" },
  { id: 3, title: "Meditação Guiada | ENTREGA e CONFIANÇA",                                url: "https://www.youtube.com/watch?v=F-82J7DNOCQ" },
  { id: 4, title: "Meditação Guiada Clássica - 10 MINUTOS | Mindfulness, paz, conexão!",  url: "https://www.youtube.com/watch?v=LEpFS8KdVQ8" },
  { id: 5, title: "Meditação Guiada 5 minutos! | Direta e profunda | Mindfulness",        url: "https://www.youtube.com/watch?v=mTJ56qy2Flg" },
];
