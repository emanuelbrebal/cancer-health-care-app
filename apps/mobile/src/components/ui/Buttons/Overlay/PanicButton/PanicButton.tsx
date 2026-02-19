import { router } from "expo-router";
import { OverlayButton } from "../OverlayButton";
import * as Haptics from 'expo-haptics';

export function PanicButton() {
    const showPanicContacts = () => {
        Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Heavy);
        router.push('/MentalHealth/PanicButtonContacts');
    };

    return (
        <OverlayButton onPress={showPanicContacts} iconName="alert-circle-outline" />
    );
}