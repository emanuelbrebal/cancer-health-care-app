import CommonAreasLayout from "@/src/components/layouts/CommonAreasLayout/CommonAreasLayout";
import { Stack } from "expo-router";
import { StatusBar } from 'expo-status-bar';
import { ScreenTitle } from "@/src/components/ui/ScreenTitle";
import { Colors } from "@/src/constants/Colors";
import { ScreenConfig } from "@/src/types/ScreenConfig";
import { commonStackOptions } from "@/src/constants/CommonScreenOptions";

const screensConfig: ScreenConfig[] = [
    { name: "index", title: "Área Oncológica" },
    { name: "Nutrition/index", title: "Nutrição" },
    { name: "Sleep/index", title: "Cuidados com o Sono" },
    { name: "PhysicalExercises/index", title: "Exercícios Físicos" },
    { name: "LegalArea/index", title: "Benefícios Legais" },
    { name: "Leisure/index", title: "Recomendações de Lazer" },
    { name: "SpiritualArea/index", title: "Espiritualidade" },
    { name: "Leisure/Books/index", title: "Livros Recomendados" },
    { name: "Leisure/Books/[id]", title: "Detalhes do Livro" },
    { name: "Leisure/Movies/index", title: "Filmes Recomendados" },
    { name: "Leisure/Movies/[id]", title: "Detalhes do Filme" },
    { name: "Leisure/Series/index", title: "Séries Recomendadas" },
    { name: "Leisure/Series/[id]", title: "Detalhes da Série" },
    { name: "Leisure/Activities/index", title: "Atividades de Lazer" },
    { name: "Leisure/Activities/[id]", title: "Detalhes da Atividade" },
];

export default function OncologyStackLayout() {
    const color = Colors.purpleSecondary;
    return (
        <CommonAreasLayout>
            <Stack screenOptions={commonStackOptions}>
                {screensConfig.map((screen) => (
                    <Stack.Screen
                        key={screen.name}
                        name={screen.name}
                        options={{
                            headerRight: () => <ScreenTitle color={color} title={screen.title} />,
                        }}
                    />
                ))}
            </Stack>
            <StatusBar style="auto" />
        </CommonAreasLayout>
    );
}