import { router } from 'expo-router';
import React from 'react';
import { Image, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

export default function SplashScreen() {
    return (
        <SafeAreaView style={styles.container} edges={['top', 'bottom']}>
        <View style={styles.logoArea}>
            <Image
            source={require('../../assets/images/GridLock-plain.png')}
            style={styles.bgJoystick}
            resizeMode="contain"
            />

            <Image
            source={require('../../assets/images/GridLock.png')}
            style={styles.joystick}
            resizeMode="contain"
            />
        </View>

        <TouchableOpacity
            style={styles.button}
            onPress={() => router.replace('/home')}
            activeOpacity={0.85}
        >
            <Text style={styles.buttonText}>Tap to begin!</Text>
            <Text style={styles.arrow}>→</Text>
        </TouchableOpacity>
        </SafeAreaView>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#8662E8',
        alignItems: 'center',
        justifyContent: 'center',
        paddingHorizontal: 24,
    },

    logoArea: {
        width: 320,
        height: 320,
        alignItems: 'center',
        justifyContent: 'center',
        marginBottom: 190,
    },

    bgJoystick: {
        position: 'absolute',
        width: 900,
        height: 800,
        opacity: 0.08,
        top: -190,
    },

    joystick: {
        width: 450,
        height: 450,
    },

    button: {
        position: 'absolute',
        bottom: 280,
        width: '86%',
        height: 64,
        borderRadius: 32,
        borderWidth: 3,
        borderColor: '#F3E08A',
        backgroundColor: 'rgba(255,255,255,0.05)',
        flexDirection: 'row',
        justifyContent: 'center',
        alignItems: 'center',
    },

    buttonText: {
        color: '#FFF4D6',
        fontSize: 18,
        fontWeight: '800',
        marginRight: 14,
    },

    arrow: {
        color: '#FFF4D6',
        fontSize: 24,
        fontWeight: '800',
        lineHeight: 24,
    },
});