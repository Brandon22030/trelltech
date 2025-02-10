import { Colors } from "@/constants/Colors";
import { Stack } from "expo-router";

const Layout = () => {

    return (
        <Stack>
            <Stack.Screen
            name="Home"
            options={{
                headerStyle: {
                    backgroundColor: Colors.dark
                },
                headerBackTitleStyle: {
                    color: '#fff',
                }
            }}
            />
        </Stack>
    )

};

export default Layout;