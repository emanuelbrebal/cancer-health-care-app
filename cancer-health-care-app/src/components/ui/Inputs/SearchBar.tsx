import { Colors } from "@/src/constants/Colors";
import { Feather } from "@expo/vector-icons";
import { StyleSheet, Text, TouchableOpacity, View } from "react-native";
import { InputWithIcon } from "./InputWithIcon";
import { globalStyles } from "@/src/styles/global";


export function SearchBar() {

    // fazer a função para chamar a tela de filtros
    return (
        <View style={[globalStyles.centeredContainer, styles.container]}>
            <View style={{ width: '75%' }}>
                <InputWithIcon iconRightName="search" iconColor={Colors.purplePrimary} style={styles.input} placeholder="Buscar" />
            </View>
            <TouchableOpacity style={styles.roundedButton}>
                <Feather name={"sliders"} size={20} color={Colors.purplePrimary}></Feather>
            </TouchableOpacity>
        </View>
    )
}

const styles = StyleSheet.create({
    container: {
        width: '100%',
        justifyContent: 'center',
        gap: 15,
        marginTop: 20,
    },
    input: {
        height: 40,
        borderColor: Colors.cyanSecondary,
        borderWidth: 2,
        borderRadius: 16,
        paddingHorizontal: 10,
    },
    roundedButton: {
        padding: 7,
        borderRadius: 20
    }
});