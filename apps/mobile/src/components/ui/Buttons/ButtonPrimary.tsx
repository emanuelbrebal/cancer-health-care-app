import { Button } from "@/src/components/ds/Button";
import { ButtonProps } from "@/src/interfaces/ui/ButtonProps";
import { ButtonStyles } from "@/src/styles/Buttons";

/** Atalho legado para o Button do Design System (variante primary). */
export function ButtonPrimary({ title, action, loading = false, disabled, accessibilityLabel }: ButtonProps) {
    return (
        <Button
            title={title}
            onPress={action}
            loading={loading}
            disabled={disabled}
            accessibilityLabel={accessibilityLabel}
            style={ButtonStyles.buttonPrimary}
        />
    )
}
