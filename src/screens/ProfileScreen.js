import { router } from 'expo-router';
import { StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { theme } from '../theme/theme';

export default function ProfileScreen() {
    return (
        <View style={styles.container}>
        <Text style={styles.title}>Personal Information</Text>

        <View style={styles.card}>
            <Text style={styles.label}>Username</Text>
            <Text style={styles.value}>ben_is_jammin</Text>
        </View>

        <View style={styles.card}>
            <Text style={styles.label}>First Name</Text>
            <Text style={styles.value}>Ben</Text>
        </View>

        <View style={styles.card}>
            <Text style={styles.label}>Last Name</Text>
            <Text style={styles.value}>Jammin</Text>
        </View>

        <View style={styles.card}>
            <Text style={styles.label}>Email</Text>
            <Text style={styles.value}>benjammin@gmail.com</Text>
        </View>

        <View style={styles.card}>
            <Text style={styles.label}>Date of Birth</Text>
            <Text style={styles.value}>03/04/1990</Text>
        </View>

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
        fontSize: 28,
        fontWeight: 'bold',
        color: theme.colors.text,
        marginBottom: 20,
    },
    card: {
        backgroundColor: theme.colors.card,
        padding: 16,
        borderRadius: 16,
        marginBottom: 12,
    },
    label: {
        color: theme.colors.darkText,
        fontWeight: 'bold',
        marginBottom: 6,
    },
    value: {
        color: theme.colors.darkText,
        fontSize: 16,
    },
    button: {
        backgroundColor: theme.colors.button,
        padding: 14,
        borderRadius: 16,
        marginTop: 20,
    },
    buttonText: {
        textAlign: 'center',
        color: theme.colors.text,
        fontWeight: '700',
    },
});