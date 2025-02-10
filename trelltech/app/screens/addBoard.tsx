import { NavigatorContext } from "expo-router/build/views/Navigator";
import {
  Text,
  View,
  Button,
  StyleSheet,
  FlatList,
  Image,
  TouchableOpacity,
  Linking,
} from "react-native";
import * as React from "react";
import { useNavigation } from "@react-navigation/native";
import Config from "react-native-config";
import { SafeAreaView } from "react-native-safe-area-context";
import AsyncStorage from "@react-native-async-storage/async-storage";

export default function HomeScreen({route} : {route: any}) {

  const WOrkId = route.params.WorkId

  function openWebsite(websiteLink: string) {
    Linking.openURL(websiteLink);
  }

  const [isLoading, setLoading] = React.useState(true);
  const [data, setData] = React.useState([]);
  console.log(data);

  const TRELLO_KEY = "6a6c6f59721b1ca0e78fbfa3b31a47e9";

  //   console.log(TRELLO_KEY);

  const TRELLO_TOKEN = null;

  const USER_ID = "65f21f991de6369256306a66";

  const displayBoards = async () => {
    const theUser = await AsyncStorage.getItem("trello_token");

    fetch(
      `https://api.trello.com/1/members/${USER_ID}/boards?key=${TRELLO_KEY}&token=${theUser}`
    )
      .then((response) => response.json())
      .then((json) => setData(json))
      //   .catch((error) => console.error(error))
      .finally(() => setLoading(false));
  };

  React.useEffect(() => {
    displayBoards();
  }, []);

  const navigation = useNavigation();

  return (
    <SafeAreaView>
      <FlatList
        data={data}
        keyExtractor={({ id }) => id}
        renderItem={({ itdataem }) => (
          <TouchableOpacity
            onPress={() => {
              navigation.navigate("Board", { BoardId: item.id });
            }}
          >
            <View
              style={{
                alignItems: "center",
                textAlign: "center",
                borderStyle: "solid",
                display: "flex",
                justifyContent: "between",
                borderWidth: 1,
                paddingVertical: 30,
                marginHorizontal: 30,
                borderRadius: 5,
                borderColor: "blue",
                marginBottom: 50,
                flexDirection: "row",
                paddingHorizontal: 50,
                // flexWrap: "wrap",
              }}
            >
              <Text
                style={{
                  textAlign: "center",
                  alignItems: "center",
                  marginRight: 10,
                }}
              >
                {item.name}
              </Text>
              <Button
                title="Details"
                onPress={() =>
                  navigation.navigate("Board", { BoardId: item.id })
                }
              />
            </View>
          </TouchableOpacity>
        )}
      />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  boxContainer: {
    //width: "100%",
    //backgroundColor: "blue",
    textAlign: "center",
    //height: "20%",
    marginBottom: 50,
    flexDirection: "row",
    flexWrap: "wrap",
  },
  item: {
    display: "flex",
  },
  image: {
    height: 50,
    width: 50,
  },
});
