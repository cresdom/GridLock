import { router } from 'expo-router';
import React, { useState } from 'react';
import { StyleSheet, Text, TouchableOpacity, View } from 'react-native';

const COLS = 7;
const ROWS = 8;
const CELL_SIZE = 42;

const INITIAL_PLAYER = {
    row: ROWS - 1,
    col: Math.floor(COLS / 2),
};

export default function FroggerScreen() {
    const [player] = useState(INITIAL_PLAYER);

    return (
        <View style={styles.container}>
            <Text style={styles.title}>Frogger</Text>
            <Text style={styles.status}>Get to the top!</Text>
            <Text style={styles.levelText}>Level 1 / 3</Text>

            <View style={styles.board}>
                {Array.from({ length: ROWS }).map((_, rowIndex) => (
                    <View key={rowIndex} style={styles.row}>
                        {Array.from({ length: COLS }).map((_, colIndex) => {
                            const isGoal = rowIndex === 0;
                            const isStart = rowIndex === ROWS - 1;
                            const isRoad = rowIndex > 0 && rowIndex < ROWS - 1;

                            const hasPlayer =
                                player.row === rowIndex && player.col === colIndex;

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
                                    {hasPlayer && <View style={styles.frog} />}
                                </View>
                            );
                        })}
                    </View>
                ))}
            </View>

            <View style={styles.controls}>
                <TouchableOpacity style={styles.arrowButton}>
                    <Text style={styles.arrowText}>▲</Text>
                </TouchableOpacity>

                <View style={styles.middleControls}>
                    <TouchableOpacity style={styles.arrowButton}>
                        <Text style={styles.arrowText}>◀</Text>
                    </TouchableOpacity>

                    <TouchableOpacity style={styles.startButton}>
                        <Text style={styles.startButtonText}>Start</Text>
                    </TouchableOpacity>

                    <TouchableOpacity style={styles.arrowButton}>
                        <Text style={styles.arrowText}>▶</Text>
                    </TouchableOpacity>
                </View>

                <TouchableOpacity style={styles.arrowButton}>
                    <Text style={styles.arrowText}>▼</Text>
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