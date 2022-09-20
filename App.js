import React, { useState } from "react";
import {
  StyleSheet,
  Text,
  View,
  TouchableOpacity,
  FlatList,
  Image,
  Alert,
} from "react-native";

import { NavigationContainer } from "@react-navigation/native";
import { createNativeStackNavigator } from "@react-navigation/native-stack";

let bg_color = "sandybrown";

const pin_images = [];
pin_images[0] = require("./pics/pin1.png");
pin_images[1] = require("./pics/pin2.png");
pin_images[2] = require("./pics/pin3.png");
pin_images[3] = require("./pics/pin4.png");
pin_images[4] = require("./pics/pin6.png");
pin_images[5] = require("./pics/pin7.png");
pin_images[6] = require("./pics/pin5.png");
pin_images[7] = require("./pics/pin8.png");

function visualize_pins(pins) {
  let pin_elements = [];
  for (let pin of pins) {
    pin_elements.push(
      <Image source={pin_images[pin]} style={styles.image_style2} />
    );
  }
  return <View style={{ flexDirection: "row" }}>{pin_elements}</View>;
}

let hidden_pins = getRandomPins();

export default function App() {
  const stack = createNativeStackNavigator();
  return (
    <NavigationContainer>
      <stack.Navigator>
        <stack.Screen name="Easy Mastermind" component={Home} />
        <stack.Screen name="Game" component={Game} />
        <stack.Screen name="Settings" component={Settings} />
        <stack.Screen name="About" component={About} />
      </stack.Navigator>
    </NavigationContainer>
  );
}

function Home({ navigation }) {
  return (
    <View style={styles.container}>
      <TouchableOpacity
        onPress={() => {
          navigation.navigate("Game");
        }}
      >
        <Text style={styles.text}>Start the Game</Text>
      </TouchableOpacity>
      <TouchableOpacity
        onPress={() => {
          navigation.navigate("Settings");
        }}
      >
        <Text style={styles.text}>Settings</Text>
      </TouchableOpacity>
      <TouchableOpacity
        onPress={() => {
          navigation.navigate("About");
        }}
      >
        <Text style={styles.text}>About</Text>
      </TouchableOpacity>
    </View>
  );
}

function About({ navigation }) {
  let your_name = "Your Name";
  return (
    <View style={styles.container}>
      <Text style={styles.text}>
        This app was completed by {"\n"}
        {your_name}
      </Text>
    </View>
  );
}

function Settings({ navigation }) {
  let [curr_bg_color, set_curr_bg] = useState(bg_color);
  return (
    <View style={styles.container}>
      <Text style={styles.text}>Change Game Board's Color:</Text>
      <View style={{ height: 10 }} />
      <TouchableOpacity
        onPress={() => {
          (bg_color = "sandybrown"), set_curr_bg(bg_color);
        }}
      >
        <Text style={styles.text}>Sandy Brown</Text>
      </TouchableOpacity>
      <TouchableOpacity
        onPress={() => {
          (bg_color = "green"), set_curr_bg(bg_color);
        }}
      >
        <Text style={styles.text}>Green</Text>
      </TouchableOpacity>
      <TouchableOpacity
        onPress={() => {
          (bg_color = "white"), set_curr_bg(bg_color);
        }}
      >
        <Text style={styles.text}>White</Text>
      </TouchableOpacity>
      <TouchableOpacity
        onPress={() => {
          (bg_color = "red"), set_curr_bg(bg_color);
        }}
      >
        <Text style={styles.text}>Red</Text>
      </TouchableOpacity>
      <View style={{ height: 30 }} />
      <Text style={styles.text}>Selected Color:</Text>
      <View
        style={{
          width: 30,
          height: 30,
          backgroundColor: curr_bg_color,
          borderWidth: 3,
        }}
      />
    </View>
  );
}

function getRandomPins() {
  let random_pins = [1, 2, 3, 4];
  //Task III (Put the right code in this function)
  let array = [];
  for (let i = 0; i < 4; i++) {
    do {
      var pick = array[Math.floor(Math.random() * 6)];
    } while (array.includes(pick));
    random_pins.push(pick);
  }
  return random_pins;
}

