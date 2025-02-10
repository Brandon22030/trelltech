import React, { useState } from "react";
import { Button, View } from "react-native";
import AsyncStorage from "@react-native-async-storage/async-storage";

const Posts = () => {
  const [postList, setPostList] = useState('');
  const [isPosting, setIsPosting] = useState(false);
  const archivePosts = async () => {


  const [theUserToken, setUserToken] = useState("");

  const userToken = async () => {
    const theUser = await AsyncStorage.getItem("trello_token");

    setUserToken(theUser || "");
  };
  const key = "6a6c6f59721b1ca0e78fbfa3b31a47e9";
  const token = theUserToken;
  
    setIsPosting(true)
    const theUser = await AsyncStorage.getItem("trello_token");

    const response = await fetch(
      `https://api.trello.com/1/lists/66f3e790e2b90f1bfcc37285?key=${key}&token=${theUser}`,
      {
        method: "PUT",
        headers: {
          Accept: "application/json",
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          closed: true,
        }),
      }
    );
  }
  return (
    <View style={{ flex: 1, padding: 24 }}>
        <Button title={"ARCHIVE"} onPress={archivePosts}></Button>
    </View>
  )
};
export default Posts;
