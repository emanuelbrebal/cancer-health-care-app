import { NativeStackNavigationOptions } from '@react-navigation/native-stack';

export const commonStackOptions: NativeStackNavigationOptions = {
    headerShown: true,
    headerTintColor: 'white',
    headerTransparent: true,
    headerTitle: "",
    contentStyle: {
        backgroundColor: 'transparent',
        justifyContent: 'flex-end',
    },
};