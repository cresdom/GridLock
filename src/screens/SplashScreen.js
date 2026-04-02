import { router } from 'expo-router';
import React from 'react';
import { Image, StyleSheet, Text, TouchableOpacity, View } from 'react-native';

export default function SplashScreen() {
    return (
        <View style={styles.container}>
        <Image
            source={require('../../assets/images/GridLock.png')}
            style={styles.joystick}
            resizeMode="contain"
        />

        <TouchableOpacity
            style={styles.button}
            onPress={() => router.replace('/home')}
        >
            <Text style={styles.buttonText}>Tap to begin!</Text>
            <Text style={styles.arrow}>→</Text>
        </TouchableOpacity>
        </View>
    );
    }

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#8B63E6',
        justifyContent: 'space-between',
        alignItems: 'center',
        paddingTop: 120,
        paddingBottom: 70,
        paddingHorizontal: 24,
    },
    joystick: {
        width: 310,
        height: 310,
        marginTop: 80,
    },
    button: {
        width: '88%',
        minHeight: 58,
        borderRadius: 30,
        borderWidth: 3,
        borderColor: '#F6E7A1',
        backgroundColor: 'rgba(255,255,255,0.08)',
        flexDirection: 'row',
        justifyContent: 'center',
        alignItems: 'center',
        paddingHorizontal: 24,
    },
    buttonText: {
        color: '#FFF4D6',
        fontSize: 18,
        fontWeight: '700',
        marginRight: 12,
    },
    arrow: {
        color: '#FFF4D6',
        fontSize: 22,
        fontWeight: '700',
    },
});