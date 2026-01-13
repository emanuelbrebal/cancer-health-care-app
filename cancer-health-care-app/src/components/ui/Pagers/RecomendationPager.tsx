import { Colors } from '@/src/constants/Colors';
import { StyleSheet, View, Text, TouchableOpacity, FlatList } from 'react-native';
import { ImageContainer } from '../Images/ImageContainer';
import PagerHeader from './PagerHeader';
import { RecomendationType } from '@/src/constants/mockData';

const CARD_HEIGHT = 100;
const CARD_WIDTH = 160;

const SPACING = 8;

const SNAP_INTERVAL = CARD_WIDTH + SPACING;

interface RecomendationPagerProps {
    headerTitle?: string,
    recomendationPagerData?: RecomendationType[]
}

export default function RecomendationPager({ headerTitle, recomendationPagerData }: RecomendationPagerProps) {

    const handlePressCard = (item: any) => {
        console.log('Clicou no livro:', item.title);
    };
    return (
        <View style={styles.container}>
            <PagerHeader title={headerTitle} />
            <FlatList
                data={recomendationPagerData}
                keyExtractor={(item) => item.id.toString()}
                horizontal
                showsHorizontalScrollIndicator={false}
                snapToInterval={SNAP_INTERVAL}
                snapToAlignment="center"
                decelerationRate="fast"
                contentContainerStyle={{
                    gap: SPACING,
                }}
                renderItem={({ item }) => (
                    <TouchableOpacity
                        style={styles.card}
                        onPress={() => handlePressCard(item)}
                        activeOpacity={0.8}
                    >
                        <ImageContainer imagePath={item.image} />
                        <View style={styles.titleOverlay}>
                            <Text style={styles.titleText} numberOfLines={1}>
                                {item.title}
                            </Text>
                        </View>
                    </TouchableOpacity>
                )}
            />
        </View>
    );
}

const RADIUS = 16;

const styles = StyleSheet.create({
    container: {
        paddingVertical: 10,
    },
    card: {
        width: CARD_WIDTH,
        height: CARD_HEIGHT,
        backgroundColor: '#E0E0E0',
        borderRadius: RADIUS,
        borderColor: Colors.lilacPrimary,
        borderWidth: 0.5,
        overflow: 'hidden',

        elevation: 2,
        shadowColor: Colors.black,
        shadowOpacity: 0.1,
        shadowRadius: 4,
        shadowOffset: { width: 0, height: 2 },
    },

    title: {
        opacity: 1,
        fontSize: 12,
        color: Colors.white,
        textAlign: 'center'
    },
    titleOverlay: {
        position: 'absolute', 
        top: 0,           
        left: 0,
        right: 0,
        backgroundColor: Colors.lilacPrimary + '99',
        padding: 3,
        alignItems: 'center',
        borderTopRightRadius: RADIUS,
        borderTopLeftRadius: RADIUS,
        
    },
    titleText: {
        opacity: 1,
        color: Colors.white,
        fontSize: 12,
        fontWeight: '600',
    }
});