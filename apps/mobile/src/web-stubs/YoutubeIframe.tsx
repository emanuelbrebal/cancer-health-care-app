import { createElement, useEffect } from 'react';

// Stub web: react-native-youtube-iframe depende de react-native-web-webview.
// No navegador basta o iframe de embed do YouTube.
interface Props {
  videoId: string;
  height?: number;
  width?: number;
  play?: boolean;
  onReady?: () => void;
}

export default function YoutubeIframe({ videoId, height = 200, width, play, onReady }: Props) {
  useEffect(() => { onReady?.(); }, [onReady]);
  return createElement('iframe', {
    src: `https://www.youtube.com/embed/${videoId}${play ? '?autoplay=1' : ''}`,
    title: 'Vídeo do YouTube',
    allow: 'autoplay; encrypted-media',
    style: { border: 0, width: width ?? '100%', height },
  });
}
