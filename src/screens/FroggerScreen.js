import { router } from 'expo-router';
import React, { useCallback, useEffect, useRef, useState } from 'react';
import { StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import AchievementPopup from '../components/AchievementPopup';
import { unlockAchievement } from '../utils/achievements';
import { markGameAsPlayed } from '../utils/recentlyPlayed';
import { updateFroggerStats } from '../utils/stats';

const COLS = 7;
const ROWS = 8;
const CELL_SIZE = 42;
const LEVELS_TO_WIN = 3;

const INITIAL_PLAYER = {
    row: ROWS - 1,
    col: Math.floor(COLS / 2),
};

const createCarsForLevel = (level) => [
    { id: 'lane1-a', row: 1, col: 0, dir: 1, speed: 1 + level * 0.15 },
    { id: 'lane1-b', row: 1, col: 4, dir: 1, speed: 1 + level * 0.15 },

    { id: 'lane2-a', row: 2, col: 6, dir: -1, speed: 1.1 + level * 0.15 },
    { id: 'lane2-b', row: 2, col: 2, dir: -1, speed: 1.1 + level * 0.15 },

    { id: 'lane3-a', row: 3, col: 1, dir: 1, speed: 1.25 + level * 0.15 },
    { id: 'lane3-b', row: 3, col: 5, dir: 1, speed: 1.25 + level * 0.15 },

    { id: 'lane4-a', row: 4, col: 6, dir: -1, speed: 1.35 + level * 0.15 },
    { id: 'lane4-b', row: 4, col: 3, dir: -1, speed: 1.35 + level * 0.15 },

    { id: 'lane5-a', row: 5, col: 0, dir: 1, speed: 1.5 + level * 0.15 },
    { id: 'lane5-b', row: 5, col: 4, dir: 1, speed: 1.5 + level * 0.15 },
];

export default function FroggerScreen() {
    const [player, setPlayer] = useState(INITIAL_PLAYER);
    const [cars, setCars] = useState(createCarsForLevel(1));
    const [level, setLevel] = useState(1);
    const [statusText, setStatusText] = useState('Get to the top!');
    const [gameOver, setGameOver] = useState(false);
    const [wonGame, setWonGame] = useState(false);
    const [gameStarted, setGameStarted] = useState(false);

    const [showPopup, setShowPopup] = useState(false);
    const [unlockedAchievement, setUnlockedAchievement] = useState(null);

    const startTimeRef = useRef(null);
    const escapeUnlockedRef = useRef(false);
    const statsSavedRef = useRef(false);

    useEffect(() => {
        const setupGame = async () => {
        const playResult = await markGameAsPlayed({
            title: 'Frogger',
            route: '/frogger',
        });

        const firstGameResult = await unlockAchievement('first_game');

        if (firstGameResult.newlyUnlocked && firstGameResult.achievement) {
            setUnlockedAchievement(firstGameResult.achievement);
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

    const showAchievementPopup = useCallback((achievement) => {
        if (!achievement) return;
        setUnlockedAchievement(achievement);
        setShowPopup(true);
    }, []);

    const checkCollision = useCallback(
        async (carList, playerPosition, currentLevel) => {
        if (playerPosition.row === 0 || playerPosition.row === ROWS - 1) return;

        const collided = carList.some((car) => {
            if (car.row !== playerPosition.row) return false;
            return Math.round(car.col) === playerPosition.col;
        });

        if (collided) {
            setGameOver(true);
            setStatusText('You got hit!');

            if (!statsSavedRef.current) {
            statsSavedRef.current = true;

            const timeInSeconds = Math.floor((Date.now() - startTimeRef.current) / 1000);

            await updateFroggerStats({
                won: false,
                timeInSeconds,
                levelReached: currentLevel,
            });
            }
        }
        },
        []
    );

    const handleLevelClear = useCallback(async () => {
        if (!escapeUnlockedRef.current) {
        const escapeResult = await unlockAchievement('frogger_escape');
        escapeUnlockedRef.current = true;

        if (escapeResult.newlyUnlocked) {
            showAchievementPopup(escapeResult.achievement);
        }
        }

        if (level >= LEVELS_TO_WIN) {
        setWonGame(true);
        setStatusText('You win! Frogger complete!');

        if (!statsSavedRef.current) {
            statsSavedRef.current = true;

            const timeInSeconds = Math.floor((Date.now() - startTimeRef.current) / 1000);

            await updateFroggerStats({
            won: true,
            timeInSeconds,
            levelReached: level,
            });
        }

        const proResult = await unlockAchievement('frogger_pro');
        if (proResult.newlyUnlocked) {
            showAchievementPopup(proResult.achievement);
        }

        return;
        }

        const nextLevel = level + 1;
        setLevel(nextLevel);
        setPlayer(INITIAL_PLAYER);
        setCars(createCarsForLevel(nextLevel));
        setStatusText(`Nice! Level ${nextLevel}`);
    }, [level, showAchievementPopup]);

    useEffect(() => {
        if (!gameStarted || gameOver || wonGame) return;

        const interval = setInterval(() => {
        setCars((prevCars) => {
            const updatedCars = prevCars.map((car) => {
            let nextCol = car.col + car.dir * car.speed * 0.2;

            if (car.dir === 1 && nextCol > COLS) {
                nextCol = -1;
            } else if (car.dir === -1 && nextCol < -1) {
                nextCol = COLS;
            }

            return {
                ...car,
                col: nextCol,
            };
            });

            checkCollision(updatedCars, player, level);

            return updatedCars;
        });
        }, 90);

        return () => clearInterval(interval);
    }, [gameStarted, gameOver, wonGame, player, level, checkCollision]);

    const startGame = () => {
        setPlayer(INITIAL_PLAYER);
        setCars(createCarsForLevel(1));
        setLevel(1);
        setStatusText('Get to the top!');
        setGameOver(false);
        setWonGame(false);
        setGameStarted(true);

        startTimeRef.current = Date.now();
        escapeUnlockedRef.current = false;
        statsSavedRef.current = false;
    };

    const movePlayer = async (rowChange, colChange) => {
        if (!gameStarted || gameOver || wonGame) return;

        const nextRow = Math.max(0, Math.min(ROWS - 1, player.row + rowChange));
        const nextCol = Math.max(0, Math.min(COLS - 1, player.col + colChange));

        const nextPlayer = {
        row: nextRow,
        col: nextCol,
        };

        setPlayer(nextPlayer);

        if (nextRow === 0) {
        await handleLevelClear();
        return;
        }

        await checkCollision(cars, nextPlayer, level);
    };

    return (
        <View style={styles.container}>
        <Text style={styles.title}>Frogger</Text>
        <Text style={styles.status}>{statusText}</Text>
        <Text style={styles.levelText}>
            Level {level} / {LEVELS_TO_WIN}
        </Text>

        <View style={styles.board}>
            {Array.from({ length: ROWS }).map((_, rowIndex) => (
            <View key={rowIndex} style={styles.row}>
                {Array.from({ length: COLS }).map((_, colIndex) => {
                const isGoal = rowIndex === 0;
                const isStart = rowIndex === ROWS - 1;
                const isRoad = rowIndex > 0 && rowIndex < ROWS - 1;

                const hasPlayer =
                    player.row === rowIndex && player.col === colIndex;

                const hasCar = cars.some(
                    (car) =>
                    car.row === rowIndex && Math.round(car.col) === colIndex
                );

                return (
                    <View
                    key={`${rowIndex}-${colIndex}`}
                    style={[
                        styles.cell,
                        isGoal && styles.goalCell,
                        isRoad && styles.roadCell,
                        isStart && styles.startCell,
                    ]}
                    >
                    {hasCar && <View style={styles.car} />}
                    {hasPlayer && <View style={styles.frog} />}
                    </View>
                );
                })}
            </View>
            ))}
        </View>

        <View style={styles.controls}>
            <TouchableOpacity style={styles.arrowButton} onPress={() => movePlayer(-1, 0)}>
            <Text style={styles.arrowText}>▲</Text>
            </TouchableOpacity>

            <View style={styles.middleControls}>
            <TouchableOpacity style={styles.arrowButton} onPress={() => movePlayer(0, -1)}>
                <Text style={styles.arrowText}>◀</Text>
            </TouchableOpacity>

            <TouchableOpacity style={styles.startButton} onPress={startGame}>
                <Text style={styles.startButtonText}>
                {gameStarted ? 'Restart' : 'Start'}
                </Text>
            </TouchableOpacity>

            <TouchableOpacity style={styles.arrowButton} onPress={() => movePlayer(0, 1)}>
                <Text style={styles.arrowText}>▶</Text>
            </TouchableOpacity>
            </View>

            <TouchableOpacity style={styles.arrowButton} onPress={() => movePlayer(1, 0)}>
            <Text style={styles.arrowText}>▼</Text>
            </TouchableOpacity>
        </View>

        <TouchableOpacity style={styles.backButton} onPress={() => router.back()}>
            <Text style={styles.backButtonText}>Back</Text>
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
        backgroundColor: '#F5F0FF',
        alignItems: 'center',
        justifyContent: 'center',
        padding: 20,
    },
    title: {
        fontSize: 30,
        fontWeight: '800',
        color: '#6E43B5',
        marginBottom: 8,
    },
    status: {
        fontSize: 16,
        color: '#7D68A8',
        marginBottom: 6,
        textAlign: 'center',
    },
    levelText: {
        fontSize: 16,
        fontWeight: '700',
        color: '#7A43D1',
        marginBottom: 14,
    },
    board: {
        backgroundColor: '#FFFFFF',
        padding: 8,
        borderRadius: 20,
        borderWidth: 2,
        borderColor: '#D9C7FF',
        marginBottom: 20,
    },
    row: {
        flexDirection: 'row',
    },
    cell: {
        width: CELL_SIZE,
        height: CELL_SIZE,
        margin: 2,
        borderRadius: 10,
        alignItems: 'center',
        justifyContent: 'center',
        backgroundColor: '#EEE7FF',
    },
    goalCell: {
        backgroundColor: '#D6F5D6',
    },
    roadCell: {
        backgroundColor: '#D8C6FF',
    },
    startCell: {
        backgroundColor: '#F8E7B7',
    },
    frog: {
        width: 20,
        height: 20,
        borderRadius: 10,
        backgroundColor: '#43B75F',
    },
    car: {
        width: 26,
        height: 16,
        borderRadius: 6,
        backgroundColor: '#6E43B5',
        position: 'absolute',
    },
    controls: {
        alignItems: 'center',
        marginBottom: 14,
    },
    middleControls: {
        flexDirection: 'row',
        alignItems: 'center',
        marginVertical: 8,
    },
    arrowButton: {
        backgroundColor: '#E9D7FF',
        width: 64,
        height: 50,
        borderRadius: 14,
        alignItems: 'center',
        justifyContent: 'center',
        marginHorizontal: 8,
    },
    arrowText: {
        fontSize: 24,
        fontWeight: '700',
        color: '#7A43D1',
    },
    startButton: {
        backgroundColor: '#8E63F7',
        paddingVertical: 14,
        paddingHorizontal: 20,
        borderRadius: 14,
    },
    startButtonText: {
        color: '#FFFFFF',
        fontWeight: '700',
    },
    backButton: {
        backgroundColor: '#D8C6FF',
        paddingVertical: 12,
        paddingHorizontal: 30,
        borderRadius: 14,
    },
    backButtonText: {
        color: '#6E43B5',
        fontWeight: '700',
    },
});