import { useState, useEffect } from 'react';
import { SafeAreaView, TouchableOpacity, Image, StyleSheet, View, Alert } from 'react-native';

const images = [
  { id: 1, src: require('./assets/gameimage1.jpg') },
  { id: 2, src: require('./assets/gameimage2.jpg') },
  { id: 3, src: require('./assets/gameimage3.jpg') },
  { id: 4, src: require('./assets/gameimage4.jpg') }
];

const coverImage = require('./assets/gamecover.jpg');

const shuffleArray = array => {
  return array.sort(() => Math.random() - 0.5);
};

const createDeck = () => {
  let deck = [];
  images.forEach(image => {
    deck.push({ ...image, faceUp: false });
    deck.push({ ...image, faceUp: false });
  });
  return shuffleArray(deck);
};

export default function App() {
  const [deck, setDeck] = useState(createDeck());
  const [lastRevealedCard, setLastRevealedCard] = useState(null);

  useEffect(() => {
    checkGameCompletion();
  });

  const checkGameCompletion = () => {
    if (deck.every(card => card.faceUp)) {
      Alert.alert('Parabéns!', 'Você venceu o jogo!', [
        { text: 'Jogar novamente', onPress: resetGame }
      ]);
    }
  };

  const resetGame = () => {
    setDeck(createDeck());
    setLastRevealedCard(null);
  };

  const handleCardPress = index => {
    let newDeck = [...deck];
    if (newDeck[index].faceUp) return;

    newDeck[index].faceUp = true;
    setDeck(newDeck);

    if (lastRevealedCard === null) {
      setLastRevealedCard(index);
    } else {
      const lastCard = newDeck[lastRevealedCard];
      const currentCard = newDeck[index];

      if (lastCard.id === currentCard.id) {
        setLastRevealedCard(null);
        checkGameCompletion();
      } else {
        setTimeout(() => {
          newDeck[lastRevealedCard].faceUp = false;
          newDeck[index].faceUp = false;
          setDeck(newDeck);
          setLastRevealedCard(null);
        }, 2000);
      }
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.grid}>
        {deck.map((card, index) => (
          <TouchableOpacity key={index} onPress={() => handleCardPress(index)} style={styles.card}>
            <Image source={card.faceUp ? card.src : coverImage} style={styles.cardImage} />
          </TouchableOpacity>
        ))}
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 10,
  },
  grid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'center',
    alignItems: 'center',
    width: '100%',
  },
  card: {
    width: '45%',
    aspectRatio: 1,
    margin: '1.5%',
    borderRadius: 10,
    overflow: 'hidden',
  },
  cardImage: {
    width: '100%',
    height: '100%',
  },
});
