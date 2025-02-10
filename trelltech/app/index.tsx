import { NavigatorContext } from "expo-router/build/views/Navigator";
import { Text, View, Image } from "react-native";
import * as React from "react";
import { NavigationContainer } from "@react-navigation/native";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import HomeScreen from "./screens/HomeScreen";
import BoardScreen from "./screens/BoardsScreen";
// import AppNavigator from "./navigation/AppNavigator";
import Workspaces from "@/app/components/Workspaces";
import AddBoard from "./components/addBoard";
import TrelloAuth from "@/components/TrelloAuth";
import LoginScreen from "./screens/Login";
import Alist from "./crudCard/Alist";
import TrelloLists from "./crudCard/trellolist";
import { GestureHandlerRootView } from "react-native-gesture-handler";

const Stack = createNativeStackNavigator();

export default function App() {
  // return <AppNavigator />
  return (
    // <GestureHandlerRootView style={{ display: "flex" }}>
    <NavigationContainer independent={true}>
      <Stack.Navigator initialRouteName="Login">
        <Stack.Screen
          name="Login"
          component={TrelloAuth}
          options={{
            //   headerTitleStyle: {
            //     color: "white",
            //   },
            //   headerStyle: {
            //     backgroundColor: "#2684FF",
            headerShown: false,
            //   },
          }}
        />
        <Stack.Screen
          name="AddBoard"
          component={AddBoard}
          options={{
            headerTitleStyle: {
              color: "white",
            },
            headerStyle: {
              backgroundColor: "#2684FF",
            },
          }}
        />
        <Stack.Screen
          name="Home"
          component={HomeScreen}
          options={{
            headerTitleStyle: {
              color: "white",
            },
            headerStyle: {
              backgroundColor: "#2684FF",
            },
          }}
        />
        <Stack.Screen
          name="Board"
          component={BoardScreen}
          options={{
            headerTitleStyle: {
              color: "white",
            },
            headerStyle: {
              backgroundColor: "#2684FF",
            },
          }}
        />
        <Stack.Screen
          name="Workspace"
          component={Workspaces}
          options={{
            // headerLeft: () => (
            //   <Image
            //     source={require("@/assets/images/login/slack.png")}
            //     style={{ width: 30, height: 30, borderRadius: 20 }}
            //   />
            // ),
            headerTitle: () => (
              <Text
                style={{
                  alignItems: "center",
                  textAlign: "center",
                  color: "white",
                  // marginLeft: 30,
                  fontSize: 20,
                }}
              >
                My Workspaces
              </Text>
            ),
            headerTitleStyle: {
              color: "white",
            },
            headerStyle: {
              backgroundColor: "#2684FF",
            },
          }}
        />
        <Stack.Screen name="Lists" component={TrelloLists} />
        {/* <Stack.Screen name="List" component={Alist} /> */}
      </Stack.Navigator>
    </NavigationContainer>
    // </GestureHandlerRootView>

    // import React from "react";
    // export default function Index() {
    //   return (
    //     <Workspaces/>
    // >>>>>>> origin/feat_oauth_workspace
  );
}
