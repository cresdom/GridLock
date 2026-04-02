import { useEffect, useMemo, useState } from "react";
import { StyleSheet, Text, TouchableOpacity, View } from "react-native";
import { theme } from "../theme/theme";

const symbols = ["🍓", "🌙", "⭐", "🌸", "🍀", "💜"];

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
  const [isChecking, setIsChecking] = useState(false);
  const [moves, setMoves] = useState(0);
  const [seconds, setSeconds] = useState(0);

  const matches = useMemo(
    () => cards.filter((card) => card.matched).length / 2,
    [cards],
  );

  const hasWon = matches === symbols.length;

  useEffect(() => {
    if (hasWon) return;

    const timer = setInterval(() => {
      setSeconds((prev) => prev + 1);
    }, 1000);

    return () => clearInterval(timer);
  }, [hasWon]);

  const handleCardPress = (card) => {
    if (card.flipped || card.matched || selected.length === 2 || isChecking)
      return;

    const updatedCards = cards.map((c) =>
      c.id === card.id ? { ...c, flipped: true } : c,
    );

    const newSelected = [...selected, card.id];

    setCards(updatedCards);
    setSelected(newSelected);

    if (newSelected.length === 2) {
      setIsChecking(true);
      setMoves((prev) => prev + 1);

      const [firstId, secondId] = newSelected;
      const firstCard = updatedCards.find((c) => c.id === firstId);
      const secondCard = updatedCards.find((c) => c.id === secondId);

      if (firstCard.symbol === secondCard.symbol) {
        setTimeout(() => {
          setCards((prev) =>
            prev.map((c) =>
              c.id === firstId || c.id === secondId
                ? { ...c, matched: true }
                : c,
            ),
          );
          setSelected([]);
          setIsChecking(false);
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
          setIsChecking(false);
        }, 900);
      }
    }
  };

  const resetGame = () => {
    setCards(createDeck());
    setSelected([]);
    setIsChecking(false);
    setMoves(0);
    setSeconds(0);
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Memory Match</Text>

      <Text style={styles.status}>
        Matches: {matches}/{symbols.length}
      </Text>
      <Text style={styles.status}>Moves: {moves}</Text>
      <Text style={styles.status}>Time: {seconds}s</Text>

      {hasWon && (
        <View style={styles.winBox}>
          <Text style={styles.winText}>You matched them all!</Text>
          <Text style={styles.summaryText}>Final Moves: {moves}</Text>
          <Text style={styles.summaryText}>Final Time: {seconds}s</Text>
        </View>
      )}

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
  status: {
    fontSize: 18,
    color: theme.colors.text,
    marginBottom: 8,
  },
  winBox: {
    alignItems: "center",
    marginTop: 8,
    marginBottom: 16,
  },
  winText: {
    fontSize: 20,
    fontWeight: "bold",
    color: theme.colors.accent,
    marginBottom: 6,
  },
  summaryText: {
    fontSize: 16,
    color: theme.colors.text,
    marginBottom: 2,
  },
  grid: {
    width: 320,
    flexDirection: "row",
    flexWrap: "wrap",
    justifyContent: "center",
    marginTop: 8,
  },
  card: {
    width: 70,
    height: 70,
    margin: 5,
    borderRadius: 12,
    backgroundColor: theme.colors.card,
    justifyContent: "center",
    alignItems: "center",
  },
  cardText: {
    fontSize: 28,
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
