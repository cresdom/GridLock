import { FontAwesome, Ionicons, MaterialIcons } from '@expo/vector-icons';
import { router, useFocusEffect } from 'expo-router';
import { useCallback, useState } from 'react';
import { Alert, ScrollView, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { ACHIEVEMENT_LIST, getUnlockedAchievements, resetAllAchievements } from '../utils/achievements';

export default function AchievementsScreen() {
    const [unlockedIds, setUnlockedIds] = useState([]);

    useFocusEffect(
        useCallback(() => {
        loadAchievements();
        }, [])
    );

    const loadAchievements = async () => {
        const unlocked = await getUnlockedAchievements();
        setUnlockedIds(unlocked);
    };

    const handleResetAchievements = () => {
        Alert.alert(
        'Reset Achievements',
        'Are you sure you want to reset all achievements?',
        [
            {
            text: 'Cancel',
            style: 'cancel',
            },
            {
            text: 'Reset',
            style: 'destructive',
            onPress: async () => {
                await resetAllAchievements();
                setUnlockedIds([]);
                Alert.alert('Done', 'All achievements have been reset.');
            },
            },
        ]
        );
    };

    return (
        <View style={styles.screen}>
        <ScrollView contentContainerStyle={styles.container}>
            <TouchableOpacity style={styles.backButton} onPress={() => router.back()}>
            <Ionicons name="chevron-back" size={28} color="#8E63B7" />
            </TouchableOpacity>

            <FontAwesome name="trophy" size={72} color="#8E63F7" style={styles.topIcon}
            />

            <View style={styles.titlePill}>
            <Text style={styles.titleText}>Achievements</Text>
            </View>

            <View style={styles.grid}>
            {ACHIEVEMENT_LIST.map((item) => {
                const unlocked = unlockedIds.includes(item.id);

                return (
                <View
                    key={item.id}
                    style={[styles.card, !unlocked && styles.lockedCard]}
                >
                    <Ionicons
                    name={item.icon}
                    size={34}
                    color={unlocked ? '#7A43D1' : '#AAA'}
                    />
                    <Text style={[styles.cardTitle, !unlocked && styles.lockedText]}>
                    {item.title}
                    </Text>
                    <Text style={[styles.cardDescription, !unlocked && styles.lockedText]}>
                    {item.description}
                    </Text>

                    {!unlocked && (
                    <Ionicons name="lock-closed" size={16} color="#AAA" style={styles.lockIcon}
                    />
                    )}
                </View>
                );
            })}
            </View>

            <TouchableOpacity style={styles.resetButton} onPress={handleResetAchievements}>
            <Text style={styles.resetButtonText}>Reset Achievements</Text>
            </TouchableOpacity>
        </ScrollView>

        <View style={styles.bottomNav}>
            <TouchableOpacity onPress={() => router.push('/home')}>
            <FontAwesome name="home" size={30} color="#7A43D1" />
            </TouchableOpacity>

            <TouchableOpacity onPress={() => router.push('/stats')}>
            <MaterialIcons name="leaderboard" size={30} color="#7A43D1" />
            </TouchableOpacity>

            <TouchableOpacity onPress={() => router.push('/achievements')}>
            <FontAwesome name="trophy" size={30} color="#7A43D1" />
            </TouchableOpacity>

            <TouchableOpacity onPress={() => router.push('/profile')}>
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
    grid: {
        flexDirection: 'row',
        flexWrap: 'wrap',
        justifyContent: 'space-between',
        paddingBottom: 20,
    },
    card: {
        width: '48%',
        backgroundColor: '#FFFFFF',
        borderRadius: 20,
        padding: 16,
        marginBottom: 14,
        alignItems: 'center',
        minHeight: 170,
        justifyContent: 'center',
    },
    lockedCard: {
        opacity: 0.65,
    },
    cardTitle: {
        marginTop: 10,
        fontSize: 15,
        fontWeight: '700',
        color: '#7A43D1',
        textAlign: 'center',
    },
    cardDescription: {
        marginTop: 8,
        fontSize: 12,
        color: '#7D68A8',
        textAlign: 'center',
    },
    lockedText: {
        color: '#999',
    },
    lockIcon: {
        marginTop: 8,
    },
    resetButton: {
        alignSelf: 'center',
        backgroundColor: '#E9D7FF',
        paddingVertical: 12,
        paddingHorizontal: 20,
        borderRadius: 14,
        marginTop: 6,
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
        bottom: 0,
        height: 88,
        backgroundColor: '#F7F3FF',
        borderTopWidth: 1,
        borderTopColor: '#DDD2F5',
        flexDirection: 'row',
        justifyContent: 'space-around',
        alignItems: 'center',
        paddingBottom: 10,
    },
});