import { useMemo, useState } from "react";
import { StyleSheet, Text, TouchableOpacity, View } from "react-native";
import { theme } from "../theme/theme";

const symbols = ["🍓", "⭐", "🦋", "🌸", "🍀", "💜", "🐝", "❄️", "🍒", "🌈"];

function shuffle(array) {
  return [...array].sort(() => Math.random() - 0.5);
}

function createDeck() {
  return shuffle(
    [...symbols, ...symbols].map((symbol, index) => ({
      id: index,
      symbol,
      flipped: false,
      matched: false,
    })),
  );
}

export default function MemoryMatchScreen({ navigation }) {
  const [cards, setCards] = useState(createDeck());
  const [selected, setSelected] = useState([]);
  const [currentPlayer, setCurrentPlayer] = useState(1);
  const [player1Score, setPlayer1Score] = useState(0);
  const [player2Score, setPlayer2Score] = useState(0);

  const totalMatches = useMemo(
    () => cards.filter((c) => c.matched).length / 2,
    [cards],
  );

  const handleCardPress = (card) => {
    if (card.flipped || card.matched || selected.length === 2) return;

    const updated = cards.map((c) =>
      c.id === card.id ? { ...c, flipped: true } : c,
    );

    const newSelected = [...selected, card.id];
    setCards(updated);
    setSelected(newSelected);

    if (newSelected.length === 2) {
      const [firstId, secondId] = newSelected;
      const firstCard = updated.find((c) => c.id === firstId);
      const secondCard = updated.find((c) => c.id === secondId);

      if (firstCard.symbol === secondCard.symbol) {
        setTimeout(() => {
          setCards((prev) =>
            prev.map((c) =>
              c.id === firstId || c.id === secondId
                ? { ...c, matched: true }
                : c,
            ),
          );

          if (currentPlayer === 1) {
            setPlayer1Score((prev) => prev + 1);
          } else {
            setPlayer2Score((prev) => prev + 1);
          }

          setSelected([]);
        }, 500);
      } else {
        setTimeout(() => {
          setCards((prev) =>
            prev.map((c) =>
              c.id === firstId || c.id === secondId
                ? { ...c, flipped: false }
                : c,
            ),
          );

          setSelected([]);
          setCurrentPlayer((prev) => (prev === 1 ? 2 : 1));
        }, 900);
      }
    }
  };

  const resetGame = () => {
    setCards(createDeck());
    setSelected([]);
    setCurrentPlayer(1);
    setPlayer1Score(0);
    setPlayer2Score(0);
  };

  const winnerText = useMemo(() => {
    if (totalMatches !== symbols.length) return null;

    if (player1Score > player2Score) return "Player 1 Wins!";
    if (player2Score > player1Score) return "Player 2 Wins!";
    return "It's a Tie!";
  }, [totalMatches, player1Score, player2Score]);

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Memory Match</Text>

      <Text style={styles.turnText}>Current Turn: Player {currentPlayer}</Text>

      <View style={styles.scoreBoard}>
        <Text style={styles.scoreText}>Player 1: {player1Score}</Text>
        <Text style={styles.scoreText}>Player 2: {player2Score}</Text>
      </View>

      <Text style={styles.status}>
        Matches Found: {totalMatches}/{symbols.length}
      </Text>

      {winnerText && <Text style={styles.winner}>{winnerText}</Text>}

      <View style={styles.grid}>
        {cards.map((card) => (
          <TouchableOpacity
            key={card.id}
            style={styles.card}
            onPress={() => handleCardPress(card)}
          >
            <Text style={styles.cardText}>
              {card.flipped || card.matched ? card.symbol : "❔"}
            </Text>
          </TouchableOpacity>
        ))}
      </View>

      <TouchableOpacity style={styles.button} onPress={resetGame}>
        <Text style={styles.buttonText}>Restart Game</Text>
      </TouchableOpacity>

      <TouchableOpacity
        style={styles.buttonSecondary}
        onPress={() => navigation.goBack()}
      >
        <Text style={styles.buttonText}>Back</Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: theme.colors.background,
    padding: 18,
    alignItems: "center",
    justifyContent: "center",
  },
  title: {
    fontSize: 30,
    fontWeight: "bold",
    color: theme.colors.text,
    marginBottom: 10,
  },
  turnText: {
    fontSize: 20,
    fontWeight: "700",
    color: theme.colors.text,
    marginBottom: 10,
  },
  scoreBoard: {
    width: 260,
    marginBottom: 12,
    alignItems: "center",
  },
  scoreText: {
    fontSize: 18,
    color: theme.colors.text,
    marginBottom: 4,
  },
  status: {
    fontSize: 18,
    color: theme.colors.text,
    marginBottom: 16,
  },
  winner: {
    fontSize: 22,
    fontWeight: "bold",
    color: theme.colors.accent,
    marginBottom: 16,
  },
  grid: {
    width: 300,
    flexDirection: "row",
    flexWrap: "wrap",
    justifyContent: "center",
  },
  card: {
    width: 62,
    height: 62,
    margin: 5,
    borderRadius: 12,
    backgroundColor: theme.colors.card,
    justifyContent: "center",
    alignItems: "center",
  },
  cardText: {
    fontSize: 24,
  },
  button: {
    marginTop: 20,
    backgroundColor: theme.colors.accent,
    padding: 14,
    borderRadius: 16,
    width: 220,
  },
  buttonSecondary: {
    marginTop: 12,
    backgroundColor: theme.colors.button,
    padding: 14,
    borderRadius: 16,
    width: 220,
  },
  buttonText: {
    textAlign: "center",
    fontWeight: "700",
    color: theme.colors.darkText,
  },
});