function Game({ navigation }) {
  const [history, setHistory] = useState([]);
  const [currPins, setCurrPins] = useState([]);
  const [responses, setResponses] = useState([]);

  function winFunc() {
    setResponses([]);
    setHistory([]);
    setCurrPins([]);
    hidden_pins = getRandomPins();
  }

  function click(clicked_pin) {
    if (currPins.length == 4) {
      setHistory([{ currPins, responses }, ...history]);
      //update pins
      setCurrPins([clicked_pin]);
      let curr_pin_index = 0;
      //update responses
      if (hidden_pins[curr_pin_index] == clicked_pin) setResponses([7]);
      else if (hidden_pins.indexOf(clicked_pin) != -1) setResponses([6]);
      else setResponses([]);
    } else if (currPins.indexOf(clicked_pin) == -1) {
      //update pins
      let curr_pin_index = currPins.length;
      setCurrPins([...currPins, clicked_pin]);

      //update responses
      let new_responses;
      if (hidden_pins[curr_pin_index] == clicked_pin)
        new_responses = [...responses, 7];
      else if (hidden_pins.indexOf(clicked_pin) != -1)
        new_responses = [...responses, 6];
      else new_responses = responses;

      setResponses(new_responses);

      if (new_responses.length == 4)
        if (
          responses[0] == 7 &&
          responses[1] == 7 &&
          responses[2] == 7 &&
          new_responses[3] == 7
        ) {
          Alert.alert("Easy Matermind", "You Won!!!", [
            { text: "OK", onPress: winFunc },
          ]);
        }
    }
  }

  return (
    <View style={{ backgroundColor: bg_color, flex: 1 }}>
      <View style={{ flexDirection: "row", flex: 1 }}>
        <View style={{ flex: 3 }}>
          <View style={{ flex: 0.15 }}>
            <Text>Current Selection</Text>
            <FlatList
              data={currPins}
              horizontal={true}
              renderItem={({ item }) => (
                <Image source={pin_images[item]} style={styles.image_style2} />
              )}
            />
          </View>
          <View style={{ flex: 0.15 }}>
            <Text>Responses</Text>
            <FlatList
              data={responses}
              horizontal={true}
              renderItem={({ item }) => (
                <Image source={pin_images[item]} style={styles.image_style2} />
              )}
            />
          </View>
          <View style={{ flex: 0.7 }}>
            <Text>Game History</Text>
            <FlatList
              style={{ flex: 1 }}
              data={history}
              renderItem={({ item }) => {
                return (
                  <View>
                    <View style={{ backgroundColor: "black", height: 5 }} />
                    {visualize_pins(item.currPins)}
                    <View style={{ backgroundColor: "white", height: 1 }} />
                    {visualize_pins(item.responses)}
                  </View>
                );
              }}
            />
          </View>
        </View>
        <View style={{ flex: 2, backgroundColor: "green" }}>
          <Image
            source={require("./pics/mastermind.png")}
            style={{ resizeMode: "stretch", flex: 1, width: "auto" }}
          />
        </View>
      </View>
      <View style={{ flex: 0.1, flexDirection: "row" }}>
        <TouchableOpacity
          activeOpacity={0.5}
          style={{ flex: 1 }}
          onPress={() => {
            click(0);
          }}
        >
          <Image source={pin_images[0]} style={styles.image_style1} />
        </TouchableOpacity>
        <TouchableOpacity
          activeOpacity={0.5}
          style={{ flex: 1 }}
          onPress={() => {
            click(1);
          }}
        >
          <Image source={pin_images[1]} style={styles.image_style1} />
        </TouchableOpacity>
        <TouchableOpacity
          activeOpacity={0.5}
          style={{ flex: 1 }}
          onPress={() => {
            click(2);
          }}
        >
          <Image source={pin_images[2]} style={styles.image_style1} />
        </TouchableOpacity>
        <TouchableOpacity
          activeOpacity={0.5}
          style={{ flex: 1 }}
          onPress={() => {
            click(3);
          }}
        >
          <Image source={pin_images[3]} style={styles.image_style1} />
        </TouchableOpacity>
        <TouchableOpacity
          activeOpacity={0.5}
          style={{ flex: 1 }}
          onPress={() => {
            click(4);
          }}
        >
          <Image source={pin_images[4]} style={styles.image_style1} />
        </TouchableOpacity>
        <TouchableOpacity
          activeOpacity={0.5}
          style={{ flex: 1 }}
          onPress={() => {
            click(5);
          }}
        >
          <Image source={pin_images[5]} style={styles.image_style1} />
        </TouchableOpacity>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  text: {
    fontSize: 24,
  },
  container: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: "sandybrown",
  },
  full_row_style: {
    flexDirection: "row",
    flex: 0.07,
  },
  image_style1: {
    flex: 1,
    resizeMode: "stretch",
    width: "auto",
  },
  image_style2: {
    resizeMode: "stretch",
    width: 58,
    height: 58,
  },
});
