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
        if (winner === 'Draw') return 'Draw game';
        return isPlayerTurn ? 'Your turn' : 'Bot is thinking...';
    };

    const getStatusStyle = () => {
        if (winner === 'X') return styles.statusWin;
        if (winner === 'O') return styles.statusLoss;
        if (winner === 'Draw') return styles.statusDraw;
        return isPlayerTurn ? styles.statusTurn : styles.statusWaiting;
    };

    return (
        <View style={styles.container}>
        <View style={styles.card}>
            <Text style={styles.title}>Tic Tac Toe</Text>
            <Text style={styles.subtitle}>You are X · Bot is O</Text>

            <View style={[styles.statusBadge, getStatusStyle()]}>
            <Text style={styles.statusText}>{getStatusText()}</Text>
            </View>

            <View style={styles.grid}>
            {board.map((cell, index) => (
                <TouchableOpacity
                key={index}
                style={styles.cell}
                activeOpacity={0.8}
                onPress={() => handlePlayerMove(index)}
                >
                <Text
                    style={[
                    styles.cellText,
                    cell === 'X' && styles.xText,
                    cell === 'O' && styles.oText,
                    ]}
                >
                    {cell}
                </Text>
                </TouchableOpacity>
            ))}
            </View>

            <TouchableOpacity style={styles.buttonPrimary} onPress={resetGame}>
            <Text style={styles.buttonPrimaryText}>Restart Game</Text>
            </TouchableOpacity>

            <TouchableOpacity style={styles.buttonSecondary} onPress={() => router.back()}>
            <Text style={styles.buttonSecondaryText}>Back</Text>
            </TouchableOpacity>
        </View>

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
        justifyContent: 'center',
        alignItems: 'center',
        padding: 20,
    },
    card: {
        width: '100%',
        maxWidth: 380,
        backgroundColor: theme.colors.card,
        borderRadius: 28,
        paddingVertical: 28,
        paddingHorizontal: 20,
        alignItems: 'center',
        shadowColor: '#000',
        shadowOpacity: 0.12,
        shadowRadius: 14,
        shadowOffset: { width: 0, height: 6 },
        elevation: 6,
    },
    title: {
        fontSize: 32,
        fontWeight: '800',
        color: '#702999',
        marginBottom: 6,
    },
    subtitle: {
        fontSize: 15,
        color: '#c662ff',
        opacity: 0.7,
        marginBottom: 18,
    },
    statusBadge: {
        minWidth: 180,
        paddingVertical: 10,
        paddingHorizontal: 16,
        borderRadius: 999,
        alignItems: 'center',
        marginBottom: 24,
    },
    statusText: {
        fontSize: 15,
        fontWeight: '700',
        color: theme.colors.darkText,
    },
    statusTurn: {
        backgroundColor: theme.colors.accent,
    },
    statusWaiting: {
        backgroundColor: theme.colors.button,
    },
    statusWin: {
        backgroundColor: '#A7F3D0',
    },
    statusLoss: {
        backgroundColor: '#FECACA',
    },
    statusDraw: {
        backgroundColor: '#FDE68A',
    },
    grid: {
        width: 312,
        flexDirection: 'row',
        flexWrap: 'wrap',
        justifyContent: 'space-between',
        marginBottom: 24,
    },
    cell: {
        width: 96,
        height: 96,
        marginBottom: 12,
        borderRadius: 20,
        borderWidth: 2,
        borderColor: theme.colors.accent,
        backgroundColor: theme.colors.background,
        alignItems: 'center',
        justifyContent: 'center',
        shadowColor: '#000',
        shadowOpacity: 0.06,
        shadowRadius: 6,
        shadowOffset: { width: 0, height: 3 },
        elevation: 2,
    },
    cellText: {
        fontSize: 38,
        fontWeight: '900',
    },
    xText: {
        color: theme.colors.accent,
    },
    oText: {
        color: theme.colors.text,
    },
    buttonPrimary: {
        width: '100%',
        backgroundColor: theme.colors.accent,
        paddingVertical: 15,
        borderRadius: 18,
        marginBottom: 12,
    },
    buttonPrimaryText: {
        textAlign: 'center',
        fontWeight: '800',
        fontSize: 16,
        color: theme.colors.darkText,
    },
    buttonSecondary: {
        width: '100%',
        backgroundColor: theme.colors.button,
        paddingVertical: 15,
        borderRadius: 18,
    },
    buttonSecondaryText: {
        textAlign: 'center',
        fontWeight: '700',
        fontSize: 16,
        color: theme.colors.text,
    },
});