import { StyleSheet, Text, View } from 'react-native';

export default function SelfCare() {
    return (
        <View style={styles.container}>
            <Text style={styles.text}>Página da Área de Autocuidados</Text>
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