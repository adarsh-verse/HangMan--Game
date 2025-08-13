import React, { useEffect, useState } from 'react';
import { Text } from 'react-native';

export default function Timer() {
    const [seconds, setSeconds] = useState(15);
    const [isRunning, setIsRunning] = useState(false);

    useEffect(() => {
        let interval;

        if (isRunning && seconds > 0) {
            interval = setInterval(() => {
                setSeconds((prev) => prev - 1);
            }, 1000);
        }

        if (seconds === 0) {
            clearInterval(interval);
            setIsRunning(false);
        }

        return () => clearInterval(interval);
    }, [isRunning, seconds]);

    const startTimer = () => {
        if (seconds > 0) setIsRunning(true);
    };

    const resetTimer = () => {
        setIsRunning(false);
        setSeconds(15);
    };

    return (
        seconds > 10 ? (<Text className="text-gray-600 text-xl font-bold" onPress={startTimer} onLongPress={resetTimer}>{seconds}s</Text>) : (<Text className="text-red-600 text-xl font-bold" onPress={startTimer} onLongPress={resetTimer}>{seconds}s</Text>)

    );
}
