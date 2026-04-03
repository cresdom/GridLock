import { router } from 'expo-router';
import React, { useEffect, useState } from 'react';
import { StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import AchievementPopup from '../components/AchievementPopup';
import { theme } from '../theme/theme';
import { unlockAchievement } from '../utils/achievements';
import { markGameAsPlayed } from '../utils/recentlyPlayed';
import { updateTicTacToeStats } from '../utils/stats';

const winningPatterns = [
    [0, 1, 2], [3, 4, 5], [6, 7, 8],
    [0, 3, 6], [1, 4, 7], [2, 5, 8],
    [0, 4, 8], [2, 4, 6],
];

export default function TicTacToeScreen() {
    const [board, setBoard] = useState(Array(9).fill(null));
    const [winner, setWinner] = useState(null);
    const [isPlayerTurn, setIsPlayerTurn] = useState(true);
    const [moveCount, setMoveCount] = useState(0);

    const [showPopup, setShowPopup] = useState(false);
    const [unlockedAchievement, setUnlockedAchievement] = useState(null);

    useEffect(() => {
        const setupGame = async () => {
        const playResult = await markGameAsPlayed({
            title: 'Tic Tac Toe',
            route: '/tictactoe',
        });

        const firstGameResult = await unlockAchievement('first_game');

        if (firstGameResult.newlyUnlocked && firstGameResult.achievement) {
            setUnlockedAchievement(firstGameResult.achievement);
            setShowPopup(true);
            return;
        }

        const starterResult = await unlockAchievement('tictactoe_starter');

        if (starterResult.newlyUnlocked && starterResult.achievement) {
            setUnlockedAchievement(starterResult.achievement);
            setShowPopup(true);
            return;
        }

        if (playResult?.unlockedAchievements?.length > 0) {
            setUnlockedAchievement(playResult.unlockedAchievements[0]);
            setShowPopup(true);
        }
        };

        setupGame();
    }, []);

    const showAchievementPopup = (achievement) => {
        if (!achievement) return;
        setUnlockedAchievement(achievement);
        setShowPopup(true);
    };

    const checkWinner = (newBoard) => {
        for (let pattern of winningPatterns) {
        const [a, b, c] = pattern;
        if (newBoard[a] && newBoard[a] === newBoard[b] && newBoard[a] === newBoard[c]) {
            return newBoard[a];
        }
    }

    return newBoard.every((cell) => cell !== null) ? 'Draw' : null;
    };

    const getRandomBotMove = (currentBoard) => {
        const emptyIndexes = currentBoard
        .map((cell, index) => (cell === null ? index : null))
        .filter((index) => index !== null);

        if (emptyIndexes.length === 0) return null;

        const randomIndex = Math.floor(Math.random() * emptyIndexes.length);
        return emptyIndexes[randomIndex];
    };

    const handlePlayerMove = async (index) => {
        if (!isPlayerTurn || board[index] || winner) return;

        const newBoard = [...board];
        newBoard[index] = 'X';
        const newMoveCount = moveCount + 1;

        setBoard(newBoard);
        setMoveCount(newMoveCount);

        const result = checkWinner(newBoard);

        if (result) {
        setWinner(result);

        if (result === 'X') {
            await updateTicTacToeStats('win');

            const winnerAchievement = await unlockAchievement('tictactoe_winner');
            if (winnerAchievement.newlyUnlocked) {
            showAchievementPopup(winnerAchievement.achievement);
            return;
            }

            if (newMoveCount <= 5) {
            const quickWinAchievement = await unlockAchievement('tictactoe_quick_win');
            if (quickWinAchievement.newlyUnlocked) {
                showAchievementPopup(quickWinAchievement.achievement);
                return;
            }
            }
        } else if (result === 'Draw') {
            await updateTicTacToeStats('draw');

            const drawAchievement = await unlockAchievement('tictactoe_draw');
            if (drawAchievement.newlyUnlocked) {
            showAchievementPopup(drawAchievement.achievement);
            return;
            }
        }

        return;
        }

        setIsPlayerTurn(false);

        setTimeout(async () => {
        const botMove = getRandomBotMove(newBoard);

        if (botMove === null) {
            setIsPlayerTurn(true);
            return;
        }

        const botBoard = [...newBoard];
        botBoard[botMove] = 'O';
        setBoard(botBoard);

        const botResult = checkWinner(botBoard);

        if (botResult) {
            setWinner(botResult);

            if (botResult === 'O') {
            await updateTicTacToeStats('loss');
            } else if (botResult === 'Draw') {
            await updateTicTacToeStats('draw');

            const drawAchievement = await unlockAchievement('tictactoe_draw');
            if (drawAchievement.newlyUnlocked) {
                showAchievementPopup(drawAchievement.achievement);
                return;
            }
            }
        } else {
            setIsPlayerTurn(true);
        }
        }, 500);
    };

    const resetGame = async () => {
        setBoard(Array(9).fill(null));
        setWinner(null);
        setIsPlayerTurn(true);
        setMoveCount(0);

        const comebackAchievement = await unlockAchievement('tictactoe_comeback');
        if (comebackAchievement.newlyUnlocked) {
        showAchievementPopup(comebackAchievement.achievement);
        }
    };

    const getStatusText = () => {
        if (winner === 'X') return 'You win!';
        if (winner === 'O') return 'Bot wins!';
        if (winner === 'Draw') return 'It is a draw!';
        return isPlayerTurn ? 'Your Turn (X)' : 'Bot is thinking...';
    };

    return (
        <View style={styles.container}>
        <Text style={styles.title}>Tic Tac Toe</Text>
        <Text style={styles.status}>{getStatusText()}</Text>

        <View style={styles.grid}>
            {board.map((cell, index) => (
            <TouchableOpacity
                key={index}
                style={styles.cell}
                onPress={() => handlePlayerMove(index)}
            >
                <Text style={styles.cellText}>{cell}</Text>
            </TouchableOpacity>
            ))}
        </View>

        <TouchableOpacity style={styles.button} onPress={resetGame}>
            <Text style={styles.buttonText}>Restart Game</Text>
        </TouchableOpacity>

        <TouchableOpacity style={styles.buttonSecondary} onPress={() => router.back()}>
            <Text style={styles.buttonText}>Back</Text>
        </TouchableOpacity>

        <AchievementPopup
            visible={showPopup}
            achievement={unlockedAchievement}
            onViewAchievements={() => {
            setShowPopup(false);
            router.push('/achievements');
            }}
            onClose={() => {
            setShowPopup(false);
            }}
        />
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: theme.colors.background,
        alignItems: 'center',
        justifyContent: 'center',
        padding: 24,
    },
    title: {
        fontSize: 30,
        fontWeight: 'bold',
        color: theme.colors.text,
        marginBottom: 10,
    },
    status: {
        color: theme.colors.text,
        fontSize: 18,
        marginBottom: 20,
    },
    grid: {
        width: 300,
        flexDirection: 'row',
        flexWrap: 'wrap',
    },
    cell: {
        width: 100,
        height: 100,
        borderWidth: 2,
        borderColor: theme.colors.accent,
        alignItems: 'center',
        justifyContent: 'center',
        backgroundColor: theme.colors.card,
    },
    cellText: {
        fontSize: 34,
        fontWeight: 'bold',
        color: theme.colors.darkText,
    },
    button: {
        marginTop: 20,
        backgroundColor: theme.colors.accent,
        padding: 14,
        borderRadius: 16,
        width: 220,
    },
    buttonSecondary: {
        marginTop: 12,
        backgroundColor: theme.colors.button,
        padding: 14,
        borderRadius: 16,
        width: 220,
    },
    buttonText: {
        textAlign: 'center',
        fontWeight: '700',
        color: theme.colors.darkText,
    },
});