import PublicationComponent from '@/src/components/socialArea/PublicationComponent/PublicationComponent';
import { NewPublicationButton } from '@/src/components/ui/Buttons/Overlay/NewPublication/NewPublication';
import { SearchBar } from '@/src/components/ui/Inputs/SearchBar';
import { globalStyles } from '@/src/styles/global';
import { ScrollView, Text, View } from 'react-native';

export default function HomeCommunities() {
    return (
        <View style={{ flex: 1 }}>
            <ScrollView contentContainerStyle={globalStyles.scrollContainer} showsVerticalScrollIndicator={true}>
                <SearchBar />
                <Text>Navegar pelas comunidades</Text>
                {/* colocar a lista horizontal (de avatares) */}
                {/* listar comunidades como se fossem publicações */}
            </ScrollView>

            <NewPublicationButton />
        </View>
    );
}

