import { Text, TouchableOpacity, View } from 'react-native';
import { theme } from '../theme/theme';

export default function SplashScreen({ navigation }) {
    return (
        <View style={styles.container}>
        <Text style={styles.logo}>🎮</Text>
        <Text style={styles.title}>GridLock</Text>
        <TouchableOpacity style={styles.button} onPress={() => navigation.replace('Home')}>
            <Text style={styles.buttonText}>Tap to Begin</Text>
        </TouchableOpacity>
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: theme.colors.background,
        justifyContent: 'center',
        alignItems: 'center',
        padding: 24,
    },
    logo: {
        fontSize: 80,
        marginBottom: 20,
    },
    title: {
        fontSize: 36,
        fontWeight: 'bold',
        color: theme.colors.text,
        marginBottom: 30,
    },
    button: {
        backgroundColor: theme.colors.accent,
        paddingVertical: 14,
        paddingHorizontal: 28,
        borderRadius: 30,
    },
    buttonText: {
        color: theme.colors.darkText,
        fontSize: 18,
        fontWeight: '700',
    },
});