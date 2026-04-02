    import { router } from 'expo-router';
import { StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { theme } from '../theme/theme';

    const players = [
        { name: 'Ben', score: 6767 },
        { name: 'John', score: 5432 },
        { name: 'Emma', score: 1674 },
        { name: 'Crescia', score: 1124 },
        { name: 'Paolo', score: 875 },
        { name: 'Helanie', score: 774 },
        { name: 'Huddwin', score: 723 },
    ];

    export default function LeaderboardScreen() {
        return (
            <View style={styles.container}>
            <Text style={styles.title}>Leaderboard</Text>

            {players.map((player, index) => (
                <View key={player.name} style={styles.row}>
                <Text style={styles.rank}>{index + 1}.</Text>
                <Text style={styles.name}>{player.name}</Text>
                <Text style={styles.score}>{player.score}</Text>
                </View>
            ))}

            <TouchableOpacity style={styles.button} onPress={() => router.back()}>
                <Text style={styles.buttonText}>Back</Text>
            </TouchableOpacity>
            </View>
        );
    }

    const styles = StyleSheet.create({
        container: {
            flex: 1,
            backgroundColor: theme.colors.background,
            padding: 24,
        },
        title: {
            fontSize: 30,
            fontWeight: 'bold',
            color: theme.colors.text,
            marginBottom: 20,
        },
        row: {
            flexDirection: 'row',
            backgroundColor: theme.colors.card,
            padding: 14,
            borderRadius: 16,
            marginBottom: 10,
        },
        rank: {
            width: 40,
            fontWeight: 'bold',
            color: theme.colors.darkText,
        },
        name: {
            flex: 1,
            color: theme.colors.darkText,
            fontWeight: '700',
        },
        score: {
            color: theme.colors.darkText,
            fontWeight: '700',
        },
        button: {
            marginTop: 20,
            backgroundColor: theme.colors.button,
            padding: 14,
            borderRadius: 16,
        },
        buttonText: {
            textAlign: 'center',
            color: theme.colors.text,
            fontWeight: '700',
        },
    });