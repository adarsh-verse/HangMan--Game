import React from 'react'
import {Text, TouchableOpacity, View} from "react-native";
import {SafeAreaView} from "react-native-safe-area-context";
import {router} from "expo-router";

const StartPage = () => {
    return (
        <SafeAreaView className="items-center justify-center" style={{flex: 1}}>
            <View>
                <TouchableOpacity onPress={() => router.push("/homepage")}>
                    <Text className="text-blue-600 text-3xl font-bold" style={{fontFamily:"SRegular"}}>Go to Homepage</Text>
                </TouchableOpacity>
            </View>
        </SafeAreaView>
    )
}
export default StartPage
