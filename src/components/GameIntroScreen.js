import { Ionicons } from '@expo/vector-icons';
import { router } from 'expo-router';
import { Image, ImageBackground, StyleSheet, Text, TouchableOpacity, View } from 'react-native';

export default function GameIntroScreen({
    title,
    description,
    imageSource,
    playRoute,
    backgroundSource,
    }) {
    return (
        <ImageBackground
        source={backgroundSource}
        style={styles.background}
        resizeMode="cover"
        >
        <View style={styles.overlay}>
            <TouchableOpacity style={styles.backButton} onPress={() => router.back()}>
            <Ionicons name="chevron-back" size={30} color="#FFFFFF" />
            </TouchableOpacity>

            <View style={styles.content}>
            <Image source={imageSource} style={styles.gameImage} resizeMode="contain" />

            <Text style={styles.description}>{description}</Text>

            <TouchableOpacity
                style={styles.playButton}
                onPress={() => router.push(playRoute)}
                activeOpacity={0.85}
            >
                <Text style={styles.playButtonText}>{title}</Text>
                <Ionicons name="arrow-forward" size={22} color="#FFF6B0" />
            </TouchableOpacity>
            </View>
        </View>
        </ImageBackground>
    );
}

const styles = StyleSheet.create({
    background: {
        flex: 1,
    },
    overlay: {
        flex: 1,
        backgroundColor: 'rgba(120, 80, 180, 0.85)',
        paddingHorizontal: 24,
        paddingTop: 60,
        paddingBottom: 40,
    },
    backButton: {
        position: 'absolute',
        left: 24,
        zIndex: 10,
        marginTop: 180,
    },
    content: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
    },
    gameImage: {
        width: 300,
        height: 300,
        marginBottom: 10,
    },
    description: {
        fontSize: 24,
        lineHeight: 32,
        color: '#FFFFFF',
        textAlign: 'center',
        fontWeight: '500',
        marginBottom: 34,
        paddingHorizontal: 8,
        marginTop: -15,
    },
    playButton: {
        width: '100%',
        maxWidth: 300,
        borderWidth: 3,
        borderColor: '#F7E287',
        borderRadius: 999,
        paddingVertical: 16,
        paddingHorizontal: 28,
        flexDirection: 'row',
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: 'rgba(255,255,255,0.08)',
    },
    playButtonText: {
        color: '#FFFFFF',
        fontSize: 20,
        fontWeight: '800',
        marginRight: 12,
    },
});