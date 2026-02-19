import { StyleSheet, Text, View } from "react-native";
import { Avatar } from "../ui/Images/Avatar";

export function HeaderLogo() {

    return (
        <View style={styles.headerLeftContainer} >
            <Avatar style={{height: 44, width: 44 }}/>
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
    appName: {
        color: 'white',
        fontWeight: 'bold',
        fontSize: 14,
        letterSpacing: 1,
        textTransform: 'uppercase',
    }
});