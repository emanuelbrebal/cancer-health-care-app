import { StyleSheet, Text, View } from 'react-native';

export default function ReportsArea() {
    return (
        <View style={styles.container}>
            <Text style={styles.text}>Página da Área de Informações de Denúncia</Text>
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: '#89e4ffff',
    },
    text: {
        fontSize: 24,
        fontWeight: 'bold',
    },
});