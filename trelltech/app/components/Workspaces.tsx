import React, { useEffect, useState } from "react";
import {
  View,
  Text,
  FlatList,
  StyleSheet,
  Image,
  Alert,
  Button,
  Modal,
  TextInput,
  TouchableOpacity,
} from "react-native";
import { useNavigation } from "@react-navigation/native";
import { router } from "expo-router";
import AsyncStorage from "@react-native-async-storage/async-storage";
import Ionicons from "@expo/vector-icons/Ionicons";

interface Workspace {
  id: string;
  name: string;
  displayName: string;
  desc: string;
  website: string;
}

interface Board {
  id: string;
  name: string;
  members: Member[];
  lists: any[];
  cards: any[];
}

interface Member {
  id: string;
  fullName: string;
  avatarUrl: string;
}

const Workspaces = ({ route }: { route: any }) => {
  // const Workspaces: React.FC = (prop) => {
  // console.log(prop.userInfomations.fullName);
  const [workspaces, setWorkspaces] = useState<Workspace[]>([]);
  const [boards, setBoards] = useState<{ [key: string]: Board[] }>({});
  const [modalVisible, setModalVisible] = useState(false);
  const [newWorkspaceName, setNewWorkspaceName] = useState("");
  const [description, setDescription] = useState("");
  const [website, setWebsite] = useState("");
  const [refreshing, setRefreshing] = useState(false);
  const [editModalVisible, setEditModalVisible] = useState(false);
  const [editingWorkspaceId, setEditingWorkspaceId] = useState("");
  const [updatedName, setUpdatedName] = useState("");
  const [updatedDescription, setUpdatedDescription] = useState("");
  const [updatedWebsite, setUpdatedWebsite] = useState("");

  const navigation = useNavigation();

  const TRELLO_API_KEY = "6a6c6f59721b1ca0e78fbfa3b31a47e9";

  // const userInfomations = route.params.UserInformation;

  const openUpdateModal = (workspace: Workspace) => {
    setEditingWorkspaceId(workspace.id);
    setUpdatedName(workspace.displayName);
    setUpdatedDescription(workspace.desc || "");
    setUpdatedWebsite(workspace.website || "");
    setEditModalVisible(true);
  };

  const onRefresh = async () => {
    setRefreshing(true);
    await fetchWorkspaces();
    setRefreshing(false);
  };

  const fetchWorkspaces = async () => {
    try {
      const theUser = await AsyncStorage.getItem("trello_token");
      const res = await fetch(
        `https://api.trello.com/1/members/me/organizations?key=${TRELLO_API_KEY}&token=${theUser}`
      );
      const data = await res.json();

      // Fetch detailed info for each workspace
      const workspacesWithDetails = await Promise.all(
        data.map(async (workspace: Workspace) => {
          const detailsRes = await fetch(
            `https://api.trello.com/1/organizations/${workspace.id}?fields=description,website&key=${TRELLO_API_KEY}&token=${theUser}`
          );
          const details = await detailsRes.json();
          return {
            ...workspace,
            description: details.desc,
            website: details.website,
          };
        })
      );

      setWorkspaces(workspacesWithDetails);
      workspacesWithDetails.forEach((workspace: Workspace) => {
        fetchBoards(workspace.id);
      });
    } catch (e) {
      Alert.alert("Erreur", "Impossible de récupérer les workspaces");
      console.error(e);
    }
  };

  const createWorkspace = async () => {
    if (!newWorkspaceName || !description || !website) {
      Alert.alert("Erreur", "Remplissez tous les champs.");
      return;
    }

    try {
      const theUser = await AsyncStorage.getItem("trello_token");

      const res = await fetch(
        `https://api.trello.com/1/organizations?displayName=${newWorkspaceName}&key=${TRELLO_API_KEY}&token=${theUser}`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            name: newWorkspaceName,
            desc: description,
            website: website,
          }),
        }
      );

      if (!res.ok) {
        const errorResponse = await res.json(); // Log the actual error message
        console.error("Error response from Trello:", errorResponse);
        throw new Error("Erreur lors de la création du workspace");
      }

      const newWorkspace = await res.json();
      setWorkspaces((prev) => [...prev, newWorkspace]);
      console.log("ID", newWorkspace.id);
      await fetchBoards(newWorkspace.id);

      // Reset modal and input states
      setModalVisible(false);
      setNewWorkspaceName("");
      setDescription("");
      setWebsite("");
    } catch (e) {
      Alert.alert("Erreur", "Impossible de créer le workspace");
      console.error(e);
    }
  };

  const deleteWorkspace = async (workspaceId: string) => {
    try {
      const theUser = await AsyncStorage.getItem("trello_token");

      const res = await fetch(
        `https://api.trello.com/1/organizations/${workspaceId}?key=${TRELLO_API_KEY}&token=${theUser}`,
        {
          method: "DELETE",
        }
      );

      if (res.ok) {
        // Supprime le workspace de l'état
        setWorkspaces((prev) =>
          prev.filter((workspace) => workspace.id !== workspaceId)
        );
        Alert.alert("Succès", "Le workspace a été supprimé.");
      } else {
        throw new Error("Erreur lors de la suppression du workspace");
      }
    } catch (e) {
      Alert.alert("Erreur", "Impossible de supprimer le workspace");
      console.error(e);
    }
  };

  const updateWorkspace = async (
    workspaceId: string,
    updatedName: string,
    updatedDescription: string,
    updatedWebsite: string
  ) => {
    try {
      const theUser = await AsyncStorage.getItem("trello_token");

      const res = await fetch(
        `https://api.trello.com/1/organizations/${workspaceId}?key=${TRELLO_API_KEY}&token=${theUser}`,
        {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            displayName: updatedName,
            desc: updatedDescription,
            website: updatedWebsite,
          }),
        }
      );

      if (res.ok) {
        const updatedWorkspace = await res.json();
        console.log("Updated workspace response:", updatedWorkspace);

        // Mets à jour l'état des workspaces
        setWorkspaces((prev) =>
          prev.map((workspace) =>
            workspace.id === workspaceId ? updatedWorkspace : workspace
          )
        );
        Alert.alert("Succès", "Le workspace a été mis à jour.");
        setUpdatedName("");
        setUpdatedDescription("");
        setUpdatedWebsite("");
        setEditModalVisible(false);
      } else {
        const errorResponse = await res.json();
        console.error("Error response from Trello:", errorResponse);
        throw new Error("Erreur lors de la mise à jour du workspace");
      }
    } catch (e) {
      Alert.alert("Erreur", "Impossible de mettre à jour le workspace");
      console.error(e);
    }
  };

  const fetchBoards = async (workspaceId: string) => {
    try {
      const theUser = await AsyncStorage.getItem("trello_token");

      const res = await fetch(
        `https://api.trello.com/1/organizations/${workspaceId}/boards?key=${TRELLO_API_KEY}&token=${theUser}&members=all`
      );
      const data = await res.json();

      const boardsWithDetails = await Promise.all(
        data.map(async (board: Board) => {
          const listsRes = await fetch(
            `https://api.trello.com/1/boards/${board.id}/lists?key=${TRELLO_API_KEY}&token=${theUser}`
          );
          const listsData = await listsRes.json();

          const cardsRes = await fetch(
            `https://api.trello.com/1/boards/${board.id}/cards?key=${TRELLO_API_KEY}&token=${theUser}`
          );
          const cardsData = await cardsRes.json();

          return {
            ...board,
            lists: listsData,
            cards: cardsData,
          };
        })
      );

      setBoards((prev) => ({ ...prev, [workspaceId]: boardsWithDetails }));
    } catch (e) {
      Alert.alert("Erreur", "Impossible de récupérer les boards");
      console.error(e);
    }
  };

  const [showBox, setShowBox] = useState(true);

  const deleteBoard = async (boardId: any) => {
    const theUser = await AsyncStorage.getItem("trello_token");

    const accept = Alert.alert(
      "Are you sure?",
      "Do you really want to delete this board ?",
      [
        {
          text: "Yes",
          onPress: () => {
            fetch(
              `https://api.trello.com/1/boards/${boardId}?key=${TRELLO_API_KEY}&token=${theUser}`,
              {
                method: "DELETE",
              }
            );

            // if (await response) {
            router.push("/components/Workspaces");
            // }
            //setShowBox(false);
          },
        },
        {
          text: "No",
        },
      ]
    );
  };

  useEffect(() => {
    fetchWorkspaces();
  }, []);

  const renderBoard = ({ item }: { item: Board }) => (
    <View style={styles.boardCard}>
      <View>
        {item.prefs.backgroundColor ? (
          <View
            style={{
              backgroundColor: item.prefs.backgroundColor,
              borderRadius: 20,
            }}
          >
            <View
              style={{
                borderRadius: 20,
                paddingVertical: 50,
                marginHorizontal: "auto",
              }}
            >
              <Text style={styles.boardTitle}>{item.name}</Text>
              <FlatList
                data={item.members}
                horizontal
                renderItem={({ item: member }) => (
                  <Image
                    source={{
                      uri: "https://th.bing.com/th?id=OIP.Rg2FmvXuSaiA7GHVqvuY0QHaFj&w=288&h=216&c=8&rs=1&qlt=90&o=6&pid=3.1&rm=2",
                    }}
                    style={styles.memberAvatar}
                  />
                )}
                keyExtractor={(member) => member.id}
              />
              <View style={{ display: "flex", flexDirection: "row", gap: 10 }}>
                <Text style={styles.boardInfo}>
                  Listes: {item.lists.length}
                </Text>
                <Text style={styles.boardInfo}>
                  Cartes: {item.cards.length}
                </Text>
              </View>
            </View>
          </View>
        ) : (
          <View>
            <Image
              style={styles.image}
              source={{
                uri: item.prefs.backgroundImage
              }}
            />
            <View
              style={{
                borderRadius: 20,
                paddingVertical: 50,
                marginHorizontal: "auto",
              }}
            >
              <Text style={styles.boardTitle}>{item.name}</Text>
              <FlatList
                data={item.members}
                horizontal
                renderItem={({ item: member }) => (
                  <Image
                    source={{
                      uri: "https://th.bing.com/th?id=OIP.Rg2FmvXuSaiA7GHVqvuY0QHaFj&w=288&h=216&c=8&rs=1&qlt=90&o=6&pid=3.1&rm=2",
                    }}
                    style={styles.memberAvatar}
                  />
                )}
                keyExtractor={(member) => member.id}
              />
              <View style={{ display: "flex", flexDirection: "row", gap: 10 }}>
                <Text style={styles.boardInfo}>
                  Listes: {item.lists.length}
                </Text>
                <Text style={styles.boardInfo}>
                  Cartes: {item.cards.length}
                </Text>
              </View>
            </View>
          </View>
        )}
      </View>
      <View
        style={{
          display: "flex",
          flexDirection: "row",
          gap: 10,
          justifyContent: "center",
          marginTop: 5,
        }}
      >
        <Button
          title="Details"
          color="#0077b6"
          onPress={() => {
            navigation.navigate("Lists", { BoardId: item.id });
          }}
        />
        <Button
          title="Supprimer"
          color="red"
          onPress={() => deleteBoard(item.id)}
        />
      </View>
    </View>
  );

  const renderWorkspace = ({ item }: { item: Workspace }) => (
    <View style={styles.workspaceCard}>
      <Text style={styles.workspaceTitle}>{item.displayName}</Text>

      <View
        style={{
          display: "flex",
          flexDirection: "row",
          justifyContent: "space-between",
        }}
      >
        <Button
          title="Modifier"
          color="#0077b6"
          onPress={() => openUpdateModal(item)}
        />

        <Button
          title="Supprimer"
          color="red"
          onPress={() => deleteWorkspace(item.id)}
        />
        <Button
          title="Ajouter un tableau"
          color="#0077b6"
          onPress={() => {
            navigation.navigate("AddBoard", { WorkId: item.id });
          }}
        />
      </View>

      {boards[item.id] && boards[item.id].length > 0 ? (
        <FlatList
          data={boards[item.id]}
          renderItem={renderBoard}
          keyExtractor={(board) => board.id}
        />
      ) : (
        <Text style={styles.noBoardsText}>Pas de boards disponibles</Text>
      )}
      {/* Bouton pour supprimer un workspace */}
    </View>
  );

  return (
    <View style={styles.container}>
      {/* <Text style={styles.title}>Vos Workspaces</Text> */}

      {/* <Button title="ADD WORKSPACE" onPress={() => setModalVisible(true)} /> */}
      <FlatList
        data={workspaces}
        keyExtractor={(item) => item.id}
        renderItem={renderWorkspace}
        onRefresh={onRefresh}
        refreshing={refreshing}
      />
      {/* Modal for adding a new workspace */}
      <Modal
        animationType="slide"
        transparent={false}
        visible={modalVisible}
        onRequestClose={() => setModalVisible(false)}
      >
        <View style={styles.modalContainer}>
          <Text style={styles.modalTitle}>Créer un Workspace</Text>
          <TextInput
            style={styles.input}
            placeholder="Nom du Workspace"
            value={newWorkspaceName}
            onChangeText={setNewWorkspaceName}
          />
          <TextInput
            style={styles.input}
            placeholder="Description"
            value={description}
            onChangeText={setDescription}
          />
          <TextInput
            style={styles.input}
            placeholder="Site Web"
            value={website}
            onChangeText={setWebsite}
          />
          <View style={styles.buttonContainer}>
            <Button title="Créer" color="#0077b6" onPress={createWorkspace} />
            <Button
              title="Annuler"
              onPress={() => setModalVisible(false)}
              color="#d32f2f"
            />
          </View>
        </View>
      </Modal>
      {/* Code du modal de mise à jour */}
      <Modal
        animationType="slide"
        transparent={false}
        visible={editModalVisible}
        onRequestClose={() => setEditModalVisible(false)}
      >
        <View style={styles.modalContainer}>
          <Text style={styles.modalTitle}>Modifier le Workspace</Text>
          <TextInput
            style={styles.input}
            placeholder="Nom du Workspace"
            value={updatedName}
            onChangeText={setUpdatedName}
          />
          <TextInput
            style={styles.input}
            placeholder="Description"
            value={updatedDescription}
            onChangeText={setUpdatedDescription}
          />
          <TextInput
            style={styles.input}
            placeholder="Site Web"
            value={updatedWebsite}
            onChangeText={setUpdatedWebsite}
          />
          <View style={styles.buttonContainer}>
            <Button
              title="Enregistrer"
              onPress={() =>
                updateWorkspace(
                  editingWorkspaceId,
                  updatedName,
                  updatedDescription,
                  updatedWebsite
                )
              }
              color="#0077b6"
            />
            <Button
              title="Annuler"
              onPress={() => setEditModalVisible(false)}
              color="#d32f2f"
            />
          </View>
        </View>
      </Modal>
      <TouchableOpacity style={styles.shadow}>
        <Ionicons
          name="add"
          size={50}
          color="white"
          style={styles.add}
          onPress={() => setModalVisible(true)}
        />
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 16,
    backgroundColor: "#f0f8ff", // Sky blue background
  },
  title: {
    fontSize: 24,
    fontWeight: "bold",
    color: "#0077b6", // Darker blue for text
    marginBottom: 16,
  },
  workspaceCard: {
    // backgroundColor: "#e0f7fa", // Light blue for workspaces
    // padding: 16,
    borderRadius: 8,
    marginBottom: 50,
  },
  workspaceTitle: {
    fontSize: 20,
    fontWeight: "bold",
    color: "#0077b6", // Darker blue
    marginBottom: 12,
    borderRadius: 10,
  },
  boardCard: {
    backgroundColor: "#333333", // Light red for board cards
    padding: 12,
    borderRadius: 8,
    marginBottom: 12,
    display: "flex",
    flexDirection: "column",
  },
  boardTitle: {
    fontSize: 25,
    fontWeight: "bold",
    color: "white", // Red for board titles
    marginBottom: 8,
  },
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
  memberAvatar: {
    width: 40,
    height: 40,
    borderRadius: 20,
    marginRight: 8,
  },
  boardInfo: {
    fontSize: 20,
    color: "white",
    marginTop: 4,
  },
  noBoardsText: {
    fontSize: 16,
    color: "#6c757d",
  },
  add: {
    position: "absolute",
    bottom: 50,
    right: 10,
    alignSelf: "center",
    backgroundColor: "#0077b6",
    padding: 5,
    zIndex: 1,
    width: 60,
    borderRadius: 100,
  },
  shadow: {
    shadowColor: "#000000",
    shadowOffset: { width: 10, height: 10 },
    shadowOpacity: 1,
    shadowRadius: 6,
  },
  image: {
    height: "100%",
    width: "100%",
    position: "absolute",
    borderRadius: 20,
  },
});

export default Workspaces;
