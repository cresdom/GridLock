import FontAwesome from '@expo/vector-icons/FontAwesome';
import Ionicons from '@expo/vector-icons/Ionicons';
import MaterialIcons from '@expo/vector-icons/MaterialIcons';
import { router } from 'expo-router';
import React from 'react';
import { FlatList, Image, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

const games = [
    {
        id: '1',
        title: 'Memory Match',
        route: '/memorymatch',
        image: require('../../assets/images/memorymatch.png'),
    },
    {
        id: '2',
        title: 'Tic Tac Toe',
        route: '/tictactoe',
        image: require('../../assets/images/tictactoe.png'),
    },
    {
        id: '3',
        title: 'Pong',
        route: '/pong',
        image: require('../../assets/images/pong.png'),
    },
    {
        id: '4',
        title: 'Frogger',
        route: '/frogger',
        image: require('../../assets/images/frogger.png'),
    },
];

export default function HomeScreen() {
    const renderGameCard = ({ item }) => (
        <TouchableOpacity
        style={styles.cardWrapper}
        onPress={() => router.push(item.route)}
        activeOpacity={0.9}
        >
        <View style={styles.gameCard}>
            <Image source={item.image} style={styles.gameImage} resizeMode="contain"/>
        </View>

        <TouchableOpacity
            style={styles.playButton}
            onPress={() => router.push(item.route)}
        >
            <Text style={styles.playButtonText}>{item.title}</Text>
            <Text style={styles.playArrow}>→</Text>
        </TouchableOpacity>
        </TouchableOpacity>
    );

    return (
        <SafeAreaView style={styles.container}>
        <View style={styles.topSection}>
            <View style={styles.profileRow}>
            <View style={styles.profileLeft}>
                <TouchableOpacity onPress={() => router.push('/profile')}>
                    <Image
                    source={require('../../assets/images/userpic.png')}
                    style={styles.avatar}
                    />
                </TouchableOpacity>

            <View>
                <Text style={styles.logoText}>GridLock</Text>
                <Text style={styles.helloText}>Hey, Ben!</Text>
            </View>
        </View>

            <TouchableOpacity onPress={() => router.push('/profile')}>
                <Ionicons name="settings-outline" size={26} color="#7A43D1"/>
            </TouchableOpacity>
            </View>

            <Text style={styles.heading}>Games</Text>

            <View style={styles.tabsRow}>
            <Text style={[styles.tabText, styles.activeTab]}>Library</Text>
            <Text style={styles.tabText}>Recently Played</Text>
            </View>

            <FlatList
            data={games}
            renderItem={renderGameCard}
            keyExtractor={(item) => item.id}
            horizontal
            showsHorizontalScrollIndicator={false}
            contentContainerStyle={styles.carouselContent}
            snapToAlignment="start"
            decelerationRate="fast"
            />
        </View>

        <View style={styles.bottomNav}>
        <TouchableOpacity style={styles.navItem} onPress={() => router.push('/home')}>
            <FontAwesome name="home" size={30} color="#7A43D1" />
        </TouchableOpacity>

        <View style={styles.navDivider} />

        <TouchableOpacity style={styles.navItem} onPress={() => router.push('/leaderboard')}>
            <MaterialIcons name="leaderboard" size={30} color="#7A43D1" />
        </TouchableOpacity>

        <View style={styles.navDivider} />

        <TouchableOpacity style={styles.navItem} onPress={() => router.push('/leaderboard')}>
            <FontAwesome name="trophy" size={30} color="#7A43D1" />
        </TouchableOpacity>

        <View style={styles.navDivider} />

        <TouchableOpacity style={styles.navItem} onPress={() => router.push('/profile')}>
            <Ionicons name="person" size={30} color="#7A43D1" />
        </TouchableOpacity>
        </View>
        </SafeAreaView>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#EAE3FF',
        justifyContent: 'space-between',
    },
    topSection: {
        paddingHorizontal: 24,
        paddingTop: 34,
    },
    profileRow: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
    },
    profileLeft: {
        flexDirection: 'row',
        alignItems: 'center',
    },
    avatar: {
        width: 78,
        height: 78,
        borderRadius: 40,
        marginRight: 16,
    },
    logoText: {
        fontSize: 20,
        color: '#B39CFF',
        fontWeight: '400',
    },
    helloText: {
        fontSize: 24,
        color: '#6E43B5',
        fontWeight: '700',
        marginTop: 2,
    },
    icon: {
        fontSize: 28,
        color: '#7A43D1',
    },
    heading: {
        fontSize: 26,
        color: '#7A5AAA',
        fontWeight: '800',
        marginTop: 28,
        marginBottom: 14,
    },
    tabsRow: {
        flexDirection: 'row',
        marginBottom: 22,
    },
    tabText: {
        fontSize: 14,
        color: '#B1A7C9',
        marginRight: 26,
    },
    activeTab: {
        color: '#7A5AAA',
        borderBottomWidth: 2,
        borderBottomColor: '#7A6BFF',
        paddingBottom: 4,
    },
    carouselContent: {
        paddingRight: 24,
    },
    cardWrapper: {
        width: 280,
        marginRight: 18,
        alignItems: 'center',
    },
    gameCard: {
        width: '100%',
        height: 310,
        backgroundColor: '#CDBAF6',
        borderRadius: 26,
        justifyContent: 'center',
        alignItems: 'center',
        shadowColor: '#8C78C9',
        shadowOpacity: 0.2,
        shadowRadius: 14,
        shadowOffset: { width: 0, height: 6 },
        elevation: 6,
    },
    gameImage: {
        width: '88%',
        height: '88%',
    },
    playButton: {
        alignSelf: 'center',
        marginTop: 16,
        backgroundColor: '#E9D7FF',
        borderRadius: 28,
        minWidth: 185,
        paddingVertical: 14,
        paddingHorizontal: 26,
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
    },
    playButtonText: {
        color: '#7D68A8',
        fontSize: 16,
        fontWeight: '500',
        marginRight: 14,
    },
    playArrow: {
        color: '#7D68A8',
        fontSize: 18,
        fontWeight: '700',
    },
    bottomNav: {
        position: 'absolute',
        left: 0,
        right: 0,
        bottom: -18,
        height: 110,
        backgroundColor: '#F7F3FF',
        borderTopWidth: 1,
        borderTopColor: '#DDD2F5',
        flexDirection: 'row',
        justifyContent: 'space-evenly',
        alignItems: 'center',
        paddingBottom: 28,
        paddingTop: 10,
    },

    navItem: {
        flex: 1,
        alignItems: 'center',
        justifyContent: 'center',
    },

    navDivider: {
        width: 1,
        height: 28,
        backgroundColor: '#CDBAF6',
    },
});