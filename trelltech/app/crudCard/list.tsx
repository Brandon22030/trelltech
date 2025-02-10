import React, { useEffect, useState } from "react";
import {
  View,
  Text,
  Button,
  FlatList,
  TextInput,
  TouchableOpacity,
  Modal,
  Image,
  Dimensions,
} from "react-native";
import AsyncStorage from "@react-native-async-storage/async-storage";

type CardType = {
  listId: string;
  id: string;
  name: string;
  attachments: AttachmentType[];
};

type AttachmentType = {
  url: string;
  name: string;
  previews: { url: string }[]; // Previews that contain image URLs
};

const List = ({ list }) => {
  const { width, height } = Dimensions.get("screen");
  const hgt = height - 200;
  const wdt = width - 50;
  const [theUserToken, setUserToken] = useState<string | null>("");
  const [cards, setCards] = useState<CardType[]>([]);

  const userToken = async () => {
    const theUser = await AsyncStorage.getItem("trello_token");
    setUserToken(theUser || "");
  };

  const key = "6a6c6f59721b1ca0e78fbfa3b31a47e9";
  const token = theUserToken;

  // Fetch cards with attachments
  const getCards = async (listId: any) => {
    try {
      const theUser = await AsyncStorage.getItem("trello_token");
      const response = await fetch(
        `https://api.trello.com/1/lists/${listId}/cards?attachments=true&key=${key}&token=${theUser}`
      );
      const json = await response.json();
      setCards(json);
    } catch (error) {
      console.error(error);
    }
  };

  useEffect(() => {
    userToken(); // Initialize token
    getCards(list.id); // Fetch cards for the given list
  }, [list.id]);

  const [postCard, setPostCard] = useState("");
  const [modalVisible, setModalVisible] = useState(false);

  // Add a new card to the list
  const addCard = async () => {
    try {
      const theUser = await AsyncStorage.getItem("trello_token");

      const response = await fetch(
        `https://api.trello.com/1/cards?key=${key}&token=${theUser}`,
        {
          method: "POST",
          headers: {
            Accept: "application/json",
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            name: postCard,
            idList: list.id,
          }),
        }
      );

      const newCard = await response.json();
      setCards((prevCard) => [...prevCard, newCard]);
      closeModal();
    } catch (error) {
      console.error(error);
    }
  };

  // Open modal for adding a card
  const openModal = () => {
    setModalVisible(true);
  };

  // Close the modal
  const closeModal = () => {
    setModalVisible(false);
    setPostCard("");
  };

  // Render each card
  const renderCard = ({ item }: { item: CardType }) => {
    // Check if the card has an image attachment (previews or direct URL)
    const imageUrl =
      item.attachments?.[0]?.previews?.[0]?.url || item.attachments?.[0]?.url;

    return (
      <View
        style={{
          borderRadius: 8,
          marginBottom: 15,
          overflow: "hidden", // Ensures the background image fits within the card
          backgroundColor: "white", // Set a default background color
        }}
      >
        {imageUrl && (
          <Image
            source={{ uri: imageUrl }}
            style={{
              position: "absolute",
              top: 0,
              left: 0,
              right: 0,
              bottom: 0,
              opacity: 0.3, // Set opacity for a subtle background effect
            }}
            resizeMode="cover"
          />
        )}
        <View
          style={{
            padding: 15,
            borderRadius: 8,
            backgroundColor: "rgba(255, 255, 255, 0.8)", // Transparent background to make text readable
            elevation: 2,
            shadowColor: "#000",
            shadowOffset: { width: 0, height: 2 },
            shadowOpacity: 0.2,
            shadowRadius: 5,
          }}
        >
          <Text style={{ fontWeight: "bold", fontSize: 16, color: "#333" }}>
            {item.name}
          </Text>
        </View>
      </View>
    );
  };

  return (
    <View
    // style={{
    //   backgroundColor: "black",
    //   width: "100%",
    //   height: "100%",
    // }}
    >
      <View
        style={{
          // backgroundColor: "#2D2E32",
          backgroundColor: "#e2e8f0",
          borderRadius: 8,
          padding: 20,
          width: wdt - 20,
          marginRight: 25,
          marginLeft: 25,
          minHeight: 15,
          maxHeight: hgt - 50,
          marginTop: 20,
          marginBottom: 350,
        }}
      >
        <View style={{ flexDirection: "row" }}>
          <Text
            style={{
              fontSize: 18,
              fontWeight: "bold",
              marginBottom: 10,
              // color: "#A1A1A1",
              color: "#5E6C84",
            }}
          >
            {list.name}
          </Text>
        </View>
        <FlatList
          data={cards}
          keyExtractor={({ id }) => id}
          renderItem={renderCard} // Custom render method for each card
        />
        <View
          style={{
            alignItems: "flex-start",
          }}
        >
          <Button title="+ Add Card" onPress={openModal} color={"black"} />
        </View>
      </View>

      <Modal animationType="slide" transparent={true} visible={modalVisible}>
        <View
          style={{
            flex: 1,
            backgroundColor: "rgba(0, 0, 0, 0.5)",
            justifyContent: "center",
            alignItems: "center",
          }}
        >
          <View
            style={{
              width: wdt,
              // height: hgt,
              backgroundColor: "white",
              borderRadius: 10,
              padding: 20,
              alignItems: "center",
            }}
          >
            <Text
              style={{ fontSize: 18, marginBottom: 10, fontWeight: "bold" }}
            >
              Add a new Card
            </Text>

            <TextInput
              style={{
                width: "100%",
                height: 40,
                borderColor: "#ddd",
                borderWidth: 1,
                marginBottom: 15,
                paddingLeft: 10,
                borderRadius: 5,
              }}
              placeholder="Enter the card name"
              value={postCard}
              onChangeText={setPostCard}
            />
            <View
              style={{
                flexDirection: "row",
                justifyContent: "space-between",
                width: "100%",
                alignItems: "center",
              }}
            >
              <TouchableOpacity
                style={{
                  borderRadius: 5,
                  marginHorizontal: 5,
                }}
                onPress={closeModal}
              >
                <Text
                  style={{
                    color: "black",
                    fontWeight: "bold",
                  }}
                >
                  Cancel
                </Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={{
                  backgroundColor: "#007bff",
                  padding: 10,
                  borderRadius: 5,
                  marginHorizontal: 5,
                }}
                onPress={addCard}
              >
                <Text style={{ color: "white", fontWeight: "bold" }}>Add</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>
    </View>
  );
};

export default List;
