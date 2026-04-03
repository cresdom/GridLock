import AsyncStorage from '@react-native-async-storage/async-storage';

const LAST_PLAYED_KEY = 'gridlock_last_played_game';

export async function getLastPlayedGame() {
    try {
        const stored = await AsyncStorage.getItem(LAST_PLAYED_KEY);
        return stored ? JSON.parse(stored) : null;
    } catch (error) {
        console.log('Error loading last played game:', error);
        return null;
    }
}

export async function markGameAsPlayed(game) {
    try {
        const current = await getLastPlayedGame();

        let updatedGame = {
        ...game,
        lastPlayed: new Date().toISOString(),
        timesPlayed: 1,
        };

        if (current && current.title === game.title) {
        updatedGame.timesPlayed = current.timesPlayed + 1;
        }

        await AsyncStorage.setItem(LAST_PLAYED_KEY, JSON.stringify(updatedGame));
        return updatedGame;
    } catch (error) {
        console.log('Error marking game as played:', error);
        return null;
    }
}

export async function resetLastPlayedGame() {
    try {
        await AsyncStorage.removeItem(LAST_PLAYED_KEY);
    } catch (error) {
        console.log('Error resetting last played game:', error);
    }
}