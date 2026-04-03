import { FontAwesome, Ionicons, MaterialIcons } from '@expo/vector-icons';
import { router, useFocusEffect } from 'expo-router';
import { useCallback, useState } from 'react';
import { Alert, ScrollView, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { getStats, resetStats } from '../utils/stats';

function formatTime(seconds) {
    if (seconds === null || seconds === undefined) return 'N/A';
    return `${seconds}s`;
}

export default function StatsScreen() {
    const [stats, setStats] = useState(null);

    useFocusEffect(
        useCallback(() => {
        loadStats();
        }, [])
    );

    const loadStats = async () => {
        const savedStats = await getStats();
        setStats(savedStats);
    };

    const handleResetStats = () => {
        Alert.alert(
            'Reset Stats',
            'Are you sure you want to reset all stats?',
            [
                {
                    text: 'Cancel',
                    style: 'cancel',
                },
                {
                    text: 'Reset',
                    style: 'destructive',
                    onPress: async () => {
                    const freshStats = await resetStats();
                    setStats(freshStats);
                    Alert.alert('Done', 'All stats have been reset.');
                    },
                },
            ]
        );
};

    if (!stats) {
        return (
        <View style={styles.loadingContainer}>
            <Text style={styles.loadingText}>Loading stats...</Text>
        </View>
        );
    }

    return (
        <View style={styles.screen}>
        <ScrollView contentContainerStyle={styles.container}>
            <TouchableOpacity style={styles.backButton} onPress={() => router.back()}>
            <Ionicons name="chevron-back" size={28} color="#8E63B7" />
            </TouchableOpacity>

            <MaterialIcons name="leaderboard" size={72} color="#8E63F7" style={styles.topIcon} />

            <View style={styles.titlePill}>
            <Text style={styles.titleText}>Stats</Text>
            </View>

            <View style={styles.card}>
            <Text style={styles.sectionTitle}>Overall</Text>
            <Text style={styles.statText}>Games Played: {stats.totalGamesPlayed}</Text>
            <Text style={styles.statText}>Wins: {stats.totalWins}</Text>
            <Text style={styles.statText}>Losses: {stats.totalLosses}</Text>
            <Text style={styles.statText}>Draws: {stats.totalDraws}</Text>
            <Text style={styles.statText}>Total Points: {stats.totalPoints}</Text>
            </View>

            <View style={styles.card}>
            <Text style={styles.sectionTitle}>Tic Tac Toe</Text>
            <Text style={styles.statText}>Games Played: {stats.ticTacToe.gamesPlayed}</Text>
            <Text style={styles.statText}>Wins: {stats.ticTacToe.wins}</Text>
            <Text style={styles.statText}>Losses: {stats.ticTacToe.losses}</Text>
            <Text style={styles.statText}>Draws: {stats.ticTacToe.draws}</Text>
            <Text style={styles.statText}>Best Win Streak: {stats.ticTacToe.bestWinStreak}</Text>
            </View>

            <View style={styles.card}>
            <Text style={styles.sectionTitle}>Memory Match</Text>
            <Text style={styles.statText}>Games Played: {stats.memoryMatch.gamesPlayed}</Text>
            <Text style={styles.statText}>Games Completed: {stats.memoryMatch.gamesCompleted}</Text>
            <Text style={styles.statText}>Best Time: {formatTime(stats.memoryMatch.bestTime)}</Text>
            <Text style={styles.statText}>Fewest Moves: {stats.memoryMatch.fewestMoves ?? 'N/A'}</Text>
            </View>

            <View style={styles.card}>
            <Text style={styles.sectionTitle}>Pong</Text>
            <Text style={styles.statText}>Games Played: {stats.pong.gamesPlayed}</Text>
            <Text style={styles.statText}>Wins: {stats.pong.wins}</Text>
            <Text style={styles.statText}>Losses: {stats.pong.losses}</Text>
            <Text style={styles.statText}>Highest Score: {stats.pong.highestScore}</Text>
            <Text style={styles.statText}>Best Time: {formatTime(stats.pong.bestTime)}</Text>
            </View>

            <View style={styles.card}>
            <Text style={styles.sectionTitle}>Frogger</Text>
            <Text style={styles.statText}>Games Played: {stats.frogger.gamesPlayed}</Text>
            <Text style={styles.statText}>Wins: {stats.frogger.wins}</Text>
            <Text style={styles.statText}>Best Time: {formatTime(stats.frogger.bestTime)}</Text>
            <Text style={styles.statText}>Highest Level: {stats.frogger.highestLevel}</Text>
            </View>

            <TouchableOpacity style={styles.resetButton} onPress={handleResetStats}>
            <Text style={styles.resetButtonText}>Reset Stats</Text>
            </TouchableOpacity>
        </ScrollView>

        <View style={styles.bottomNav}>
            <TouchableOpacity style={styles.navItem} onPress={() => router.push('/home')}>
            <FontAwesome name="home" size={30} color="#7A43D1" />
            </TouchableOpacity>

            <View style={styles.navDivider} />

            <TouchableOpacity style={styles.navItem} onPress={() => router.push('/stats')}>
            <MaterialIcons name="leaderboard" size={30} color="#7A43D1" />
            </TouchableOpacity>

            <View style={styles.navDivider} />

            <TouchableOpacity style={styles.navItem} onPress={() => router.push('/achievements')}>
            <FontAwesome name="trophy" size={30} color="#7A43D1" />
            </TouchableOpacity>

            <View style={styles.navDivider} />

            <TouchableOpacity style={styles.navItem} onPress={() => router.push('/profile')}>
            <Ionicons name="person" size={30} color="#7A43D1" />
            </TouchableOpacity>
        </View>
        </View>
    );
}

const styles = StyleSheet.create({
    screen: {
        flex: 1,
        backgroundColor: '#F5F0FF',
    },
    container: {
        backgroundColor: '#F5F0FF',
        paddingTop: 70,
        paddingHorizontal: 20,
        paddingBottom: 140,
    },
    loadingContainer: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
    },
    loadingText: {
        fontSize: 18,
        color: '#7A43D1',
    },
    backButton: {
        position: 'absolute',
        top: 158,
        left: 16,
        zIndex: 10,
    },
    topIcon: {
        alignSelf: 'center',
        marginBottom: 8,
    },
    titlePill: {
        alignSelf: 'center',
        backgroundColor: '#CDBAF6',
        borderRadius: 10,
        minWidth: 220,
        paddingVertical: 10,
        alignItems: 'center',
        marginBottom: 20,
    },
    titleText: {
        color: '#FFFFFF',
        fontSize: 18,
        fontWeight: '700',
    },
    card: {
        backgroundColor: '#FFFFFF',
        borderRadius: 18,
        padding: 18,
        marginBottom: 14,
    },
    sectionTitle: {
        fontSize: 18,
        fontWeight: '700',
        color: '#7A43D1',
        marginBottom: 10,
    },
    statText: {
        fontSize: 15,
        color: '#5E4A87',
        marginBottom: 6,
    },
    resetButton: {
        alignSelf: 'center',
        backgroundColor: '#E9D7FF',
        paddingVertical: 12,
        paddingHorizontal: 20,
        borderRadius: 14,
        marginTop: 10,
        marginBottom: 20,
    },
    resetButtonText: {
        color: '#7A43D1',
        fontWeight: '700',
        fontSize: 14,
    },
    bottomNav: {
        position: 'absolute',
        left: 0,
        right: 0,
        bottom: -18,
        height: 110,
        backgroundColor: '#F7F3FF',
        borderTopWidth: 1,
        borderTopColor: '#DDD2F5',
        flexDirection: 'row',
        justifyContent: 'space-evenly',
        alignItems: 'center',
        paddingBottom: 28,
        paddingTop: 10,
    },
    navItem: {
        flex: 1,
        alignItems: 'center',
        justifyContent: 'center',
    },
    navDivider: {
        width: 1,
        height: 28,
        backgroundColor: '#CDBAF6',
    },
});