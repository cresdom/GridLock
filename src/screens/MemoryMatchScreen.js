import { useState } from "react";
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

export default function MemoryMatchScreen() {
  const [cards, setCards] = useState(createDeck());

  const handleCardPress = (card) => {
    if (card.flipped || card.matched) return;

    const updatedCards = cards.map((c) =>
      c.id === card.id ? { ...c, flipped: true } : c,
    );

    setCards(updatedCards);
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Memory Match</Text>
      <Text style={styles.status}>Tap a card to reveal it</Text>

      <View style={styles.grid}>
        {cards.map((card) => (
          <TouchableOpacity
            key={card.id}
            style={styles.card}
            onPress={() => handleCardPress(card)}
          >
            <Text style={styles.cardText}>
              {card.flipped ? card.symbol : "❔"}
            </Text>
          </TouchableOpacity>
        ))}
      </View>
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
    marginBottom: 20,
  },
  grid: {
    width: 320,
    flexDirection: "row",
    flexWrap: "wrap",
    justifyContent: "center",
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
});
