import { router } from "expo-router";
import { useEffect, useMemo, useState } from "react";
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

function formatTime(seconds) {
  const mins = Math.floor(seconds / 60);
  const secs = seconds % 60;
  return `${String(mins).padStart(2, "0")}:${String(secs).padStart(2, "0")}`;
}

export default function MemoryMatchScreen() {
  const [cards, setCards] = useState(createDeck());
  const [selected, setSelected] = useState([]);
  const [score, setScore] = useState(0);
  const [moves, setMoves] = useState(0);
  const [timer, setTimer] = useState(0);
  const [gameStarted, setGameStarted] = useState(false);
  const [gameFinished, setGameFinished] = useState(false);
  const [locked, setLocked] = useState(false);

  const totalMatches = useMemo(
    () => cards.filter((c) => c.matched).length / 2,
    [cards],
  );

  useEffect(() => {
    let interval;

    if (gameStarted && !gameFinished) {
      interval = setInterval(() => {
        setTimer((prev) => prev + 1);
      }, 1000);
    }

    return () => clearInterval(interval);
  }, [gameStarted, gameFinished]);

  useEffect(() => {
    if (totalMatches === symbols.length) {
      setGameFinished(true);
    }
  }, [totalMatches]);

  const handleCardPress = (card) => {
    if (locked || card.flipped || card.matched || selected.length === 2) return;

    if (!gameStarted) {
      setGameStarted(true);
    }

    const updated = cards.map((c) =>
      c.id === card.id ? { ...c, flipped: true } : c,
    );

    const newSelected = [...selected, card.id];
    setCards(updated);
    setSelected(newSelected);

    if (newSelected.length === 2) {
      setMoves((prev) => prev + 1);
      setLocked(true);

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

          setScore((prev) => prev + 1);
          setSelected([]);
          setLocked(false);
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
          setLocked(false);
        }, 900);
      }
    }
  };

  const resetGame = () => {
    setCards(createDeck());
    setSelected([]);
    setScore(0);
    setMoves(0);
    setTimer(0);
    setGameStarted(false);
    setGameFinished(false);
    setLocked(false);
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Memory Match</Text>

      <View style={styles.infoBox}>
        <Text style={styles.infoText}>Score: {score}</Text>
        <Text style={styles.infoText}>Moves: {moves}</Text>
        <Text style={styles.infoText}>Time: {formatTime(timer)}</Text>
      </View>

      <Text style={styles.status}>
        Matches Found: {totalMatches}/{symbols.length}
      </Text>

      {gameFinished ? (
        <View style={styles.winBox}>
          <Text style={styles.winner}>🎉 You Win! 🎉</Text>
          <Text style={styles.winStat}>Final Time: {formatTime(timer)}</Text>
          <Text style={styles.winStat}>Total Moves: {moves}</Text>
          <Text style={styles.winStat}>
            Matches: {totalMatches}/{symbols.length}
          </Text>

          <TouchableOpacity style={styles.winButton} onPress={resetGame}>
            <Text style={styles.buttonText}>Play Again</Text>
          </TouchableOpacity>
        </View>
      ) : (
        <View style={styles.grid}>
          {cards.map((card) => (
            <TouchableOpacity
              key={card.id}
              style={[styles.card, card.matched && styles.matchedCard]}
              onPress={() => handleCardPress(card)}
            >
              <Text style={styles.cardText}>
                {card.flipped || card.matched ? card.symbol : "❔"}
              </Text>
            </TouchableOpacity>
          ))}
        </View>
      )}

      {!gameFinished && (
        <TouchableOpacity style={styles.button} onPress={resetGame}>
          <Text style={styles.buttonText}>Restart Game</Text>
        </TouchableOpacity>
      )}

      <TouchableOpacity
        style={styles.buttonSecondary}
        onPress={() => router.back()}
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
    marginBottom: 12,
  },
  infoBox: {
    width: 260,
    backgroundColor: theme.colors.card,
    borderRadius: 16,
    paddingVertical: 12,
    paddingHorizontal: 16,
    marginBottom: 12,
    alignItems: "center",
  },
  infoText: {
    fontSize: 18,
    fontWeight: "600",
    color: theme.colors.text,
    marginBottom: 4,
  },
  status: {
    fontSize: 18,
    color: theme.colors.text,
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
  matchedCard: {
    backgroundColor: theme.colors.accent,
  },
  cardText: {
    fontSize: 24,
  },
  winBox: {
    width: 300,
    backgroundColor: theme.colors.card,
    borderRadius: 20,
    padding: 24,
    alignItems: "center",
    marginBottom: 20,
  },
  winner: {
    fontSize: 26,
    fontWeight: "bold",
    color: theme.colors.accent,
    marginBottom: 12,
    textAlign: "center",
  },
  winStat: {
    fontSize: 18,
    color: theme.colors.text,
    marginBottom: 6,
  },
  winButton: {
    marginTop: 16,
    backgroundColor: theme.colors.accent,
    paddingVertical: 14,
    borderRadius: 16,
    width: 180,
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
