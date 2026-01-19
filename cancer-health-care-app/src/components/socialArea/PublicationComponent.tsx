import { globalStyles } from '@/src/styles/global';
import { View } from 'react-native';
import Content from './components/Content';
import { UserDetailsComponent } from './components/UserDetails';
import { InteractionsComponent } from './components/InteractionsComponent';

interface PublicationProps {
    likes?: number
    commentsCount?: number
}
export default function PublicationComponent({ likes, commentsCount }: PublicationProps) {

    return (
        <View style={globalStyles.dynamicContent}>
            <UserDetailsComponent />
            <Content publication={{}} />
            <InteractionsComponent likes={likes || 0} comments={commentsCount || null} />
        </View >
    );
}