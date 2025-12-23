import { Stack } from "expo-router";

// criar o botão do pânico como layout para todas as páginas dessa área
export default function Layout() {
    return (
        <Stack screenOptions={{headerShown: false}} />
    )
}