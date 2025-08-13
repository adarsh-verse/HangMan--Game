import React, {useEffect, useState} from 'react'
import {easyWords, hardWords, mediumWords} from "@/utils/wordList";
import {Alert, StatusBar, StyleSheet, Text, TouchableOpacity, View} from "react-native";
import {SafeAreaView} from "react-native-safe-area-context";
import {Picker} from "@react-native-picker/picker";
import Timer from "@/utils/timer";
import {Image} from "expo-image";

const Homepage = () => {
    let maxGuesses = 6;

    const [score, setScore] = useState(0);
    const [difficulty, setDifficulty] = useState('easy') ;
    const [startTimer, setStartTimer] = useState(false);
    const [incorrectGuesses, setIncorrectGuesses] = useState(0);
    const [pressedKeys, setPressedKeys] = useState<string[]>([]);

    const getRandomRiddle = () => {
        let riddle = { word: '', hint: ''};
        try{
            if(difficulty === 'hard') {
                riddle = hardWords[Math.floor(Math.random() * hardWords.length)];
                hardWords.splice(hardWords.indexOf(riddle), 1);
            }
            else if(difficulty === 'medium') {
                riddle =  mediumWords[Math.floor(Math.random() * mediumWords.length)];
                mediumWords.splice(mediumWords.indexOf(riddle), 1);
            }
            else {
                riddle = easyWords[Math.floor(Math.random() * easyWords.length)];
                easyWords.splice(easyWords.indexOf(riddle), 1);
            }
        }
        catch (e: any) {
            Alert.alert('Error loading questions', e.toString() );
        }
        return riddle;
    };

    const [currentRiddle, setCurrentRiddle] = useState(getRandomRiddle());
    const [userAnswer, setUserAnswer] = useState<string[]>([]);

    const resetGame = () => {
        setCurrentRiddle(getRandomRiddle());
        setUserAnswer(Array(currentRiddle.word.length).fill(''));
        setPressedKeys([]);
        maxGuesses = 6;
    }

    useEffect(() => {
        setCurrentRiddle(getRandomRiddle());
        setUserAnswer(Array(currentRiddle.word.length).fill(''));
        setPressedKeys([]);
        maxGuesses = 6;
    }, [difficulty]);

    useEffect(() => {
        if(incorrectGuesses === maxGuesses) {
            Alert.alert('Game Over', 'Try Again?');
            resetGame();
        }
    }, [incorrectGuesses]);

    const handleKeyPress = (letter: string) => {
        const currentLetter = letter.toLowerCase();
        const answerSize = currentRiddle.word.length;
        const updatedAnswer = [...userAnswer];
        if(currentRiddle.word.includes(currentLetter) && !userAnswer.includes(currentLetter)) {
            for(let i = 0; i < answerSize; i++) {
                if(currentRiddle.word[i] === currentLetter) {
                    updatedAnswer[i] = currentLetter.toUpperCase();
                }
            }
        }
        else {
            setIncorrectGuesses(incorrectGuesses + 1);
        }
        setUserAnswer(updatedAnswer);
        checkAnswer(userAnswer.join(''));
    };

    const checkAnswer = (userAnswer : string) => {
        if(userAnswer.toLowerCase() === currentRiddle.word) {
            if(difficulty === 'easy') {
                setScore(score + 10);
            }
            else if(difficulty === 'medium') {
                setScore(score + 15);
            }
            else {
                setScore(score + 30);
            }
            setCurrentRiddle(getRandomRiddle());
            setUserAnswer(Array(currentRiddle.word.length).fill(''));
            setPressedKeys([]);
            maxGuesses = 6;
        }
    };

    useEffect(() => {
        checkAnswer(userAnswer.join(''));
    }, [userAnswer]);

    const skip = () => {
        setCurrentRiddle(getRandomRiddle());
        setUserAnswer(Array(currentRiddle.word.length).fill(''));
        setPressedKeys([]);
        setIncorrectGuesses(6);
        setScore(score - 10);
    };

    const hangmanImages = [
        require('../assets/images/hangman-0.png'),
        require('../assets/images/hangman-1.png'),
        require('../assets/images/hangman-2.png'),
        require('../assets/images/hangman-3.png'),
        require('../assets/images/hangman-4.png'),
        require('../assets/images/hangman-5.png'),
        require('../assets/images/hangman-6.png'),
    ];

    const ALPHABET = 'QWERTYUIOPASDFGHJKLZXCVBNM'.split('');

    const Keyboard = ({ onKeyPress } : { onKeyPress: (letter: string) => void }) => {

        const handleKeyPress = (letter: string) => {
            if(pressedKeys.includes(letter)) return;

            setPressedKeys([...pressedKeys, letter]);
            onKeyPress(letter);
        };

        return (
            <View style={styles.keyboardContainer}>
                {ALPHABET.map((letter) => (
                    <TouchableOpacity
                        key={letter}
                        style={[
                            styles.key,
                            pressedKeys.includes(letter) && styles.keyDisabled,
                        ]}
                        onPress={() => handleKeyPress(letter)}
                    >
                        <Text style={styles.keyText}>{letter}</Text>
                    </TouchableOpacity>
                ))}
            </View>
        );
    };

    const styles = StyleSheet.create({
        keyboardContainer: {
            flexDirection: 'row',
            flexWrap: 'wrap',
            justifyContent: 'center',
            marginVertical: 20,
        },
        key: {
            backgroundColor: '#4CAF50',
            padding: 10,
            margin: 5,
            borderRadius: 4,
            width: 40,
            alignItems: 'center',
        },
        keyDisabled: {
            backgroundColor: '#9E9E9E',
        },
        keyText: {
            color: '#fff',
            fontWeight: 'bold',
        },
    });

    return (
        <SafeAreaView>
            <StatusBar backgroundColor="#ffffff" barStyle="dark-content" />
            <View className="items-center justify-center bg-white py-1">
                <Text className="text-4xl font-bold text-blue-500">
                    HangMan Game
                </Text>
            </View>
            <View className="flex-row justify-between ml-1 mr-1 px-1 py-2 bg-white">
                <Text className="text-xl font-bold text-gray-600">
                    Score: {score}
                </Text>

                <TouchableOpacity className="bg-gray-300 rounded-l-md">
                    <Text className="text-gray-600 text-xl font-bold px-0.5" onPress={skip}>
                        SKIP WORD
                    </Text>
                </TouchableOpacity>
            </View>
            <View className="bg-white justify-between px-1 ml-1 mr-1" style={{flexDirection:"row", alignItems:"center"}}>
                <Text className="text-xl font-bold text-gray-600">
                    Difficulty:
                </Text>
                <Picker
                    selectedValue={difficulty}
                    onValueChange={(itemValue) => setDifficulty(itemValue)}
                    style={{ width: 130 }}
                    itemStyle={{ fontSize: 18, fontWeight: 'bold', color: '#4B5563' }}
                >
                    <Picker.Item label="Easy" value="easy" />
                    <Picker.Item label="Medium" value="medium" />
                    <Picker.Item label="Hard" value="hard" />
                </Picker>
                <Text className="text-xl font-bold text-gray-600">
                    Time Left:
                </Text>
                <Timer/>
            </View>

            <View className="items-center mt-4 justify-center">
                <Image source={hangmanImages[incorrectGuesses]} style={{ width: 200, height: 200 }} />
            </View>

            <View className="items-center justify-center mt-2">
                <Text className="text-xl font-bold text-center px-2">
                    {currentRiddle.hint}
                </Text>
            </View>

            <View className="flex flex-row flex-wrap justify-center mt-4">
                {Array.from({length: currentRiddle.word.length}).map((_, index: number) => (
                    <Text key={index} className="font-bold text-2xl text-blue-400 mx-2">
                        {userAnswer[index] || '__'}
                    </Text>
                ))}
                {/*{userAnswer.map((letter: string, index: number) => (*/}
                {/*    <Text key={index} className="font-bold text-2xl text-amber-400 mx-1">{letter}</Text>*/}
                {/*))}*/}
            </View>

            <View className="items-center mt-5 justify-center">
                <Keyboard onKeyPress={handleKeyPress} />
            </View>
        </SafeAreaView>
    );
}
export default Homepage
