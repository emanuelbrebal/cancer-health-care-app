import { View } from 'react-native';
import { commonAreaLayoutStyles } from './CommonAreasLayoutStyle';
import { globalStyles } from '@/src/styles/global';

interface CommonAreasProps {
    children?: React.ReactNode
}

export default function CommonAreasLayout({ children }: CommonAreasProps) {

    return (
        <View style={globalStyles.authLayoutContainer}>
            <View style={commonAreaLayoutStyles.oncologyArea}>
                <View style={globalStyles.dynamicContent}>
                    {children}
                </View>
            </View>
        </View>
    );
}