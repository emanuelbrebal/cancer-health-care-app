import PublicationComponent from '@/src/components/socialArea/PublicationComponent/PublicationComponent';
import { NewPublicationButton } from '@/src/components/ui/Buttons/Overlay/NewPublication/NewPublication';
import { SearchBar } from '@/src/components/ui/Inputs/SearchBar';
import { globalStyles } from '@/src/styles/global';
import { ScrollView, View } from 'react-native';
import { useHeaderHeight } from '@react-navigation/elements';

export default function CommunityTopics() {
    return (
        <View style={globalStyles.startContainer}>
            <SearchBar />

            <ScrollView
                style={{ flex: 1 }}
                contentContainerStyle={globalStyles.scrollContainer}
                showsVerticalScrollIndicator={true}
            >

                <PublicationComponent />
                <PublicationComponent />
                <PublicationComponent />
            </ScrollView>

            <NewPublicationButton />
        </View>
    );
}