import React, { useEffect, useState } from "react";
import { ActivityIndicator, FlatList, Text, View } from "react-native";
import AsyncStorage from "@react-native-async-storage/async-storage";
type List = {
  id: string;
  name: string;
};

const App = () => {
  const [isLoading, setLoading] = useState(true);
  const [data, setData] = useState<List[]>([]);

  const key = "6a6c6f59721b1ca0e78fbfa3b31a47e9";

  const getLists = async () => {
    try {
    const theUser = await AsyncStorage.getItem("trello_token");

      const response = await fetch(
        `https://api.trello.com/1/boards/66f16abd4b612b558c79f2fc/lists?key=${key}&token=${theUser}`
      );
      const json = await response.json();
      setData(json);
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
    }
  };
  useEffect(() => {
    getLists();
  }, []);

  return (
    <View style={{ flex: 1, padding: 24 }}>
      {isLoading ? (
        <ActivityIndicator />
      ) : (
        <FlatList
          data={data}
          keyExtractor={({ id }) => id}
          renderItem={({ item }) => (
            <Text>
              {item.id}, {item.name}
            </Text>
          )}
        />
      )}
    </View>
  );
};

export default App;
