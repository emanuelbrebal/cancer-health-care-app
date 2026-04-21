import { Colors } from '@/src/constants/Colors';
import { StyleSheet, View, Text, TouchableOpacity, FlatList, Image } from 'react-native';
import PagerHeader from './PagerHeader';
import { RecomendationType } from '@/src/constants/Mocks/mockDataOncologyRecomendations';
import { router } from 'expo-router';
import { getMediaImage } from '@/src/constants/mediaImageMap';

const CARD_HEIGHT = 160;
const CARD_WIDTH = 110;
const SPACING = 10;
const SNAP_INTERVAL = CARD_WIDTH + SPACING;
const RADIUS = 12;

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
                contentContainerStyle={{ gap: SPACING, paddingHorizontal: 2 }}
                renderItem={({ item }) => {
                    const imageSource = item.image ?? getMediaImage(item.imagePath);
                    return (
                        <TouchableOpacity
                            style={styles.card}
                            onPress={() => handlePressCard(item)}
                            activeOpacity={0.8}
                        >
                            <Image source={imageSource} style={styles.image} resizeMode="cover" />
                            <View style={styles.titleOverlay}>
                                <Text style={styles.titleText} numberOfLines={2}>{item.title}</Text>
                            </View>
                        </TouchableOpacity>
                    );
                }}
            />
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        paddingVertical: 5,
    },
    card: {
        width: CARD_WIDTH,
        height: CARD_HEIGHT,
        borderRadius: RADIUS,
        overflow: 'hidden',
        elevation: 3,
        shadowColor: Colors.black,
        shadowOpacity: 0.15,
        shadowRadius: 4,
        shadowOffset: { width: 0, height: 2 },
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
        backgroundColor: 'rgba(0,0,0,0.58)',
        paddingHorizontal: 7,
        paddingVertical: 6,
    },
    titleText: {
        fontFamily: 'Montserrat',
        color: '#FFF',
        fontSize: 10,
        fontWeight: '600',
        lineHeight: 14,
    },
});
