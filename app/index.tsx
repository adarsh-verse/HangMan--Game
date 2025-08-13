import "./global.css";
import Homepage from "@/app/homepage";
import {createNativeStackNavigator} from "expo-router/build/fork/native-stack/createNativeStackNavigator";
import StartPage from "@/app/startPage";
import * as Font from 'expo-font';
import {useState, useEffect} from "react";
import {ActivityIndicator, View} from "react-native";

export default function Index() {
    const Stack = createNativeStackNavigator();

    const [fontsLoaded, setFontsLoaded] = useState(false);

    useEffect(() => {
        async function loadFonts() {
            try {
                await Font.loadAsync({
                    'SRegular': require('../assets/fonts/SpaceMono-Regular.ttf'),
                });
                setFontsLoaded(true);
            } catch (error) {
                console.error('Error loading fonts:', error);
            }
        }

        loadFonts();
    }, []);

    if (!fontsLoaded) {
        return (
            <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
                <ActivityIndicator size="large" color="#5D3FD3" />
            </View>
        );
    }

    return (
        <Stack.Navigator initialRouteName="StartPage" screenOptions={{headerShown: false}}>
            <Stack.Screen name="StartPage" component={StartPage} />
            <Stack.Screen name="Homepage" component={Homepage} />
        </Stack.Navigator>
    );
};
