import { router } from 'expo-router';
import React, { useCallback, useEffect, useRef, useState } from 'react';
import { StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import AchievementPopup from '../components/AchievementPopup';
import { unlockAchievement } from '../utils/achievements';
import { markGameAsPlayed } from '../utils/recentlyPlayed';
import { updatePongStats } from '../utils/stats';

const GAME_WIDTH = 320;
const GAME_HEIGHT = 420;
const PADDLE_WIDTH = 100;
const PADDLE_HEIGHT = 12;
const BALL_SIZE = 16;
const PLAYER_Y = GAME_HEIGHT - 34;
const BOT_Y = 22;
const WIN_SCORE = 5;

const BOT_SPEED = 2.3;
const BOT_REACTION_ZONE = 24;
const PLAYER_MOVE_STEP = 45;

export default function PongScreen() {
    const [playerX, setPlayerX] = useState((GAME_WIDTH - PADDLE_WIDTH) / 2);
    const [botX, setBotX] = useState((GAME_WIDTH - PADDLE_WIDTH) / 2);
    const [ballX, setBallX] = useState(GAME_WIDTH / 2 - BALL_SIZE / 2);
    const [ballY, setBallY] = useState(GAME_HEIGHT / 2 - BALL_SIZE / 2);

    const [playerScore, setPlayerScore] = useState(0);
    const [botScore, setBotScore] = useState(0);

    const [gameStarted, setGameStarted] = useState(false);
    const [gameOver, setGameOver] = useState(false);
    const [statusText, setStatusText] = useState('Tap Start to play Pong');

    const [showPopup, setShowPopup] = useState(false);
    const [unlockedAchievement, setUnlockedAchievement] = useState(null);

    const ballXRef = useRef(GAME_WIDTH / 2 - BALL_SIZE / 2);
    const ballYRef = useRef(GAME_HEIGHT / 2 - BALL_SIZE / 2);
    const dxRef = useRef(2.5);
    const dyRef = useRef(3);
    const playerXRef = useRef((GAME_WIDTH - PADDLE_WIDTH) / 2);
    const botXRef = useRef((GAME_WIDTH - PADDLE_WIDTH) / 2);
    const playerScoreRef = useRef(0);
    const botScoreRef = useRef(0);
    const startTimeRef = useRef(null);
    const firstPointUnlockedRef = useRef(false);
    const survivorUnlockedRef = useRef(false);
    const finishedStatsRef = useRef(false);

    useEffect(() => {
        const setupGame = async () => {
            const playResult = await markGameAsPlayed({
                title: 'Pong',
                route: '/pong',
            });

            const firstGameResult = await unlockAchievement('first_game');

            if (firstGameResult.newlyUnlocked && firstGameResult.achievement) {
                setUnlockedAchievement(firstGameResult.achievement);
                setShowPopup(true);
                return;
            }

            const pongPlayerResult = await unlockAchievement('pong_player');

            if (pongPlayerResult.newlyUnlocked && pongPlayerResult.achievement) {
                setUnlockedAchievement(pongPlayerResult.achievement);
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

    const handlePointAchievement = useCallback(
        async (newScore) => {
            if (newScore >= 1 && !firstPointUnlockedRef.current) {
                const result = await unlockAchievement('pong_first_score');
                if (result.newlyUnlocked) {
                    firstPointUnlockedRef.current = true;
                    showAchievementPopup(result.achievement);
                }
            }
        },
        [showAchievementPopup]
    );

    const handleSurvivorAchievement = useCallback(async () => {
        const result = await unlockAchievement('pong_survivor');
        survivorUnlockedRef.current = true;

        if (result.newlyUnlocked) {
            showAchievementPopup(result.achievement);
        }
    }, [showAchievementPopup]);

    const setRandomBallDirection = useCallback((serveTo) => {
        const horizontalSpeed = Math.random() * 2 + 1.5;
        const verticalSpeed = Math.random() * 1.5 + 2.8;

        const horizontalDirection = Math.random() < 0.5 ? -1 : 1;
        dxRef.current = horizontalSpeed * horizontalDirection;

        if (serveTo === 'player') {
            dyRef.current = verticalSpeed;
        } else if (serveTo === 'bot') {
            dyRef.current = -verticalSpeed;
        } else {
            dyRef.current = Math.random() < 0.5 ? -verticalSpeed : verticalSpeed;
        }
    }, []);

    const resetBall = useCallback(
        (lastScoredBy) => {
            ballXRef.current = GAME_WIDTH / 2 - BALL_SIZE / 2;
            ballYRef.current = GAME_HEIGHT / 2 - BALL_SIZE / 2;

            if (lastScoredBy === 'player') {
                setRandomBallDirection('bot');
            } else {
                setRandomBallDirection('player');
            }

            setBallX(ballXRef.current);
            setBallY(ballYRef.current);
        },
        [setRandomBallDirection]
    );

    const finishGame = useCallback(async () => {
        if (finishedStatsRef.current) return;
        finishedStatsRef.current = true;

        setGameOver(true);

        const result = playerScoreRef.current > botScoreRef.current ? 'win' : 'loss';
        const timeInSeconds = Math.floor((Date.now() - startTimeRef.current) / 1000);

        await updatePongStats({
            result,
            playerScore: playerScoreRef.current,
            timeInSeconds,
        });

        if (timeInSeconds >= 30 && !survivorUnlockedRef.current) {
            await handleSurvivorAchievement();
        }

        setStatusText(result === 'win' ? 'You win!' : 'Bot wins!');
    }, [handleSurvivorAchievement]);

    useEffect(() => {
        if (!gameStarted || gameOver) return;

        const interval = setInterval(() => {
            let nextBallX = ballXRef.current + dxRef.current;
            let nextBallY = ballYRef.current + dyRef.current;
            let nextBotX = botXRef.current;

            if (nextBallX <= 0 || nextBallX + BALL_SIZE >= GAME_WIDTH) {
                dxRef.current *= -1;
                nextBallX = ballXRef.current + dxRef.current;
            }

            const botCenter = nextBotX + PADDLE_WIDTH / 2;
            const ballCenter = nextBallX + BALL_SIZE / 2;

            if (nextBallY < GAME_HEIGHT / 2) {
                if (ballCenter < botCenter - BOT_REACTION_ZONE) {
                    nextBotX -= BOT_SPEED;
                } else if (ballCenter > botCenter + BOT_REACTION_ZONE) {
                    nextBotX += BOT_SPEED;
                }
            }

            if (nextBotX < 0) nextBotX = 0;
            if (nextBotX > GAME_WIDTH - PADDLE_WIDTH) {
                nextBotX = GAME_WIDTH - PADDLE_WIDTH;
            }

            if (
                nextBallY <= BOT_Y + PADDLE_HEIGHT &&
                nextBallX + BALL_SIZE >= nextBotX &&
                nextBallX <= nextBotX + PADDLE_WIDTH &&
                dyRef.current < 0
            ) {
                dyRef.current *= -1;
                nextBallY = BOT_Y + PADDLE_HEIGHT;

                const hitPoint =
                    (nextBallX + BALL_SIZE / 2 - (nextBotX + PADDLE_WIDTH / 2)) /
                    (PADDLE_WIDTH / 2);
                dxRef.current = hitPoint * 3.2;
            }

            if (
                nextBallY + BALL_SIZE >= PLAYER_Y &&
                nextBallX + BALL_SIZE >= playerXRef.current &&
                nextBallX <= playerXRef.current + PADDLE_WIDTH &&
                dyRef.current > 0
            ) {
                dyRef.current *= -1;
                nextBallY = PLAYER_Y - BALL_SIZE;

                const hitPoint =
                    (nextBallX + BALL_SIZE / 2 - (playerXRef.current + PADDLE_WIDTH / 2)) /
                    (PADDLE_WIDTH / 2);
                dxRef.current = hitPoint * 5;
            }

            if (nextBallY < 0) {
                const newPlayerScore = playerScoreRef.current + 1;
                playerScoreRef.current = newPlayerScore;
                setPlayerScore(newPlayerScore);

                handlePointAchievement(newPlayerScore);
                resetBall('player');
                return;
            }

            if (nextBallY + BALL_SIZE > GAME_HEIGHT) {
                const newBotScore = botScoreRef.current + 1;
                botScoreRef.current = newBotScore;
                setBotScore(newBotScore);

                resetBall('bot');
                return;
            }

            ballXRef.current = nextBallX;
            ballYRef.current = nextBallY;
            botXRef.current = nextBotX;

            setBallX(nextBallX);
            setBallY(nextBallY);
            setBotX(nextBotX);

            const elapsedSeconds = Math.floor((Date.now() - startTimeRef.current) / 1000);
            if (elapsedSeconds >= 30 && !survivorUnlockedRef.current) {
                handleSurvivorAchievement();
            }

            if (playerScoreRef.current >= WIN_SCORE || botScoreRef.current >= WIN_SCORE) {
                finishGame();
            }
        }, 16);

        return () => clearInterval(interval);
    }, [
        gameStarted,
        gameOver,
        finishGame,
        handlePointAchievement,
        handleSurvivorAchievement,
        resetBall,
    ]);

    const startGame = () => {
        setPlayerScore(0);
        setBotScore(0);
        setGameOver(false);
        setGameStarted(true);
        setStatusText('Game on!');

        playerScoreRef.current = 0;
        botScoreRef.current = 0;
        finishedStatsRef.current = false;
        firstPointUnlockedRef.current = false;
        survivorUnlockedRef.current = false;
        startTimeRef.current = Date.now();

        playerXRef.current = (GAME_WIDTH - PADDLE_WIDTH) / 2;
        botXRef.current = (GAME_WIDTH - PADDLE_WIDTH) / 2;
        ballXRef.current = GAME_WIDTH / 2 - BALL_SIZE / 2;
        ballYRef.current = GAME_HEIGHT / 2 - BALL_SIZE / 2;

        setRandomBallDirection('random');

        setPlayerX(playerXRef.current);
        setBotX(botXRef.current);
        setBallX(ballXRef.current);
        setBallY(ballYRef.current);
    };

    const movePlayer = (direction) => {
        if (!gameStarted || gameOver) return;

        let nextX = playerXRef.current + direction * PLAYER_MOVE_STEP;

        if (nextX < 0) nextX = 0;
        if (nextX > GAME_WIDTH - PADDLE_WIDTH) {
            nextX = GAME_WIDTH - PADDLE_WIDTH;
        }

        playerXRef.current = nextX;
        setPlayerX(nextX);
    };

    return (
        <View style={styles.container}>
            <Text style={styles.title}>Pong</Text>
            <Text style={styles.status}>{statusText}</Text>
            <Text style={styles.winRule}>First to 5 points wins!</Text>

            <View style={styles.scoreRow}>
                <Text style={styles.scoreText}>You: {playerScore}</Text>
                <Text style={styles.scoreText}>Bot: {botScore}</Text>
            </View>

            <View style={styles.gameArea}>
                <View
                    style={[
                        styles.paddle,
                        styles.botPaddle,
                        { left: botX, top: BOT_Y },
                    ]}
                />

                <View
                    style={[
                        styles.ball,
                        { left: ballX, top: ballY },
                    ]}
                />

                <View
                    style={[
                        styles.paddle,
                        styles.playerPaddle,
                        { left: playerX, top: PLAYER_Y },
                    ]}
                />
            </View>

            <View style={styles.controlsRow}>
                <TouchableOpacity style={styles.controlButton} onPress={() => movePlayer(-1)}>
                    <Text style={styles.controlButtonText}>◀ Left</Text>
                </TouchableOpacity>

                <TouchableOpacity
                    style={styles.controlButtonPrimary}
                    onPress={startGame}
                >
                    <Text style={styles.controlButtonPrimaryText}>
                        {gameStarted && !gameOver ? 'Restart' : 'Start'}
                    </Text>
                </TouchableOpacity>

                <TouchableOpacity style={styles.controlButton} onPress={() => movePlayer(1)}>
                    <Text style={styles.controlButtonText}>Right ▶</Text>
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
    winRule: {
        fontSize: 15,
        color: '#8A74B5',
        marginBottom: 14,
        textAlign: 'center',
        fontWeight: '600',
    },
    scoreRow: {
        flexDirection: 'row',
        gap: 24,
        marginBottom: 16,
    },
    scoreText: {
        fontSize: 18,
        fontWeight: '700',
        color: '#7A43D1',
    },
    gameArea: {
        width: GAME_WIDTH,
        height: GAME_HEIGHT,
        backgroundColor: '#FFFFFF',
        borderRadius: 20,
        borderWidth: 2,
        borderColor: '#D9C7FF',
        position: 'relative',
        overflow: 'hidden',
        marginBottom: 20,
    },
    paddle: {
        width: PADDLE_WIDTH,
        height: PADDLE_HEIGHT,
        borderRadius: 10,
        position: 'absolute',
    },
    playerPaddle: {
        backgroundColor: '#8E63F7',
    },
    botPaddle: {
        backgroundColor: '#C7AFEF',
    },
    ball: {
        width: BALL_SIZE,
        height: BALL_SIZE,
        borderRadius: BALL_SIZE / 2,
        backgroundColor: '#6E43B5',
        position: 'absolute',
    },
    controlsRow: {
        flexDirection: 'row',
        alignItems: 'center',
        marginBottom: 14,
    },
    controlButton: {
        backgroundColor: '#E9D7FF',
        paddingVertical: 12,
        paddingHorizontal: 16,
        borderRadius: 14,
        marginHorizontal: 6,
    },
    controlButtonText: {
        color: '#7A43D1',
        fontWeight: '700',
    },
    controlButtonPrimary: {
        backgroundColor: '#8E63F7',
        paddingVertical: 12,
        paddingHorizontal: 18,
        borderRadius: 14,
        marginHorizontal: 6,
    },
    controlButtonPrimaryText: {
        color: '#FFFFFF',
        fontWeight: '700',
    },
    backButton: {
        marginTop: 4,
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