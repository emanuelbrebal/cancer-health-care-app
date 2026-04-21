import React, { useState, useEffect } from 'react';
import { View, StyleSheet, ActivityIndicator, Text } from 'react-native';
import { Image } from 'expo-image';
import { useVideoPlayer, VideoView } from 'expo-video';
import YoutubeIframe from 'react-native-youtube-iframe';

const extractYoutubeId = (url: any) => {
  if (typeof url !== 'string') return null;
  const regex = /(?:youtube\.com\/(?:[^\/]+\/.+\/|(?:v|e(?:mbed)?)\/|.*[?&]v=)|youtu\.be\/)([^"&?\/\s]{11})/i;
  const match = url.match(regex);
  return match ? match[1] : null;
};

export interface MediaViewerProps {
  url: any;
  width?: number | `${number}%`;
  height?: number;
  play?: boolean;
}

export const MediaViewer = ({ url, width = '100%', height = 200, play = false }: MediaViewerProps) => {
  const [isReady, setIsReady] = useState(false);

  if (!url) return null;

  const isGif = typeof url === 'string' && url.toLowerCase().endsWith('.gif');

  const isLocalVideo = typeof url === 'number';
  const isRemoteVideo = typeof url === 'string' && url.toLowerCase().endsWith('.mp4');

  const player = useVideoPlayer(url, (player) => {
    player.loop = true;
    player.muted = true;
    if (play) player.play();
  });

  useEffect(() => {
    if (isLocalVideo || isRemoteVideo) {
      if (play) {
        player.play();
      } else {
        player.pause();
      }
    }
  }, [play, player]);

  if (isGif) {
    return (
      <View style={[styles.container, { width, height: 300 }]}>
        <Image source={url} style={styles.media} contentFit="cover" />
      </View>
    );
  }

  if (isLocalVideo || isRemoteVideo) {
    return (
      <View style={styles.portraitContainer}>
        <VideoView
          player={player}
          style={StyleSheet.absoluteFill}
          contentFit="cover"
          nativeControls={true}
        />
      </View>
    );
  }

  const youtubeId = extractYoutubeId(url);
  if (youtubeId) {
    return (
      <View style={[styles.container, { width, height }]}>
        {!isReady && (
          <View style={styles.loaderContainer}>
            <ActivityIndicator size="large" color="#ffffff" />
          </View>
        )}
        <YoutubeIframe
          height={height}
          width={width}
          videoId={youtubeId}
          play={play}
          onReady={() => setIsReady(true)}
        />
      </View>
    );
  }

  return (
    <View style={[styles.container, styles.errorContainer, { width, height }]}>
      <Text style={styles.errorText}>Mídia não suportada.</Text>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    backgroundColor: '#000',
    justifyContent: 'center',
    alignItems: 'center',
    overflow: 'hidden',
  },
  media: {
    flex: 1,
    width: '100%',
    height: '100%',
  },
  loaderContainer: {
    ...StyleSheet.absoluteFillObject,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(0,0,0,0.5)',
  },
  portraitContainer: {
    width: '100%',
    aspectRatio: 9 / 16,
    backgroundColor: '#000',
    overflow: 'hidden',
  },
  errorContainer: { backgroundColor: '#2a0000' },
  errorText: { color: '#ff6b6b', fontSize: 14 }
});
