import React, { useState } from "react";
import {
  Button,
  View,
  Text,
  ActivityIndicator,
  Alert,
  Image,
  StyleSheet,
} from "react-native";
import { WebView } from "react-native-webview";
import AsyncStorage from "@react-native-async-storage/async-storage";
import Workspaces from "@/app/components/Workspaces";
import { useNavigation } from "@react-navigation/native";

const TRELLO_API_KEY = "6a6c6f59721b1ca0e78fbfa3b31a47e9";
const YOUR_REDIRECT_URL = "http://localhost:8081";
const TRELLO_AUTH_URL = `https://trello.com/1/authorize?expiration=never&return_url=${YOUR_REDIRECT_URL}&name=TrellTech&scope=read,write,account&callback_method=fragment&response_type=token&key=${TRELLO_API_KEY}`;

interface TrelloUser {
  fullName: string;
  username: string;
  id: string;
  avatarUrl: string;
  email: string;
  userToken: string;
}

// Fonction pour stocker le token dans AsyncStorage
const storeToken = async (token: string) => {
  try {
    console.log("Token reçu :", token); // Log du token reçu
    await AsyncStorage.setItem("trello_token", token);
    // const userToken = await AsyncStorage.getItem("trello_token");
    // console.log(userToken);
    console.log("Token stocké avec succès"); // Confirmation que le token est bien stocké
  } catch (e) {
    console.error("Erreur lors du stockage du token", e);
  }
};

// Fonction pour récupérer les informations utilisateur après l'authentification
const fetchUserInfo = async (
  token: string,
  setUserInfo: React.Dispatch<React.SetStateAction<TrelloUser | null>>
) => {
  try {
    const response = await fetch(
      `https://api.trello.com/1/members/me?key=${TRELLO_API_KEY}&token=${token}`
    );
    const data = await response.json();
    setUserInfo({
      fullName: data.fullName,
      username: data.username,
      email: data.email || "Non disponible",
      id: data.id,
      avatarUrl: data.avatarUrl + "/170.png",
      userToken: token, // URL de l'avatar avec une taille de 170px
    });
  } catch (e) {
    console.error(
      "Erreur lors de la récupération des informations utilisateur",
      e
    );
  }
};

const handleLogout = async (
  setUserInfo: React.Dispatch<React.SetStateAction<TrelloUser | null>>
) => {
  try {
    await AsyncStorage.removeItem("trello_token");
    setUserInfo(null);
  } catch (e) {
    console.error("Erreur lors de la déconnexion", e);
  }
};

const TrelloAuth: React.FC = () => {
  const [userInfo, setUserInfo] = useState<TrelloUser | null>(null);
  const [loading, setLoading] = useState(true);
  const [isWebViewVisible, setWebViewVisible] = useState(false); // État pour contrôler la visibilité de la WebView

  // console.log(userInfo);

  const navigation = useNavigation();

  // Fonction pour capturer le token dans la WebView avec log de l'URL
  const onNavigationStateChange = (navState: any) => {
    const { url } = navState;
    console.log("Changement d'URL détecté :", url); // Log de l'URL actuelle

    const tokenFromFragment = url.match(/#token=([^&]+)/);

    const token = tokenFromFragment ? tokenFromFragment[1] : null;

    if (token) {
      console.log("Token extrait de l'URL :", token); // Log du token extrait

      // Appeler la fonction pour stocker et traiter le token
      storeToken(token);
      fetchUserInfo(token, setUserInfo);
      setWebViewVisible(false); // Masquer la WebView après avoir obtenu le token
    } else {
      console.log("Aucun token trouvé dans l'URL.");
    }
  };

  return (
    // <View style={styles.view}>
    //   <Image
    //     style={styles.image}
    //     source={require("@/assets/images/login/trello.png")}
    //   />
    <View style={styles.container}>
      {userInfo ? (
        <View style={styles.userInfoContainer}>
          <Image source={{ uri: userInfo.avatarUrl }} style={styles.avatar} />
          <Text style={styles.welcomeText}>
            Bienvenue, {userInfo.fullName}!
          </Text>
          <Text style={styles.infoText}>
            Nom d'utilisateur: {userInfo.username}
          </Text>
          <Text style={styles.infoText}>Email: {userInfo.email}</Text>
          <Button
            title="Voir les Workspaces"
            onPress={() => {
              navigation.navigate("Workspace", { UserInformation: userInfo });
            }}
          />
          <Button title="Logout" onPress={() => handleLogout(setUserInfo)} />
        </View>
      ) : (
        // <View>
        //   <Workspaces userInfomations={userInfo} />
        // </View>
        <>
          {!isWebViewVisible && (
            <View style={styles.view}>
              <Image
                style={styles.image}
                source={require("@/assets/images/login/trello.png")}
              />

              <View
                style={{
                  height: "100%",
                  width: "100%",
                  display: "flex",
                  justifyContent: "space-around",
                }}
              >
                <View style={{ display: "flex", alignItems: "center" }}>
                  <Text
                    style={{
                      marginTop: 150,
                      color: "white",
                      fontWeight: "bold",
                      fontSize: 50,
                    }}
                  >
                    Login
                  </Text>
                </View>
                <View style={{ alignItems: "center", marginHorizontal: 4 }}>
                  <View
                    style={{
                      marginHorizontal: 50,
                      width: "100%",
                      alignItems: "center",
                    }}
                  >
                    <Button
                      style={{
                        width: "100%",
                        backgroundColor: "white",
                        padding: 10,
                        borderRadius: 20,
                      }}
                      title="Login avec Trello"
                      onPress={() => setWebViewVisible(true)}
                    />
                  </View>
                </View>
              </View>
            </View>
          )}
          {isWebViewVisible && (
            <View style={styles.webViewContainer}>
              {loading && <ActivityIndicator size="large" color="#0000ff" />}
              <WebView
                style={{ marginTop: 50 }}
                source={{ uri: TRELLO_AUTH_URL }}
                onNavigationStateChange={onNavigationStateChange}
                onLoadEnd={() => setLoading(false)}
                onError={() =>
                  Alert.alert(
                    "Erreur",
                    "Impossible de charger la page d'authentification"
                  )
                }
                startInLoadingState
              />
            </View>
          )}
        </>
      )}
    </View>
    // </View>
  );
};
const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    // padding: 16,
    backgroundColor: "#f5f5f5",
  },
  userInfoContainer: {
    justifyContent: "center",
    alignItems: "center",
    margin: 20,
  },
  avatar: {
    width: 100,
    height: 100,
    borderRadius: 50,
    marginBottom: 20,
  },
  welcomeText: {
    fontSize: 20,
    fontWeight: "bold",
    marginBottom: 10,
  },
  infoText: {
    fontSize: 16,
    marginBottom: 5,
  },
  webViewContainer: {
    flex: 1,
    width: "100%",
  },
  logoutButton: {
    marginTop: 20,
    backgroundColor: "red",
    color: "#fff",
  },
  image: {
    height: "100%",
    width: "100%",
    position: "absolute",
  },

  view: {
    backgroundColor: "white",
    height: "100%",
    width: "100%",
    marginTop: 50,
  },
});
export default TrelloAuth;
