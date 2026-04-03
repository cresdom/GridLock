import { Ionicons } from '@expo/vector-icons';
import { Modal, StyleSheet, Text, TouchableOpacity, View } from 'react-native';

export default function AchievementPopup({
    visible,
    achievement,
    onViewAchievements,
    onClose,
    }) {
    if (!achievement) return null;

    return (
        <Modal visible={visible} transparent animationType="fade">
        <View style={styles.overlay}>
            <View style={styles.popup}>
            <Text style={styles.yay}>YAY!</Text>
            <Text style={styles.title}>Achievement Unlocked!</Text>

            <View style={styles.iconWrap}>
                <Ionicons name={achievement.icon} size={42} color="#7A43D1" />
            </View>

            <Text style={styles.achievementName}>{achievement.title}</Text>
            <Text style={styles.description}>{achievement.description}</Text>

            <TouchableOpacity style={styles.primaryButton} onPress={onViewAchievements}>
                <Text style={styles.primaryButtonText}>View Achievements</Text>
            </TouchableOpacity>

            <TouchableOpacity style={styles.secondaryButton} onPress={onClose}>
                <Text style={styles.secondaryButtonText}>Maybe Later</Text>
            </TouchableOpacity>
            </View>
        </View>
        </Modal>
    );
}

const styles = StyleSheet.create({
    overlay: {
        flex: 1,
        backgroundColor: 'rgba(0,0,0,0.35)',
        justifyContent: 'center',
        alignItems: 'center',
        padding: 24,
    },
    popup: {
        width: '100%',
        backgroundColor: '#FFF',
        borderRadius: 24,
        padding: 24,
        alignItems: 'center',
    },
    yay: {
        fontSize: 34,
        fontWeight: '900',
        color: '#8D63FF',
        marginBottom: 4,
    },
    title: {
        fontSize: 22,
        fontWeight: '700',
        color: '#6A45B8',
        marginBottom: 18,
        textAlign: 'center',
    },
    iconWrap: {
        width: 78,
        height: 78,
        borderRadius: 39,
        backgroundColor: '#EFE7FF',
        justifyContent: 'center',
        alignItems: 'center',
        marginBottom: 14,
    },
    achievementName: {
        fontSize: 20,
        fontWeight: '700',
        color: '#7A43D1',
        marginBottom: 6,
        textAlign: 'center',
    },
    description: {
        fontSize: 14,
        color: '#7D68A8',
        textAlign: 'center',
        marginBottom: 20,
    },
    primaryButton: {
        width: '100%',
        backgroundColor: '#8D63FF',
        paddingVertical: 14,
        borderRadius: 16,
        alignItems: 'center',
        marginBottom: 10,
    },
    primaryButtonText: {
        color: '#FFF',
        fontWeight: '700',
        fontSize: 16,
    },
    secondaryButton: {
        width: '100%',
        backgroundColor: '#E9D7FF',
        paddingVertical: 14,
        borderRadius: 16,
        alignItems: 'center',
    },
    secondaryButtonText: {
        color: '#7A43D1',
        fontWeight: '700',
        fontSize: 16,
    },
});