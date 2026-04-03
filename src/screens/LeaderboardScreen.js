import { FontAwesome, Ionicons, MaterialIcons } from '@expo/vector-icons';
import { router } from 'expo-router';
import React from 'react';
import { Image, ScrollView, StyleSheet, Text, TouchableOpacity, View } from 'react-native';

const topThree = [
    {
        id: '2',
        name: 'Mason',
        score: 5432,
        username: '@masonthealpaca',
        image: require('../../assets/images/Mason.png'),
        ringColor: '#19B5FF',
    },
    {
        id: '1',
        name: 'Ben',
        score: 6767,
        username: '@ben_is_jammin',
        image: require('../../assets/images/userpic.png'),
        ringColor: '#F6B300',
    },
    {
        id: '3',
        name: 'Emma',
        score: 1674,
        username: '@emmmaa',
        image: require('../../assets/images/Emma.png'),
        ringColor: '#20E36C',
    },
];

const otherPlayers = [
    {
        id: '4',
        name: 'Crescia',
        username: '@pompompurin',
        score: 1124,
        image: require('../../assets/images/Crescia.png'),
        trend: 'up',
    },
    {
        id: '5',
        name: 'Helanie',
        username: '@hdom',
        score: 875,
        image: require('../../assets/images/Helanie.png'),
        trend: 'down',
    },
    {
        id: '6',
        name: 'Paolo',
        username: '@paopaolo',
        score: 774,
        image: require('../../assets/images/Paolo.png'),
        trend: 'up',
    },
    {
        id: '7',
        name: 'Huddwin',
        username: '@allidoiswin',
        score: 723,
        image: require('../../assets/images/Huddwin.png'),
        trend: 'up',
    },
];

function TrendIcon({ trend }) {
    if (trend === 'down') {
        return <Ionicons name="caret-down" size={12} color="#D94A6A" />;
    }

    return <Ionicons name="caret-up" size={12} color="#33C46C" />;
}

