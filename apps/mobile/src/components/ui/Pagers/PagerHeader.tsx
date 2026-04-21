import { Colors } from '@/src/constants/Colors';
import { StyleSheet, Text, TouchableOpacity } from 'react-native';
import { Feather } from '@expo/vector-icons';
import { router } from 'expo-router';

interface PagerHeaderProps {
    title?: string;
    seeAllRoute?: string;
}

export default function PagerHeader({ title, seeAllRoute }: PagerHeaderProps) {
    return (
        <TouchableOpacity
            style={styles.header}
            onPress={() => seeAllRoute && router.push(seeAllRoute as any)}
            activeOpacity={seeAllRoute ? 0.6 : 1}
        >
            <Text style={styles.text}>{title ?? 'Recomendações'}</Text>
            <Feather name="chevron-right" size={22} color={seeAllRoute ? Colors.purpleSecondary : 'transparent'} />
        </TouchableOpacity>
    );
}

const styles = StyleSheet.create({
    header: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        paddingHorizontal: 16,
        marginBottom: 10,
        height: 40,
    },
    text: {
        fontSize: 14,
        fontWeight: '500',
        color: Colors.purpleSecondary,
    },
});