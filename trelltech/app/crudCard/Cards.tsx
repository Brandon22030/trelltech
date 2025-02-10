import React, { useEffect, useState } from "react";
import {
  ActivityIndicator,
  Alert,
  Button,
  FlatList,
  Text,
  TextInput,
  View,
} from "react-native";
import { useRoute } from "@react-navigation/native";

type Card = {
  listId: string;
  id: string;
  name: string;
};
import AsyncStorage from "@react-native-async-storage/async-storage";

const Cards = () => {
  const [isLoading, setLoading] = useState(true);
  const [data, setData] = useState<Card[]>([]);
  const [newCardName, setNewCardName] = useState("");
  const [editingCardId, setEditingCardId] = useState<string>("");
  const [selectedCard, setSelectedCard] = useState<Card | null>(null);
  const route = useRoute();
  const listId = route.params;
  console.log(listId);

  const [theUserToken, setUserToken] = useState("");

  const userToken = async () => {
    const theUser = await AsyncStorage.getItem("trello_token");

    setUserToken(theUser || "");
  };

  // const listId = route.params.listId;

  const TRELLO_API_KEY = "6a6c6f59721b1ca0e78fbfa3b31a47e9";

  const TRELLO_TOKEN = theUserToken;

  // Get cards
  const getCards = async (listId: any) => {
    try {
    const theUser = await AsyncStorage.getItem("trello_token");
      const response = await fetch(
        `https://api.trello.com/1/lists/${listId}/cards?key=${TRELLO_API_KEY}&token=${theUser}`
      );
      const json = await response.json();
      setData(json);
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  // get by id

  const getCardById = async (id: string) => {
    try {
    const theUser = await AsyncStorage.getItem("trello_token");

      const response = await fetch(
        `https://api.trello.com/1/cards/${id}?key=${TRELLO_API_KEY}&token=${theUser}`
      );
      const card = await response.json();
      setSelectedCard(card);
    } catch (error) {
      console.error(error);
    }
  };

  // Add card
  const addCard = async () => {
    if (!newCardName) return;
    try {
    const theUser = await AsyncStorage.getItem("trello_token");

      const response = await fetch(
        `https://api.trello.com/1/cards?key=${TRELLO_API_KEY}&token=${theUser}`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            name: newCardName,
            idList: "66f1781da7eb39789112479a",
          }),
        }
      );
      const newCard = await response.json();
      setData((prevData) => [...prevData, newCard]);
      setNewCardName("");
    } catch (error) {
      console.error(error);
    }
  };

  // Edit card
  const editCard = async () => {
    if (!editingCardId || !newCardName) return;
    try {
    const theUser = await AsyncStorage.getItem("trello_token");

      const response = await fetch(
        `https://api.trello.com/1/cards/${editingCardId}?key=${TRELLO_API_KEY}&token=${theUser}`,
        {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            name: newCardName,
          }),
        }
      );
      const updatedCard = await response.json();
      setData((prevData) =>
        prevData.map((card) =>
          card.id === updatedCard.id ? updatedCard : card
        )
      );
      setNewCardName("");
      setEditingCardId("");
    } catch (error) {
      console.error(error);
    }
  };

  // Delete card
  const deleteCard = async (id: string) => {
    try {
    const theUser = await AsyncStorage.getItem("trello_token");

      await fetch(
        `https://api.trello.com/1/cards/${id}?key=${TRELLO_API_KEY}&token=${theUser}`,
        {
          method: "DELETE",
        }
      );

      setData((prevData) => prevData.filter((card) => card.id !== id));
    } catch (error) {
      console.error(error);
    }
  };

  useEffect(() => {
    if (listId) {
      getCards(listId);
    }
  }, [listId]);

  return (
    <View>
      <Text>List of the cards</Text>
      {isLoading ? (
        <ActivityIndicator />
      ) : (
        <FlatList
          data={data}
          keyExtractor={({ id }) => id}
          renderItem={({ item }) => (
            <View>
              <Text>
                {item.name}

                <Button title="Delete" onPress={() => deleteCard(item.id)} />
                <Button
                  title="Edit"
                  onPress={() => {
                    setNewCardName(item.name);
                    setEditingCardId(item.id);
                  }}
                />
                <Button title="View" onPress={() => getCardById(item.id)} />
              </Text>
            </View>
          )}
        />
      )}
      <TextInput
        placeholder="New Card Name"
        value={newCardName}
        onChangeText={setNewCardName}
        style={{ borderWidth: 1, padding: 10, marginVertical: 10 }}
      />
      <Button
        title={editingCardId ? "Update Card" : "Add Card"}
        onPress={editingCardId ? editCard : addCard}
      />

      {selectedCard && (
        <View>
          <Text>Card:</Text>
          <Text>Name: {selectedCard.name}</Text>
        </View>
      )}
    </View>
  );
};

export default Cards;
