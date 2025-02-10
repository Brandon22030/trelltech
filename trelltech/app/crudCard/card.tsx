import React, { useState } from "react";
import { View, Text, Button, TouchableOpacity, Pressable, Dimensions, Modal, TextInput } from "react-native";

const Card = ({ card }) => {
  const [modalVisible, setModalVisible] = useState(false);
  const [postComment, setPostComment] = useState("");
  const [comments, setComments] = useState('')
  const { height, width } = Dimensions.get("screen");
  const wdt = width - 10;
  // Open modal for adding a card
  const openModal = () => {
    setModalVisible(true);
  };
  // Close the modal
  const closeModal = () => {
    setModalVisible(false);
    setPostComment("");
  };

  // get comments

  const getComments = async () => {
    try {
      const response = await fetch(
        `https://api.trello.com/1/cards/${card.id}/actions?filter=commentCard&key=0d291e5164945eb4d89081b50bb20119&token=ATTA9da68cfc7192064200cb95a6dded889a5a647d7faf7de54213c7c10cad1e4ddbC83993F0`
      );
      const comments = await response.json();
      // setComments((prevComments) => [...prevComments, comments]);
      // setComments((prev) => ({ prev, comments: comments }));

    } catch (error) {
      console.error(error);
    }
  };

  return (
    <>
      <TouchableOpacity onLongPress={openModal}
        style={{
          // backgroundColor: "#3B3D42",
          backgroundColor: "#f8fafc",
          borderRadius: 5,
          padding: 15,
          marginBottom: 10,
          // shadowColor: "#000",
          // shadowOffset: { width: 0, height: 2 },
          // shadowOpacity: 0.1,
          // shadowRadius: 4,
          elevation: 3,
          // width: width,
        }}
      >
        <Text
          style={{
            fontSize: 13,
            // color: "#E1E1E1",
            color: "#172B4D",
            fontWeight: "semibold",
          }}
        >
          {card.name}
        </Text>
      </TouchableOpacity>
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
              width: width,
              height: height,
              backgroundColor: "black",
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

            {/* <TextInput
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
            </View> */}
          </View>
        </View>
      </Modal>
    </>
  );
};

export default Card;
