import { color, radius, shadow, space, typography } from '@/src/constants/tokens';
import { Pressable, StyleSheet, View, Text, FlatList, Image } from 'react-native';
import PagerHeader from './PagerHeader';
import { RecomendationType } from '@/src/constants/Mocks/mockDataOncologyRecomendations';
import { router } from 'expo-router';
import { getMediaImage } from '@/src/constants/mediaImageMap';

const CARD_WIDTH = space.xl * 2 + space.sm;
const CARD_HEIGHT = CARD_WIDTH * 1.45;
const SNAP_INTERVAL = CARD_WIDTH + space.xs;

interface RecomendationPagerProps {
    headerTitle?: string;
    seeAllRoute?: string;
    recomendationPagerData?: RecomendationType[];
}

export default function RecomendationPager({ headerTitle, seeAllRoute, recomendationPagerData }: RecomendationPagerProps) {
    const handlePressCard = (item: RecomendationType) => {
        if (item.route) router.push(item.route as any);
    };

    return (
        <View style={styles.container}>
            <PagerHeader title={headerTitle} seeAllRoute={seeAllRoute} />
            <FlatList
                data={recomendationPagerData}
                keyExtractor={(item) => item.id.toString()}
                horizontal
                showsHorizontalScrollIndicator={false}
                snapToInterval={SNAP_INTERVAL}
                snapToAlignment="start"
                decelerationRate="fast"
                contentContainerStyle={styles.listContent}
                renderItem={({ item }) => {
                    const imageSource = item.image ?? getMediaImage(item.imagePath);
                    return (
                        <Pressable
                            style={({ pressed }) => [styles.card, pressed && styles.cardPressed]}
                            onPress={() => handlePressCard(item)}
                            accessibilityRole="button"
                            accessibilityLabel={item.title}
                            accessibilityHint="Abre os detalhes"
                        >
                            <Image source={imageSource} style={styles.image} resizeMode="cover" accessible={false} />
                            <View style={styles.titleOverlay}>
                                <Text style={styles.titleText} numberOfLines={2}>{item.title}</Text>
                            </View>
                        </Pressable>
                    );
                }}
            />
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        gap: space.xs,
    },
    listContent: {
        gap: space.xs,
        paddingHorizontal: space.xxs,
        paddingBottom: space.xs,
    },
    card: {
        width: CARD_WIDTH,
        height: CARD_HEIGHT,
        borderRadius: radius.md,
        overflow: 'hidden',
        backgroundColor: color.bg.brandMuted,
        ...shadow.sm,
    },
    cardPressed: {
        transform: [{ scale: 0.97 }],
        opacity: 0.9,
    },
    image: {
        width: '100%',
        height: '100%',
        position: 'absolute',
    },
    titleOverlay: {
        position: 'absolute',
        bottom: 0,
        left: 0,
        right: 0,
        backgroundColor: color.bg.scrim,
        paddingHorizontal: space.xs,
        paddingVertical: space.xs,
    },
    titleText: {
        ...typography.caption,
        fontFamily: typography.smallStrong.fontFamily,
        color: color.text.onAction,
    },
});
