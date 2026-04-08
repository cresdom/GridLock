import GameIntroScreen from '../src/components/GameIntroScreen';

export default function MemoryMatchIntro() {
    return (
        <GameIntroScreen
        title="Memory Match"
        description="A simple game where you flip cards to find matching pairs and test your memory."
        imageSource={require('../assets/images/memorymatch.png')}
        backgroundSource={require('../assets/images/memorymatch.png')}
        playRoute="/memorymatch"
        />
    );
}