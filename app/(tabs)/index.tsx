import { Button, Image, StyleSheet, View, Text, Touchable, TouchableOpacity } from 'react-native';

import { HelloWave } from '@/components/HelloWave';
import ParallaxScrollView from '@/components/ParallaxScrollView';
import { ThemedText } from '@/components/ThemedText';
import { ThemedView } from '@/components/ThemedView';
import React, { useState, useEffect } from 'react';
import * as ImagePicker from 'expo-image-picker';
import { FlatList, GestureHandlerRootView, TextInput } from 'react-native-gesture-handler';

type Card = {
  id: number;
  title: string;
  description: string;
};

export default function HomeScreen() {
  const [cards, setCards] = useState<Card[]>([]);
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [editingCard, setEditingCard] = useState<Card | null>(null);
  const [image, setImage] = useState<string | null>(null);

  useEffect(() => {
    (async () => {
      const { status } = await ImagePicker.requestCameraPermissionsAsync();
      if (status !== 'granted') {
        alert('Sorry, we need camera permissions to make this work!');
      }
    })();
  }, []);

  const addOrUpdateCard = () => {
    if (editingCard) {
      setCards(previousCards => 
        previousCards.map(card =>
          card.id === editingCard.id ? {...card, title, description} : card  
        )  
      );
      setEditingCard(null);
    } else {
      const newCard: Card = {id: Date.now(), title, description};
      setCards(previousCards => [...previousCards, newCard]);
    }

    setTitle('');
    setDescription('');
  };

  const editCard = (card: Card) => {
    setEditingCard(card);
    setTitle(card.title);
    setDescription(card.description);
  };

  const deleteCard = (id: number) => {
    setCards(previousCards => previousCards.filter(card => card.id !== id));
  };

  const pickImage = async () => {
    let result = await ImagePicker.launchCameraAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: true,
      aspect: [4, 3],
      quality: 1,
    });

    console.log(result);

    if (!result.canceled) {
      setImage(result.assets[0].uri);
    }
  };

  return (
    <GestureHandlerRootView style={{ flex: 1 }}>
    <ParallaxScrollView
      headerBackgroundColor={{ light: '#a4c991', dark: '#a4c991' }}
      headerImage={
        <View style={styles.headerContainer}>
          <Image
            source={require('@/assets/images/logo.webp')}
            style={styles.logo}
          />
        </View>
      }
    >
      <ThemedView style={styles.titleContainer}>
        <ThemedText type="title">Salutaree!</ThemedText>
        <HelloWave />
      </ThemedView>
      <ThemedView style={styles.stepContainer}>
        <TextInput
          placeholder="Title"
          value={title}
          onChangeText={setTitle}
          style={styles.input}
        />
        <TextInput
          placeholder="Description"
          value={description}
          onChangeText={setDescription}
          style={styles.input}
        />
        <Button
          title={editingCard ? "Update Card" : "Add Card"}
          onPress={addOrUpdateCard}
        />
        <FlatList
          data={cards}
          keyExtractor={item => item.id.toString()}
          renderItem={({ item }) => (
            <View style={styles.card}>
              <Text style={styles.cardTitle}>{item.title}</Text>
              <Text>{item.description}</Text>
              <View style={styles.cardActions}>
                <Button title="Edit" onPress={() => editCard(item)} />
                <Button title="Delete" onPress={() => deleteCard(item.id)} />
              </View>
            </View>
          )}
        />      
      </ThemedView>
      {image && (
          <Image source={{ uri: image }} style={styles.image} />
        )}
    </ParallaxScrollView>
      <View style={styles.buttonContainer}>
          <Button title="Take a Picture" onPress={pickImage} />
        </View>
    </GestureHandlerRootView>
  );
}

const styles = StyleSheet.create({
  headerContainer: {
    height: 150,
    width: '100%',
    justifyContent: 'center',
    alignItems: 'center',
    overflow: 'hidden',
  },
  titleContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  stepContainer: {
    gap: 8,
    marginBottom: 8,
  },
  buttonContainer: {
    position: 'absolute',
    bottom: 20,
    left: 0,
    right: 0,
    alignItems: 'center',
  },
  logo: {
    width: '100%',
    height: '100%',
    resizeMode: 'contain'
  },
  input: {
    height: 40,
    borderColor: '#ccc',
    borderWidth: 1,
    marginBottom: 8,
    paddingHorizontal: 8,
  },
  card: {
    padding: 16,
    backgroundColor: '#f9f9f9',
    borderBottomWidth: 1,
    borderBottomColor: '#ccc',
    marginBottom: 8,
  },
  cardTitle: {
    fontSize: 18,
    fontWeight: 'bold',
  },
  cardActions: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: 8,
  },
  image: {
    width: '90%',
    height: 300,
    alignSelf: 'center',
    marginTop: 16,
  },
});
