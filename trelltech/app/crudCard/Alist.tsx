import { View, Text, FlatList, Button } from "react-native";

import { useState, useEffect } from "react";

import AsyncStorage from "@react-native-async-storage/async-storage";

const TheCard = ({route} : {route: any}) => {

  const listId = route.params.ListId;

    const [theUserToken, setUserToken] = useState("");

  const userToken = async () => {
    const theUser = await AsyncStorage.getItem("trello_token");

    setUserToken(theUser || "");
  };

  const TRELLO_API_KEY = "6a6c6f59721b1ca0e78fbfa3b31a47e9";

  const TRELLO_TOKEN = theUserToken;

  const [data, setData] = useState(null);
  console.log(data)
  
  // Get cards
  const getCards = async () => {
    try {
    const theUser = await AsyncStorage.getItem("trello_token");
      
      const response = await fetch(
        `https://api.trello.com/1/lists/${listId}/cards?key=${TRELLO_API_KEY}&token=${theUser}`
      );
      const json = await response.json();
      setData(json);
    } catch (error) {
      console.error(error);
    }
  };

  useEffect(() => {
    getCards();
  }, []);

    return (
      <>
        <FlatList
          data={data}
          keyExtractor={({ id }) => id}
          renderItem={({ item }) => (
            <View>
              <Text>{item.name}</Text>
            </View>
          )}
        />
      </>
    );
}

export default TheCard;