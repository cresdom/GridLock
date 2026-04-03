import AsyncStorage from '@react-native-async-storage/async-storage';

const ACHIEVEMENTS_KEY = 'gridlock_achievements';

export const ACHIEVEMENT_LIST = [
    {
        id: 'first_game',
        title: 'First Game',
        description: 'Played your first game.',
        icon: 'game-controller-outline',
    },
    {
        id: 'memory_master',
        title: 'Memory Master',
        description: 'Won a Memory Match game.',
        icon: 'heart-outline',
    },
    {
        id: 'tictactoe_winner',
        title: 'Tic Tac Toe Winner',
        description: 'Won a Tic Tac Toe match.',
        icon: 'close-circle-outline',
    },
    {
        id: 'pong_player',
        title: 'Pong Player',
        description: 'Played Pong for the first time.',
        icon: 'tennisball-outline',
    },
    {
        id: 'frogger_pro',
        title: 'Frogger Pro',
        description: 'Won a Frogger game.',
        icon: 'paw-outline',
    },
    {
        id: 'memory_starter',
        title: 'Match Maker',
        description: 'Finished your first Memory Match game.',
        icon: 'color-wand-outline',
    },
    {
        id: 'memory_perfect',
        title: 'Perfect Memory',
        description: 'Completed Memory Match without mistakes.',
        icon: 'bulb-outline',
    },
    {
        id: 'pong_survivor',
        title: 'Pong Survivor',
        description: 'Stayed alive for 30 seconds in Pong.',
        icon: 'timer-outline',
    },
    {
        id: 'pong_first_score',
        title: 'On the Board',
        description: 'Scored your first point in Pong.',
        icon: 'flash-outline',
    },
    {
        id: 'frogger_escape',
        title: 'Road Crosser',
        description: 'Successfully crossed the road in Frogger.',
        icon: 'leaf-outline',
    },
    {
        id: 'game_addict',
        title: 'Game Addict',
        description: 'Played 10 games total.',
        icon: 'flame-outline',
    },
    {
        id: 'triple_player',
        title: 'Three in a Row',
        description: 'Played 3 games in one session.',
        icon: 'game-controller-outline',
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
        achievement: achievement || null,
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