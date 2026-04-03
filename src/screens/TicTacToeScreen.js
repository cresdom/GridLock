import { router } from 'expo-router';
import React, { useEffect, useState } from 'react';
import { StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import AchievementPopup from '../components/AchievementPopup';
import { theme } from '../theme/theme';
import { unlockAchievement } from '../utils/achievements';
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

    const [showPopup, setShowPopup] = useState(false);
    const [unlockedAchievement, setUnlockedAchievement] = useState(null);

    useEffect(() => {
        const unlockFirstGame = async () => {
        const result = await unlockAchievement('first_game');

        if (result.newlyUnlocked) {
            setUnlockedAchievement(result.achievement);
            setShowPopup(true);
        }
        };

        unlockFirstGame();
    }, []);

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
        setBoard(newBoard);

        const result = checkWinner(newBoard);

        if (result) {
        setWinner(result);

        if (result === 'X') {
            await updateTicTacToeStats('win');

            const achievementResult = await unlockAchievement('tictactoe_winner');
            if (achievementResult.newlyUnlocked) {
            setUnlockedAchievement(achievementResult.achievement);
            setShowPopup(true);
            }
        } else if (result === 'Draw') {
            await updateTicTacToeStats('draw');
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
            }
        } else {
            setIsPlayerTurn(true);
        }
        }, 500);
    };

    const resetGame = () => {
        setBoard(Array(9).fill(null));
        setWinner(null);
        setIsPlayerTurn(true);
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