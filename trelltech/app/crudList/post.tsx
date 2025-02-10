import React, { useState } from "react";
import { Button, TextInput, View } from "react-native";
import AsyncStorage from "@react-native-async-storage/async-storage";

const Post = () => {
  const [postList, setPostList] = useState("");
  const [isPosting, setIsPosting] = useState(false);
  const [theUserToken, setUserToken] = useState("");

  const userToken = async () => {
    const theUser = await AsyncStorage.getItem("trello_token");

    setUserToken(theUser || "");
  };
  const key = "6a6c6f59721b1ca0e78fbfa3b31a47e9";
  const token = theUserToken;

  const addPost = async () => {
    const theUser = await AsyncStorage.getItem("trello_token");

    setIsPosting(true);
    const response = await fetch(
      `https://api.trello.com/1/boards/66f16abd4b612b558c79f2fc/lists?key=${key}&token=${theUser}`,
      {
        method: "POST",
        headers: {
          Accept: "application/json",
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          name: postList,
        }),
      }
    );
  };
  return (
    <View style={{ flex: 1, padding: 24 }}>
      <TextInput
        placeholder="Text input"
        value={postList}
        onChangeText={setPostList}
      />
      <Button title={"Add"} onPress={addPost}></Button>
    </View>
  );
};
export default Post;
