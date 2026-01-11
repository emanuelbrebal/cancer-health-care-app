import { StyleSheet, Text, View } from 'react-native';

export default function Nutrition() {
    return (
        <View style={styles.container}>
            <Text style={styles.text}>Página de cuidados em Nutrição</Text>
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: 'transparent',
    },
    text: {
        fontSize: 24,
        fontWeight: 'bold',
    },
});