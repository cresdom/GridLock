import AsyncStorage from '@react-native-async-storage/async-storage';

const STATS_KEY = 'gridlock_stats';

const defaultStatsTemplate = {
    totalGamesPlayed: 0,
    totalWins: 0,
    totalLosses: 0,
    totalDraws: 0,
    totalPoints: 0,

    ticTacToe: {
        gamesPlayed: 0,
        wins: 0,
        losses: 0,
        draws: 0,
        bestWinStreak: 0,
        currentWinStreak: 0,
    },

    memoryMatch: {
        gamesPlayed: 0,
        gamesCompleted: 0,
        bestTime: null,
        fewestMoves: null,
    },

    pong: {
        gamesPlayed: 0,
        wins: 0,
        losses: 0,
        highestScore: 0,
        bestTime: null,
    },

    frogger: {
        gamesPlayed: 0,
        wins: 0,
        bestTime: null,
        highestLevel: 1,
    },
};

function createDefaultStats() {
    return JSON.parse(JSON.stringify(defaultStatsTemplate));
}

export async function getStats() {
    try {
        const stored = await AsyncStorage.getItem(STATS_KEY);

        if (stored) {
        return JSON.parse(stored);
        }

        const freshStats = createDefaultStats();
        await AsyncStorage.setItem(STATS_KEY, JSON.stringify(freshStats));
        return freshStats;
    } catch (error) {
        console.log('Error loading stats:', error);
        return createDefaultStats();
    }
}

export async function saveStats(updatedStats) {
    try {
        await AsyncStorage.setItem(STATS_KEY, JSON.stringify(updatedStats));
    } catch (error) {
        console.log('Error saving stats:', error);
    }
}

export async function resetStats() {
    try {
        const freshStats = createDefaultStats();
        await AsyncStorage.setItem(STATS_KEY, JSON.stringify(freshStats));
        return freshStats;
    } catch (error) {
        console.log('Error resetting stats:', error);
        return createDefaultStats();
    }
}

export async function updateTicTacToeStats(result) {
    try {
        const stats = await getStats();

        stats.totalGamesPlayed += 1;
        stats.ticTacToe.gamesPlayed += 1;

        if (result === 'win') {
        stats.totalWins += 1;
        stats.totalPoints += 10;
        stats.ticTacToe.wins += 1;
        stats.ticTacToe.currentWinStreak += 1;

        if (stats.ticTacToe.currentWinStreak > stats.ticTacToe.bestWinStreak) {
            stats.ticTacToe.bestWinStreak = stats.ticTacToe.currentWinStreak;
        }
        } else if (result === 'loss') {
        stats.totalLosses += 1;
        stats.ticTacToe.losses += 1;
        stats.ticTacToe.currentWinStreak = 0;
        } else if (result === 'draw') {
        stats.totalDraws += 1;
        stats.ticTacToe.draws += 1;
        stats.ticTacToe.currentWinStreak = 0;
        }

        await saveStats(stats);
        return stats;
    } catch (error) {
        console.log('Error updating Tic Tac Toe stats:', error);
    }
}

export async function updateMemoryMatchStats({ completed, timeInSeconds, moves }) {
    try {
        const stats = await getStats();

        stats.totalGamesPlayed += 1;
        stats.memoryMatch.gamesPlayed += 1;

        if (completed) {
        stats.totalWins += 1;
        stats.totalPoints += 15;
        stats.memoryMatch.gamesCompleted += 1;

        if (stats.memoryMatch.bestTime === null || timeInSeconds < stats.memoryMatch.bestTime) {
            stats.memoryMatch.bestTime = timeInSeconds;
        }

        if (stats.memoryMatch.fewestMoves === null || moves < stats.memoryMatch.fewestMoves) {
            stats.memoryMatch.fewestMoves = moves;
        }
        }

        await saveStats(stats);
        return stats;
    } catch (error) {
        console.log('Error updating Memory Match stats:', error);
    }
}

export async function updatePongStats({ result, playerScore, timeInSeconds }) {
    try {
        const stats = await getStats();

        stats.totalGamesPlayed += 1;
        stats.pong.gamesPlayed += 1;

        if (result === 'win') {
        stats.totalWins += 1;
        stats.totalPoints += 12;
        stats.pong.wins += 1;
        } else if (result === 'loss') {
        stats.totalLosses += 1;
        stats.pong.losses += 1;
        }

        if (playerScore > stats.pong.highestScore) {
        stats.pong.highestScore = playerScore;
        }

        if (
        timeInSeconds !== null &&
        (stats.pong.bestTime === null || timeInSeconds < stats.pong.bestTime)
        ) {
        stats.pong.bestTime = timeInSeconds;
        }

        await saveStats(stats);
        return stats;
    } catch (error) {
        console.log('Error updating Pong stats:', error);
    }
}

export async function updateFroggerStats({ won, timeInSeconds, levelReached }) {
    try {
        const stats = await getStats();

        stats.totalGamesPlayed += 1;
        stats.frogger.gamesPlayed += 1;

        if (won) {
        stats.totalWins += 1;
        stats.totalPoints += 20;
        stats.frogger.wins += 1;
        }

        if (
        timeInSeconds !== null &&
        (stats.frogger.bestTime === null || timeInSeconds < stats.frogger.bestTime)
        ) {
        stats.frogger.bestTime = timeInSeconds;
        }

        if (levelReached > stats.frogger.highestLevel) {
        stats.frogger.highestLevel = levelReached;
        }

        await saveStats(stats);
        return stats;
    } catch (error) {
        console.log('Error updating Frogger stats:', error);
    }
}