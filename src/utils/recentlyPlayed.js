import AsyncStorage from '@react-native-async-storage/async-storage';
import { unlockAchievement } from './achievements';

const LAST_PLAYED_KEY = 'gridlock_last_played_game';
const TOTAL_GAMES_PLAYED_KEY = 'gridlock_total_games_played';
const SESSION_GAMES_PLAYED_KEY = 'gridlock_session_games_played';

export async function getLastPlayedGame() {
    try {
        const stored = await AsyncStorage.getItem(LAST_PLAYED_KEY);
        return stored ? JSON.parse(stored) : null;
    } catch (error) {
        console.log('Error loading last played game:', error);
        return null;
    }
}

export async function getTotalGamesPlayed() {
    try {
        const stored = await AsyncStorage.getItem(TOTAL_GAMES_PLAYED_KEY);
        return stored ? JSON.parse(stored) : 0;
    } catch (error) {
        console.log('Error loading total games played:', error);
        return 0;
    }
}

export async function getSessionGamesPlayed() {
    try {
        const stored = await AsyncStorage.getItem(SESSION_GAMES_PLAYED_KEY);
        return stored ? JSON.parse(stored) : 0;
    } catch (error) {
        console.log('Error loading session games played:', error);
        return 0;
    }
}

export async function markGameAsPlayed(game) {
    try {
        const current = await getLastPlayedGame();
        const totalGamesPlayed = await getTotalGamesPlayed();
        const sessionGamesPlayed = await getSessionGamesPlayed();

        let updatedGame = {
        ...game,
        lastPlayed: new Date().toISOString(),
        timesPlayed: 1,
        };

        if (current && current.title === game.title) {
        updatedGame.timesPlayed = current.timesPlayed + 1;
        }

        await AsyncStorage.setItem(LAST_PLAYED_KEY, JSON.stringify(updatedGame));

        const newTotalGamesPlayed = totalGamesPlayed + 1;
        const newSessionGamesPlayed = sessionGamesPlayed + 1;

        await AsyncStorage.setItem(
        TOTAL_GAMES_PLAYED_KEY,
        JSON.stringify(newTotalGamesPlayed)
        );

        await AsyncStorage.setItem(
        SESSION_GAMES_PLAYED_KEY,
        JSON.stringify(newSessionGamesPlayed)
        );

        const unlockedAchievements = [];

        if (newTotalGamesPlayed >= 10) {
        const result = await unlockAchievement('game_addict');
        if (result.newlyUnlocked && result.achievement) {
            unlockedAchievements.push(result.achievement);
        }
        }

        if (newSessionGamesPlayed >= 3) {
        const result = await unlockAchievement('triple_player');
        if (result.newlyUnlocked && result.achievement) {
            unlockedAchievements.push(result.achievement);
        }
        }

        return {
        updatedGame,
        unlockedAchievements,
        };
    } catch (error) {
        console.log('Error marking game as played:', error);
        return {
        updatedGame: null,
        unlockedAchievements: [],
        };
    }
}

export async function resetLastPlayedGame() {
    try {
        await AsyncStorage.removeItem(LAST_PLAYED_KEY);
    } catch (error) {
        console.log('Error resetting last played game:', error);
    }
}

export async function resetSessionGamesPlayed() {
    try {
        await AsyncStorage.removeItem(SESSION_GAMES_PLAYED_KEY);
    } catch (error) {
        console.log('Error resetting session games played:', error);
    }
}