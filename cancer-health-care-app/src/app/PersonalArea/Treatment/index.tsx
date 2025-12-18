import { StyleSheet, Text, View } from 'react-native';

export default function Treatment() {
    return (
        <View style={styles.container}>
            <Text style={styles.text}>Página da Gerência de Tratamentos</Text>
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