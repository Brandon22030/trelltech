import {
  Text,
  View,
  Button,
  StyleSheet,
  FlatList,
  Modal,
  Image,
  TouchableOpacity,
  TextInput,
} from "react-native";
import React, { useState, useEffect } from "react";
import { router } from "expo-router";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { SafeAreaView } from "react-native-safe-area-context";

export default function AddBoard() {
  const [theUserToken, setUserToken] = useState("");
  const [createBoard, setCreateBoard] = useState("");
  const [createDesc, setCreateDesc] = useState("");
  const [selectedTemplate, setSelectedTemplate] = useState(null);
  const [templates, setTemplates] = useState([]);
  const [isLoading, setLoading] = useState(true);

  const TRELLO_KEY = "6a6c6f59721b1ca0e78fbfa3b31a47e9";

  useEffect(() => {
    const userToken = async () => {
      const theUser = await AsyncStorage.getItem("trello_token");
      setUserToken(theUser || "");
      fetchTemplates(); // Fetch templates when token is available
    };
    userToken();
  }, []);

  // Fetch templates from Trello template gallery
  const fetchTemplates = async () => {
    try {
      const response = await fetch(
        `https://trello.com/1/boards/templates/gallery/?limit=5`
      );
      const templateData = await response.json();
      console.log("Templates fetched from API: ", templateData); // Log template data
      setTemplates(templateData);
      setLoading(false);
    } catch (error) {
      console.error("Error fetching templates:", error);
      setLoading(false);
    }
  };

  // Create board with selected template
  const postBoard = async () => {
    if (!selectedTemplate) {
      alert("Please select a template.");
      return;
    }

    const theUser = await AsyncStorage.getItem("trello_token");

    const create = await fetch(
      `https://api.trello.com/1/boards/?name=${createBoard}&idBoardSource=${selectedTemplate.id}&keepFromSource=all&key=${TRELLO_KEY}&token=${theUser}`,
      {
        method: "POST",
        headers: {
          Accept: "application/json",
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          name: createBoard,
          desc: createDesc,
        }),
      }
    );

    if (create.ok) {
      router.push("/components/Workspaces");
    } else {
      alert("Error creating board.");
    }
  };

  return (
    <SafeAreaView>
      <Modal
        animationType="slide"
        transparent={false}
        onRequestClose={() => router.push("/components/Workspaces")}
      >
        <View style={styles.modalContainer}>
          <Text style={styles.modalTitle}>Add a Board</Text>
          <TextInput
            placeholder="Board Title"
            style={styles.input}
            value={createBoard}
            onChangeText={setCreateBoard}
          />
          <TextInput
            placeholder="Board Description"
            style={styles.input}
            value={createDesc}
            onChangeText={setCreateDesc}
          />

          {/* Template Selection */}
          <Text style={styles.subtitle}>Choose a Template</Text>

          {isLoading ? (
            <Text>Loading Templates...</Text>
          ) : (
            <FlatList
              data={templates}
              keyExtractor={(item) => item.id}
              horizontal
              renderItem={({ item }) => (
                <TouchableOpacity
                  style={[
                    styles.templateCard,
                    selectedTemplate?.id === item.id
                      ? styles.selectedTemplate
                      : null,
                  ]}
                  onPress={() => setSelectedTemplate(item)}
                >
                  <Image
                    source={{ uri: item.prefs.backgroundImage }}
                    style={styles.templateImage}
                  />
                  <Text style={styles.templateName}>{item.name}</Text>
                  {/* <Text>{item.desc}</Text> */}
                </TouchableOpacity>
              )}
            />
          )}

          {/* Button Actions */}
          <View style={styles.buttonContainer}>
            <Button title="Create" color="#0077b6" onPress={postBoard} />
            <Button
              title="Cancel"
              onPress={() => router.push("/components/Workspaces")}
              color="#d32f2f"
            />
          </View>
        </View>
      </Modal>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  input: {
    height: 40,
    borderColor: "#0077b6",
    borderWidth: 1,
    marginBottom: 20,
    paddingLeft: 10,
    borderRadius: 5,
  },
  buttonContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
  },
  modalContainer: {
    flex: 1,
    justifyContent: "center",
    padding: 20,
    backgroundColor: "#fff",
  },
  modalTitle: {
    fontSize: 20,
    fontWeight: "bold",
    color: "#0077b6",
    marginBottom: 20,
  },
  subtitle: {
    fontSize: 18,
    fontWeight: "bold",
    marginBottom: 10,
  },
  templateCard: {
    width: 200,
    height: 200,
    marginRight: 10,
    padding: 10,
    borderWidth: 1,
    borderRadius: 8,
    borderColor: "#ddd",
  },
  selectedTemplate: {
    borderColor: "#0077b6",
    borderWidth: 2,
  },
  templateImage: {
    
    width: 200,
    height: 200,
    position: "absolute",
    marginBottom: 10,
    borderRadius: 5,
  },
  templateName: {
    fontWeight: "bold",
    color: "white",
    marginBottom: 5,
    marginHorizontal: "auto",
  },
});
