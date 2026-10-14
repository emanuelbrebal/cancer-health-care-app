import { NativeStackNavigationOptions } from 'expo-router';

export const commonStackOptions: NativeStackNavigationOptions = {
    headerShown: true,
    headerTintColor: 'white',
    headerTransparent: true,
    headerTitle: "",
    headerShadowVisible: false, 
    contentStyle: {
        backgroundColor: 'transparent',
        justifyContent: 'flex-end',
    },
};