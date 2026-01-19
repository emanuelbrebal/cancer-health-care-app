import { StyleSheet, Text, View } from 'react-native';
import { globalStyles } from '@/src/styles/global';
import { ImageSourcePropType } from 'react-native';
import { HorizontalBanner } from '../../ui/Images/HorizontalBanner';

interface PublicationProps {
    publication: {
        text?: string;
        imagePath?: ImageSourcePropType;
    };
}

export default function Content({ publication }: PublicationProps) {
    const hasImage = !!publication.imagePath;

    return (
        <View style={[globalStyles.dynamicContent, styles.container]}>
            <Text style={styles.textContent}>
                {publication.text || "Conteúdo não disponível."}
            </Text>

            {hasImage && (
                <HorizontalBanner style={{ width: '100%', marginHorizontal: 0 }} />
            )}
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        width: '100%',
    },
    textContent: {
        fontSize: 16,
        fontWeight: '600',
        lineHeight: 22,
        color: '#333',
        marginBottom: 12,
    },
});