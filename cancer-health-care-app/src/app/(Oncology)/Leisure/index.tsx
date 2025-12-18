import { router } from 'expo-router';
import { Button, StyleSheet, Text, View } from 'react-native';

export default function Leisure() {
    return (
        <View style={styles.container}>
            <Text style={styles.text}>Página da Área de recomendação de atividades de lazer</Text>

            <Button title="Voltar" onPress={() => router.back()}/>

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