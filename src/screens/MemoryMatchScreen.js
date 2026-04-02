import { useState } from "react";
import { StyleSheet, Text, View } from "react-native";
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
  const [cards] = useState(createDeck());

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Memory Match</Text>
      <Text style={styles.status}>Deck created successfully</Text>
      <Text style={styles.status}>Total cards: {cards.length}</Text>
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
    marginBottom: 6,
  },
});
