import { StyleSheet, Text, View } from "react-native";

export function HeaderLogo() {

    return (
        <View style={styles.headerLeftContainer} >
            <View style={styles.logoCircle} />
            <Text style={styles.appName}>ONCOMENTE</Text>
        </View>
    );
}


const styles = StyleSheet.create({
    headerLeftContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 8,
        paddingLeft: 10,
    },
    logoCircle: {
        width: 32,
        height: 32,
        borderRadius: 16,
        backgroundColor: '#5CC6FF',
    },
    appName: {
        color: 'white',
        fontWeight: 'bold',
        fontSize: 14,
        letterSpacing: 1,
        textTransform: 'uppercase',
    }
});