import AsyncStorage from '@react-native-async-storage/async-storage';

const ACHIEVEMENTS_KEY = 'gridlock_achievements';

export const ACHIEVEMENT_LIST = [
    {
        id: 'first_game',
        title: 'First Game',
        description: 'Played your first game.',
        icon: 'game-controller',
    },
    {
        id: 'memory_master',
        title: 'Memory Master',
        description: 'Won a Memory Match game.',
        icon: 'heart',
    },
    {
        id: 'tictactoe_winner',
        title: 'TicTacToe Winner',
        description: 'Won a Tic Tac Toe match.',
        icon: 'close-circle',
    },
    {
        id: 'pong_player',
        title: 'Pong Player',
        description: 'Played Pong for the first time.',
        icon: 'tennisball',
    },
    {
        id: 'frogger_pro',
        title: 'Frogger Pro',
        description: 'Won a Frogger game.',
        icon: 'paw',
    },
    {
        id: 'top_three',
        title: 'Top 3 Player',
        description: 'Reached the top 3 on the leaderboard.',
        icon: 'trophy',
    },
];

export async function getUnlockedAchievements() {
    try {
        const stored = await AsyncStorage.getItem(ACHIEVEMENTS_KEY);
        return stored ? JSON.parse(stored) : [];
    } catch (error) {
        console.log('Error loading achievements:', error);
        return [];
    }
    }

    export async function saveUnlockedAchievements(unlockedIds) {
    try {
        await AsyncStorage.setItem(ACHIEVEMENTS_KEY, JSON.stringify(unlockedIds));
    } catch (error) {
        console.log('Error saving achievements:', error);
    }
    }

    export async function unlockAchievement(id) {
    try {
        const unlockedIds = await getUnlockedAchievements();

        if (unlockedIds.includes(id)) {
        const existingAchievement = ACHIEVEMENT_LIST.find((a) => a.id === id);
        return {
            newlyUnlocked: false,
            achievement: existingAchievement || null,
        };
        }

        const updated = [...unlockedIds, id];
        await saveUnlockedAchievements(updated);

        const achievement = ACHIEVEMENT_LIST.find((a) => a.id === id);

        return {
        newlyUnlocked: true,
        achievement,
        };
    } catch (error) {
        console.log('Error unlocking achievement:', error);
        return {
        newlyUnlocked: false,
        achievement: null,
        };
    }
}

export async function resetAllAchievements() {
    try {
        await AsyncStorage.removeItem(ACHIEVEMENTS_KEY);
    } catch (error) {
        console.log('Error resetting achievements:', error);
    }
}
