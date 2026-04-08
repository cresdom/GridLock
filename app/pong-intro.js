import GameIntroScreen from '../src/components/GameIntroScreen';

export default function PongIntro() {
    return (
        <GameIntroScreen
            title="Pong"
            description="Move your paddle, keep the ball in play, and score against the bot before it scores on you."
            imageSource={require('../assets/images/pong.png')}
            backgroundSource={require('../assets/images/pong.png')}
            playRoute="/pong"
        />
    );
}