import GameIntroScreen from '../src/components/GameIntroScreen';

export default function FroggerIntro() {
    return (
        <GameIntroScreen
            title="Frogger"
            description="Guide yourself across the road, avoid the moving objects, and make it safely to the other side!"
            imageSource={require('../assets/images/frogger.png')}
            backgroundSource={require('../assets/images/frogger.png')}
            playRoute="/frogger"
        />
    );
}