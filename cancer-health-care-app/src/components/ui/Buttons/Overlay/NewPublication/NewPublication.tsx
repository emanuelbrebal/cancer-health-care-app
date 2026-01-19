import { router } from "expo-router";
import { OverlayButton } from "../OverlayButton";

export function NewPublicationButton() {
    const redirectCreatePublication = () => {
        console.log("Estou tentando criar uma nova publicação aqui!");
        //fazer a rota
    };

    return (
        <OverlayButton onPress={redirectCreatePublication} iconName="add"
            size={50} style={{ width: 50, height: 50}} />
    );
}