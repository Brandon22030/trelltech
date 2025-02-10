import React, { useEffect, useState } from "react";
import {
  View,
  FlatList,
  ActivityIndicator,
  Text,
  StyleSheet,
  Button,
  Modal,
  TextInput,
  TouchableOpacity,
  Dimensions,
  ImageBackground,
} from "react-native";
import List from "./list";
import AsyncStorage from "@react-native-async-storage/async-storage";

type ListType = {
  id: string;
  name: string;
};

const TrelloLists = ({ route }: { route: any }) => {
  const image = { uri: "https://wallpapercave.com/wp/E7VdJQX.jpg" };
  const { width, height } = Dimensions.get("screen");
  const [lists, setLists] = useState<ListType[]>([]);
  const [isLoading, setLoading] = useState(true);
  const [theUserToken, setUserToken] = useState("");
  const [inviteEmail, setInviteEmail] = useState("");
  const [inviteModalVisible, setInviteModalVisible] = useState(false);

  const idBoard = route.params.BoardId;

  const key = "6a6c6f59721b1ca0e78fbfa3b31a47e9";
  const token = theUserToken;

  // Get the user token and fetch lists
  const userToken = async () => {
    const theUser = await AsyncStorage.getItem("trello_token");
    setUserToken(theUser || "");
  };

  const getLists = async () => {
    try {
      const theUser = await AsyncStorage.getItem("trello_token");
      const response = await fetch(
        `https://api.trello.com/1/boards/${idBoard}/lists?key=${key}&token=${theUser}`
      );
      const json = await response.json();
      setLists(json);
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    userToken();
    getLists();
  }, []);

  // Create a new list
  const [postList, setPostList] = useState("");
  const [modalVisible, setModalVisible] = useState(false);

  const createList = async () => {
    const theUser = await AsyncStorage.getItem("trello_token");
    const response = await fetch(
      `https://api.trello.com/1/boards/${idBoard}/lists?key=${key}&token=${theUser}`,
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
    const newList = await response.json();
    setLists((prevList) => [...prevList, newList]);
    closeModal();
  };

  // Invite user to the board
  const inviteUserToBoard = async () => {
    const theUser = await AsyncStorage.getItem("trello_token");
    try {
      const response = await fetch(
        `https://api.trello.com/1/boards/${idBoard}/members?key=${key}&token=${theUser}&email=${inviteEmail}`,
        {
          method: "PUT", // Use PUT to invite a member
        }
      );
      if (response.ok) {
        alert(`User ${inviteEmail} has been invited to the board.`);
        closeInviteModal();
      } else {
        alert("Failed to invite user.");
      }
    } catch (error) {
      console.error("Error inviting user:", error);
    }
  };

  // Open and close modals for creating lists and inviting users
  const openModal = () => {
    setModalVisible(true);
  };
  const closeModal = () => {
    setModalVisible(false);
    setPostList("");
  };

  const openInviteModal = () => {
    setInviteModalVisible(true);
  };
  const closeInviteModal = () => {
    setInviteModalVisible(false);
    setInviteEmail("");
  };

  return (
    <>
      {/* <ImageBackground
        source={image}
        resizeMode="cover"
        style={{ flex: 1, justifyContent: "center" }}
      > */}
        <View>
        </View>
        <Button title="ADD LIST" onPress={openModal}></Button>
        <Button title="INVITE USER" onPress={openInviteModal}></Button>
        <View>
          {isLoading ? (
            <ActivityIndicator />
          ) : (
            <FlatList
              data={lists}
              keyExtractor={({ id }) => id}
              renderItem={({ item }) => <List list={item} />}
              horizontal
              showsHorizontalScrollIndicator={false}
            />
          )}

          {/* Modal to add a list */}
          <Modal
            animationType="slide"
            transparent={true}
            visible={modalVisible}
          >
            <View style={styles.modalOverlay}>
              <View style={styles.modalContent}>
                <Text style={styles.modalTitle}>Add a new list</Text>
                <TextInput
                  style={styles.input}
                  placeholder="Enter the list name"
                  value={postList}
                  onChangeText={setPostList}
                />
                <View style={styles.buttonRow}>
                  <TouchableOpacity
                    style={styles.cancelButton}
                    onPress={closeModal}
                  >
                    <Text style={styles.cancelButtonText}>Cancel</Text>
                  </TouchableOpacity>
                  <TouchableOpacity
                    style={styles.addButton}
                    onPress={createList}
                  >
                    <Text style={styles.addButtonText}>Add</Text>
                  </TouchableOpacity>
                </View>
              </View>
            </View>
          </Modal>

          {/* Modal to invite a user */}
          <Modal
            animationType="slide"
            transparent={true}
            visible={inviteModalVisible}
          >
            <View style={styles.modalOverlay}>
              <View style={styles.modalContent}>
                <Text style={styles.modalTitle}>Invite a User</Text>
                <TextInput
                  style={styles.input}
                  placeholder="Enter user's email"
                  value={inviteEmail}
                  onChangeText={setInviteEmail}
                />
                <View style={styles.buttonRow}>
                  <TouchableOpacity
                    style={styles.addButton}
                    onPress={inviteUserToBoard}
                  >
                    <Text style={styles.addButtonText}>Invite</Text>
                  </TouchableOpacity>
                  <TouchableOpacity
                    style={styles.cancelButton}
                    onPress={closeInviteModal}
                  >
                    <Text style={styles.cancelButtonText}>Cancel</Text>
                  </TouchableOpacity>
                </View>
              </View>
            </View>
          </Modal>
          {/* <View
            style={{
              backgroundColor: "#00000045",
              borderRadius: 8,
              padding: 10,
              width: width - 50,
              opacity: 10,
              // marginRight: 30,
              // height: height - 50,
            }}
          >
            <Button
              title="Add a list"
              onPress={openModal}
              color={"white"}
            ></Button>
          </View> */}
        </View>
      {/* </ImageBackground>_ */}
    </>
  );
};

export default TrelloLists;

const styles = StyleSheet.create({
  modalOverlay: {
    flex: 1,
    backgroundColor: "rgba(0, 0, 0, 0.5)",
    justifyContent: "center",
    alignItems: "center",
  },
  modalContent: {
    width: 300,
    backgroundColor: "white",
    borderRadius: 10,
    padding: 20,
    alignItems: "center",
  },
  modalTitle: {
    fontSize: 18,
    marginBottom: 10,
    fontWeight: "bold",
  },
  input: {
    width: "100%",
    height: 40,
    borderColor: "#ddd",
    borderWidth: 1,
    marginBottom: 15,
    paddingLeft: 10,
    borderRadius: 5,
  },
  buttonRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    width: "100%",
    alignItems: "center",
  },
  addButton: {
    backgroundColor: "#007bff",
    padding: 10,
    borderRadius: 5,
    marginHorizontal: 5,
  },
  addButtonText: {
    color: "white",
    fontWeight: "bold",
  },
  cancelButton: {
    borderRadius: 5,
    marginHorizontal: 5,
  },
  cancelButtonText: {
    color: "black",
    fontWeight: "bold",
  },
});
