import { HorizontalBanner } from '@/src/components/ui/Images/HorizontalBanner';
import { MediaList } from '@/src/components/ui/Media/MediaList';
import { Colors } from '@/src/constants/Colors';
import { sleepMusicMock } from '@/src/constants/Mocks/mockDataOncologyMedias';
import { globalStyles } from '@/src/styles/global';
import { ScrollView, StyleSheet, Text, TouchableOpacity, View } from 'react-native';

export default function Sleep() {
    return (
        <ScrollView contentContainerStyle={globalStyles.scrollContainer}
            showsVerticalScrollIndicator={true}>
            <View style={styles.container}>
                <HorizontalBanner imagePath={require('@assets/images/Banners/sleepBanner.png')} />
                <View style={globalStyles.startContainer}>
                    <Text style={globalStyles.title}>Cuidados com o sono: </Text>
                    <Text style={styles.text}>Lorem, ipsum dolor sit amet consectetur adipisicing elit. Blanditiis ipsam nemo velit totam nostrum iure quod nihil rem vitae in ratione perferendis, hic doloremque praesentium magnam reprehenderit amet veniam ex! </Text>
                    <TouchableOpacity>
                        <Text style={[styles.text, styles.hyperlink]}>Ver mais</Text>
                    </TouchableOpacity>

                    <MediaList items={sleepMusicMock} key={'id'}/>
                </View>

            </View>
        </ScrollView >
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        gap: 20,
        backgroundColor: 'transparent',
    },
    text: {
        ...globalStyles.title,
        fontSize: 12
    },
    hyperlink: {
        ...globalStyles.textHyperlink,
        color: Colors.purplePrimary,
        textAlign: 'left'
    }
});