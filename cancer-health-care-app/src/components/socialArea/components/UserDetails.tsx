import { StyleSheet, Text, View } from "react-native";
import { globalStyles } from "@/src/styles/global";
import { Avatar } from "../../ui/Images/Avatar";

export function UserDetailsComponent() {
    const username = "Marcela Souza";

    const userDetails = {
        date: "4 de Dezembro de 2025",
        time: "20:20",
        place: "Maceió, AL"
    };

    return (
        <View style={styles.container}>
            <Avatar style={styles.avatar} />

            <View style={styles.textContainer}>
                <Text style={[globalStyles.title, styles.username]}>
                    {username}
                </Text>
                <Text style={[globalStyles.textSecondary, styles.details]}>
                    {userDetails.date}, às {userDetails.time} - {userDetails.place}
                </Text>
            </View>
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flexDirection: 'row',
        alignItems: 'center',
        height: 50, 
        gap: 10,
    },
    avatar: {
        width: 44,
        height: 44,
        borderRadius: 22,
    },
    textContainer: {
        height: 44,
        justifyContent: 'center', 
        flex: 1,
    },
    username: {
        fontSize: 14,
        lineHeight: 18,
        marginBottom: 4, 
    },
    details: {
        fontSize: 12,
        lineHeight: 14,
    },
});