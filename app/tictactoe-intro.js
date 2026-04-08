import GameIntroScreen from '../src/components/GameIntroScreen';

export default function TicTacToeIntro() {
    return (
        <GameIntroScreen
            title="Tic Tac Toe"
            description="Place your X on the board and try to get three in a row before the bot beats you to it."
            imageSource={require('../assets/images/tictactoe.png')}
            backgroundSource={require('../assets/images/tictactoe.png')}
            playRoute="/tictactoe"
        />
    );
}