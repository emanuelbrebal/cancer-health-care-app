import { Button } from "@/src/components/ds/Button";
import { ButtonProps } from "@/src/interfaces/ui/ButtonProps";
import { ButtonStyles } from "@/src/styles/Buttons";

/** Atalho legado para o Button do Design System (variante secondary). */
export function ButtonOutline({ title, action, loading = false, disabled, accessibilityLabel }: ButtonProps) {
    return (
        <Button
            title={title}
            onPress={action}
            variant="secondary"
            loading={loading}
            disabled={disabled}
            accessibilityLabel={accessibilityLabel}
            style={ButtonStyles.buttonOutline}
        />
    )
}
