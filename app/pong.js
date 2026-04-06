import { router } from 'expo-router';
import React, { useRef, useState } from 'react';
import { StyleSheet, Text, TouchableOpacity, View } from 'react-native';

const GAME_WIDTH = 320;
const GAME_HEIGHT = 420;
const PADDLE_WIDTH = 100;
const PADDLE_HEIGHT = 12;
const BALL_SIZE = 16;
const PLAYER_Y = GAME_HEIGHT - 34;
const BOT_Y = 22;
const WIN_SCORE = 5;
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

    const playerXRef = useRef((GAME_WIDTH - PADDLE_WIDTH) / 2);
    const botXRef = useRef((GAME_WIDTH - PADDLE_WIDTH) / 2);
    const ballXRef = useRef(GAME_WIDTH / 2 - BALL_SIZE / 2);
    const ballYRef = useRef(GAME_HEIGHT / 2 - BALL_SIZE / 2);
    const dxRef = useRef(2.5);
    const dyRef = useRef(3);
    const playerScoreRef = useRef(0);
    const botScoreRef = useRef(0);

    const startGame = () => {
        setPlayerScore(0);
        setBotScore(0);
        setGameOver(false);
        setGameStarted(true);
        setStatusText('Game on!');

        playerScoreRef.current = 0;
        botScoreRef.current = 0;

        playerXRef.current = (GAME_WIDTH - PADDLE_WIDTH) / 2;
        botXRef.current = (GAME_WIDTH - PADDLE_WIDTH) / 2;
        ballXRef.current = GAME_WIDTH / 2 - BALL_SIZE / 2;
        ballYRef.current = GAME_HEIGHT / 2 - BALL_SIZE / 2;

        dxRef.current = 2.5;
        dyRef.current = 3;

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
                    style={[styles.paddle, styles.botPaddle, { left: botX, top: BOT_Y }]}
                />
                <View style={[styles.ball, { left: ballX, top: ballY }]} />
                <View
                    style={[styles.paddle, styles.playerPaddle, { left: playerX, top: PLAYER_Y }]}
                />
            </View>

            <View style={styles.controlsRow}>
                <TouchableOpacity style={styles.controlButton} onPress={() => movePlayer(-1)}>
                    <Text style={styles.controlButtonText}>◀ Left</Text>
                </TouchableOpacity>

                <TouchableOpacity style={styles.controlButtonPrimary} onPress={startGame}>
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