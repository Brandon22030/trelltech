// import { useEffect, useState } from "react"
import { getBoards } from "../api/trello";
import { FlatList } from "react-native-gesture-handler";
import { View, Text } from "react-native";
import * as React from "react";
import AsyncStorage from "@react-native-async-storage/async-storage";

const BoardScreen = ({ route }: { route: any }) => {
  const boardId = route.params.BoardId;

  const [isLoading, setLoading] = React.useState(true);
  const [data, setData] = React.useState([]);
  console.log(data);

  const TRELLO_KEY = "6a6c6f59721b1ca0e78fbfa3b31a47e9";

  //   console.log(TRELLO_KEY);

  const USER_ID = "65f21f991de6369256306a66";

  const BoardContent = async () => {
    const theUser = await AsyncStorage.getItem("trello_token");
    fetch(
      `https://api.trello.com/1/boards/${boardId}?key=${TRELLO_KEY}&token=${theUser}`
    )
      .then((response) => response.json())
      .then((json) => setData(json))
      //   .catch((error) => console.error(error))
      .finally(() => setLoading(false));
  };

  React.useEffect(() => {
    BoardContent();
  }, []);

  https: return (
    <>
      <Text style={{ fontSize: 20, alignItems: "center" }}>{data.name}</Text>
    </>
  );
};

export default BoardScreen;