export default function LeaderboardScreen() {
    return (
        <View style={styles.screen}>
        <ScrollView contentContainerStyle={styles.container}>
            <TouchableOpacity style={styles.backButton} onPress={() => router.back()}>
            <Ionicons name="chevron-back" size={28} color="#8E63B7" />
            </TouchableOpacity>

            <Ionicons
            name="podium-outline"
            size={88}
            color="#8E63F7"
            style={styles.topIcon}
            />

            <View style={styles.titlePill}>
            <Text style={styles.titleText}>Leaderboard</Text>
            </View>

            <View style={styles.topThreeRow}>
            <View style={styles.sideWinner}>
                <View style={[styles.avatarRing, { borderColor: topThree[0].ringColor }]}>
                <Image source={topThree[0].image} style={styles.sideAvatar} />
                </View>
                <View style={[styles.placeBadge, { backgroundColor: topThree[0].ringColor }]}>
                <Text style={styles.placeBadgeText}>2</Text>
                </View>
                <Text style={styles.sideName}>{topThree[0].name}</Text>
                <Text style={styles.sideScore}>{topThree[0].score}</Text>
                <Text style={styles.sideUsername}>{topThree[0].username}</Text>
            </View>

            <View style={styles.centerWinnerCard}>
                <Ionicons name="star" size={26} color="#F6B300" style={styles.crownIcon} />

                <View
                style={[
                    styles.avatarRing,
                    styles.centerRing,
                    { borderColor: topThree[1].ringColor },
                ]}
                >
                <Image source={topThree[1].image} style={styles.centerAvatar} />
                </View>

                <View
                style={[
                    styles.placeBadge,
                    styles.centerBadge,
                    { backgroundColor: topThree[1].ringColor },
                ]}
                >
                <Text style={styles.placeBadgeText}>1</Text>
                </View>

                <Text style={styles.centerName}>{topThree[1].name}</Text>
                <Text style={styles.centerScore}>{topThree[1].score}</Text>
                <Text style={styles.centerUsername}>{topThree[1].username}</Text>
            </View>

            <View style={styles.sideWinner}>
                <View style={[styles.avatarRing, { borderColor: topThree[2].ringColor }]}>
                <Image source={topThree[2].image} style={styles.sideAvatar} />
                </View>
                <View style={[styles.placeBadge, { backgroundColor: topThree[2].ringColor }]}>
                <Text style={styles.placeBadgeText}>3</Text>
                </View>
                <Text style={styles.sideName}>{topThree[2].name}</Text>
                <Text style={styles.sideScore}>{topThree[2].score}</Text>
                <Text style={styles.sideUsername}>{topThree[2].username}</Text>
            </View>
            </View>

            <View style={styles.listCard}>
            {otherPlayers.map((player, index) => (
                <View key={player.id}>
                <View style={styles.playerRow}>
                    <View style={styles.playerLeft}>
                    <Image source={player.image} style={styles.playerAvatar} />
                    <View>
                        <Text style={styles.playerName}>{player.name}</Text>
                        <Text style={styles.playerUsername}>{player.username}</Text>
                    </View>
                    </View>

                    <View style={styles.playerRight}>
                    <Text style={styles.playerScore}>{player.score}</Text>
                    <TrendIcon trend={player.trend} />
                    </View>
                </View>

                {index !== otherPlayers.length - 1 && <View style={styles.divider} />}
                </View>
            ))}
            </View>
        </ScrollView>

        <View style={styles.bottomNav}>
            <TouchableOpacity style={styles.navItem} onPress={() => router.push('/home')}>
            <FontAwesome name="home" size={30} color="#7A43D1" />
            </TouchableOpacity>

            <View style={styles.navDivider} />

            <TouchableOpacity style={styles.navItem} onPress={() => router.push('/leaderboard')}>
                <MaterialIcons name="leaderboard" size={30} color="#7A43D1" />
            </TouchableOpacity>

            <View style={styles.navDivider} />

            <TouchableOpacity style={styles.navItem} onPress={() => router.push('/achievements')}>
                <FontAwesome name="trophy" size={30} color="#7A43D1" />
            </TouchableOpacity>

            <View style={styles.navDivider} />

            <TouchableOpacity style={styles.navItem} onPress={() => router.push('/profile')}>
            <Ionicons name="person" size={30} color="#7A43D1" />
            </TouchableOpacity>
        </View>
        </View>
    );
}

    const styles = StyleSheet.create({
    screen: {
        flex: 1,
        backgroundColor: '#F7F7F7',
    },
    container: {
        backgroundColor: '#F7F7F7',
        paddingTop: 28,
        paddingBottom: 140,
    },
    backButton: {
        position: 'absolute',
        top: 170,
        left: 12,
        zIndex: 10,
    },
    topIcon: {
        alignSelf: 'center',
        marginTop: 40,
        marginBottom: 8,
    },
    titlePill: {
        alignSelf: 'center',
        backgroundColor: '#CDBAF6',
        borderRadius: 10,
        minWidth: 246,
        paddingVertical: 10,
        alignItems: 'center',
        marginBottom: 18,
    },
    titleText: {
        color: '#FFFFFF',
        fontSize: 16,
        fontWeight: '700',
    },
    topThreeRow: {
        flexDirection: 'row',
        justifyContent: 'center',
        alignItems: 'flex-end',
        marginBottom: 12,
        paddingHorizontal: 8,
    },
    sideWinner: {
        width: 104,
        alignItems: 'center',
        paddingBottom: 12,
    },
    centerWinnerCard: {
        width: 124,
        backgroundColor: '#D7C6F6',
        borderTopLeftRadius: 26,
        borderTopRightRadius: 26,
        borderBottomLeftRadius: 8,
        borderBottomRightRadius: 8,
        alignItems: 'center',
        paddingTop: 14,
        paddingBottom: 14,
        marginHorizontal: 2,
    },
    crownIcon: {
        marginBottom: 2,
    },
    avatarRing: {
        borderWidth: 3,
        borderRadius: 999,
        padding: 2,
        backgroundColor: '#FFFFFF',
    },
    centerRing: {
        marginTop: 2,
    },
    sideAvatar: {
        width: 58,
        height: 58,
        borderRadius: 29,
    },
    centerAvatar: {
        width: 62,
        height: 62,
        borderRadius: 31,
    },
    placeBadge: {
        marginTop: -8,
        width: 18,
        height: 18,
        borderRadius: 9,
        alignItems: 'center',
        justifyContent: 'center',
    },
    centerBadge: {
        marginBottom: 6,
    },
    placeBadgeText: {
        color: '#FFFFFF',
        fontSize: 10,
        fontWeight: '700',
    },
    sideName: {
        marginTop: 6,
        color: '#E94A67',
        fontSize: 14,
        fontWeight: '500',
    },
    sideScore: {
        color: '#13A5E5',
        fontSize: 28,
        fontWeight: '700',
        lineHeight: 30,
    },
    sideUsername: {
        color: '#9E8CBF',
        fontSize: 10,
    },
    centerName: {
        marginTop: 2,
        color: '#E94A67',
        fontSize: 14,
        fontWeight: '500',
    },
    centerScore: {
        color: '#6C45D8',
        fontSize: 30,
        fontWeight: '700',
        lineHeight: 32,
    },
    centerUsername: {
        color: '#9E8CBF',
        fontSize: 10,
    },
    listCard: {
        marginTop: 8,
        marginHorizontal: 4,
        backgroundColor: '#D7C6F6',
        borderTopLeftRadius: 28,
        borderTopRightRadius: 28,
        paddingHorizontal: 22,
        paddingVertical: 18,
    },
    playerRow: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        minHeight: 56,
    },
    playerLeft: {
        flexDirection: 'row',
        alignItems: 'center',
    },
    playerAvatar: {
        width: 42,
        height: 42,
        borderRadius: 21,
        marginRight: 12,
    },
    playerName: {
        color: '#D94A6A',
        fontSize: 16,
        fontWeight: '500',
    },
    playerUsername: {
        color: '#9E8CBF',
        fontSize: 10,
        marginTop: 2,
    },
    playerRight: {
        flexDirection: 'row',
        alignItems: 'center',
    },
    playerScore: {
        color: '#D94A6A',
        fontSize: 18,
        fontWeight: '700',
        marginRight: 2,
    },
    divider: {
        height: 1,
        backgroundColor: '#A98ED7',
        marginVertical: 10,
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
        paddingTop: 10,
        paddingBottom: 28,
    },
    navItem: {
        flex: 1,
        alignItems: 'center',
        justifyContent: 'center',
    },
    navDivider: {
        width: 1,
        height: 34,
        backgroundColor: '#CDBAF6',
    },
});