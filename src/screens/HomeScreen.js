import { ScrollView, StyleSheet, Text, TouchableOpacity } from 'react-native';
import { theme } from '../theme/theme';

const games = [
    { title: 'Tic Tac Toe', screen: 'TicTacToe' },
    { title: 'Memory Match', screen: 'MemoryMatch' },
    { title: 'Pong', screen: 'Pong' },
    { title: 'Frogger', screen: 'Frogger' },
];

export default function HomeScreen({ navigation }) {
    return (
        <ScrollView contentContainerStyle={styles.container}>
        <Text style={styles.heading}>Hey, Ben!</Text>
        <Text style={styles.subheading}>Choose a game</Text>

        {games.map((game) => (
            <TouchableOpacity
            key={game.title}
            style={styles.card}
            onPress={() => navigation.navigate(game.screen)}
            >
            <Text style={styles.cardText}>{game.title}</Text>
            </TouchableOpacity>
        ))}

        <TouchableOpacity style={styles.smallButton} onPress={() => navigation.navigate('Leaderboard')}>
            <Text style={styles.smallButtonText}>Leaderboard</Text>
        </TouchableOpacity>

        <TouchableOpacity style={styles.smallButton} onPress={() => navigation.navigate('Profile')}>
            <Text style={styles.smallButtonText}>Profile</Text>
        </TouchableOpacity>
        </ScrollView>
    );
}

const styles = StyleSheet.create({
    container: {
        flexGrow: 1,
        backgroundColor: theme.colors.background,
        padding: 24,
        justifyContent: 'center',
    },
    heading: {
        fontSize: 30,
        fontWeight: 'bold',
        color: theme.colors.text,
        marginBottom: 8,
    },
    subheading: {
        fontSize: 18,
        color: theme.colors.text,
        marginBottom: 20,
    },
    card: {
        backgroundColor: theme.colors.card,
        padding: 18,
        borderRadius: 20,
        marginBottom: 14,
    },
    cardText: {
        fontSize: 20,
        fontWeight: '700',
        color: theme.colors.darkText,
    },
    smallButton: {
        backgroundColor: theme.colors.button,
        padding: 14,
        borderRadius: 16,
        marginTop: 10,
    },
    smallButtonText: {
    textAlign: 'center',
    color: theme.colors.text,
    fontWeight: '700',
    fontSize: 16,
    },
});