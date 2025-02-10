import React, { useEffect, useState } from "react";
import { useNavigation } from "@react-navigation/native";
import {
  ActivityIndicator,
  Button,
  FlatList,
  Text,
  TextInput,
  View,
} from "react-native";
import { StyleSheet } from "react-native";
import AsyncStorage from "@react-native-async-storage/async-storage";

type List = {
  id: string;
  name: string;
};
type Card = {
    listId:string
    id: string;
    name: string;
};




const styles = StyleSheet.create({
  listStyle: {
    borderColor: "blue",
    borderRadius: 8,
    width: 200,
    height: 500,
  },
});
const ListCards = () => {

    const [theUserToken, setUserToken] = useState("");

    const userToken = async () => {
      const theUser = await AsyncStorage.getItem("trello_token");

      setUserToken(theUser || "");
    };

    const key = "6a6c6f59721b1ca0e78fbfa3b31a47e9";
    const token = theUserToken;
  const navigation = useNavigation();
  //Get all lists
  const [isLoading, setLoading] = useState(true);
  const [data, setData] = useState<List[]>([]);
  const [datas, setDatas] = useState<Card[]>([]);

//   const handleNavigateToCards = (listId:string) => {
//     navigation.navigate('Cards', { listId });
//   };
  const getLists = async () => {
    try {
      const response = await fetch(
        `https://api.trello.com/1/boards/66f16abd4b612b558c79f2fc/lists?key=${key}&token=${token}`
      );
      const json = await response.json();
      setData(json);
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
    }
  };
  const getCards = async (listId:any) => {
    try {
        const response = await fetch(
          `https://api.trello.com/1/lists/${listId}/cards?key=${key}&token=${token}`
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
    <>
      <View style={styles.listStyle}>
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
    </>
  );
};
export default ListCards;