import { Colors } from '@/src/constants/Colors';
import { StyleSheet, Text, TouchableOpacity } from 'react-native';
import { Feather } from '@expo/vector-icons';

interface PagerHeaderProps {
    title?: string,
    action?: string
}

export default function PagerHeader({ title, action }: PagerHeaderProps) {
    return (
        <TouchableOpacity style={styles.header}>
            <Text style={styles.text}>{title ? title : 'Recomendações'}</Text>
            <Feather name={"chevron-right"} size={22} color={Colors.purpleSecondary} />
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