import { Image, StyleSheet, View, Text, TouchableOpacity } from "react-native";
import AsyncStorage from "@react-native-async-storage/async-storage";



export default function LoginScreen() {
  return (
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
            <TouchableOpacity
              style={{
                width: "100%",
                backgroundColor: "white",
                padding: 10,
                borderRadius: 20,
              }}
              // onPress={}
            >
              <Text
                style={{
                  fontSize: 20,
                  fontWeight: "bold",
                  textAlign: "center",
                  color: "black",
                }}
              >
                Login
              </Text>
            </TouchableOpacity>
          </View>
        </View>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  image: {
    height: "100%",
    width: "100%",
    position: "absolute",
  },

  view: {
    backgroundColor: "white",
    height: "100%",
    width: "100%",
  },
});
