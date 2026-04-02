import { Ionicons } from '@expo/vector-icons';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { router } from 'expo-router';
import { useEffect, useState } from 'react';
import { Image, StyleSheet, Switch, Text, TouchableOpacity, View } from 'react-native';

const NOTIFICATIONS_KEY = 'gridlock_notifications_enabled';

export default function SettingsScreen() {
    const [notificationsEnabled, setNotificationsEnabled] = useState(true);

    useEffect(() => {
        loadNotificationSetting();
    }, []);

    const loadNotificationSetting = async () => {
        try {
        const savedValue = await AsyncStorage.getItem(NOTIFICATIONS_KEY);
        if (savedValue !== null) {
            setNotificationsEnabled(JSON.parse(savedValue));
        }
        } catch (error) {
        console.log('Error loading notification setting:', error);
        }
    };

    const toggleNotifications = async () => {
        try {
        const newValue = !notificationsEnabled;
        setNotificationsEnabled(newValue);
        await AsyncStorage.setItem(NOTIFICATIONS_KEY, JSON.stringify(newValue));
        } catch (error) {
        console.log('Error saving notification setting:', error);
        }
    };

    return (
        <View style={styles.container}>
        <TouchableOpacity style={styles.backButtonTop} onPress={() => router.back()}>
            <Ionicons name="chevron-back" size={28} color="#8E63B7" />
        </TouchableOpacity>

        <Image
            source={require('../../assets/images/GridLock-plain.png')}
            style={styles.logo}
            resizeMode="contain"
        />

        <Text style={styles.title}>Settings</Text>

        <View style={styles.settingsCard}>
            <TouchableOpacity
            style={styles.row}
            onPress={() => router.push('/profile')}
            activeOpacity={0.8}
            >
            <View style={styles.rowLeft}>
                <Ionicons name="person-outline" size={20} color="#8E63B7" />
                <Text style={styles.rowText}>Account</Text>
            </View>

            <Ionicons name="chevron-forward" size={22} color="#8E63B7" />
            </TouchableOpacity>

            <View style={styles.divider} />

            <View style={styles.row}>
            <View style={styles.rowLeft}>
                <Ionicons name="notifications-outline" size={20} color="#8E63B7" />
                <Text style={styles.rowText}>Notifications</Text>
            </View>

            <Switch
                value={notificationsEnabled}
                onValueChange={toggleNotifications}
                trackColor={{ false: '#D8CBEF', true: '#8E63B7' }}
                thumbColor="#FFFFFF"
                ios_backgroundColor="#D8CBEF"
                marginTop= "12"
            />
            </View>

            <View style={styles.divider} />
        </View>
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#F7F7F7',
        paddingHorizontal: 8,
        paddingTop: 100,
    },
    backButtonTop: {
        position: 'absolute',
        top: 232,
        left: 14,
        zIndex: 10,
    },
    logo: {
        width: 125,
        height: 125,
        alignSelf: 'center',
        marginTop: 6,
        marginBottom: 2,
    },
    title: {
        textAlign: 'center',
        fontSize: 18,
        color: '#5A1FA6',
        fontWeight: '600',
        marginBottom: 40,
    },
    settingsCard: {
        marginTop: 0,
        borderWidth: 1,
        borderColor: '#D7C8F2',
        borderRadius: 18,
        backgroundColor: '#FFFFFF',
        paddingHorizontal: 16,
        paddingVertical: 8,
    },
    row: {
        minHeight: 54,
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
    },
    rowLeft: {
        flexDirection: 'row',
        alignItems: 'center',
    },
    rowText: {
        marginLeft: 10,
        fontSize: 16,
        color: '#8E63B7',
        fontWeight: '500',
    },
    divider: {
        height: 1.5,
        backgroundColor: '#8E63B7',
        opacity: 0.8,
    },
});