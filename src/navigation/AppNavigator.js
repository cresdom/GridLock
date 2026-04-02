import { createNativeStackNavigator } from '@react-navigation/native-stack';
import FroggerScreen from '../screens/FroggerScreen';
import HomeScreen from '../screens/HomeScreen';
import LeaderboardScreen from '../screens/LeaderboardScreen';
import MemoryMatchScreen from '../screens/MemoryMatchScreen';
import PongScreen from '../screens/PongScreen';
import ProfileScreen from '../screens/ProfileScreen';
import SplashScreen from '../screens/SplashScreen';
import TicTacToeScreen from '../screens/TicTacToeScreen';

const Stack = createNativeStackNavigator();

export default function AppNavigator() {
    return (
        <Stack.Navigator
        screenOptions={{
            headerShown: false,
        }}
        >
        <Stack.Screen name="Splash" component={SplashScreen} />
        <Stack.Screen name="Home" component={HomeScreen} />
        <Stack.Screen name="Leaderboard" component={LeaderboardScreen} />
        <Stack.Screen name="Profile" component={ProfileScreen} />
        <Stack.Screen name="TicTacToe" component={TicTacToeScreen} />
        <Stack.Screen name="MemoryMatch" component={MemoryMatchScreen} />
        <Stack.Screen name="Pong" component={PongScreen} />
        <Stack.Screen name="Frogger" component={FroggerScreen} />
        </Stack.Navigator>
    );
}