import Constants from "expo-constants";
import React, { useState } from "react";
import { StatusBar } from "expo-status-bar";
import { StyleSheet, Text, View, TextInput, Button, Alert } from "react-native";

export default function App() {
  // State to store user input
  const [userPrompt, setUserPrompt] = useState("");
  // State to store response from API
  const [apiResponse, setApiResponse] = useState("");

  // Function to handle the button press
  const handleButtonPress = async () => {
    if (userPrompt.trim() === "") {
      Alert.alert("Error", "Please enter a prompt");
      return;
    }
    // Call OpenAI API
    try {
      const apiKey = Constants.manifest.extra.openaiApiKey;
      console.log("API Key: ", apiKey);
      const response = await fetch("https://api.openai.com/v1/completions", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${apiKey}`,
        },
        body: JSON.stringify({
          model: 'text-davinci-003',
          prompt: userPrompt,
          max_tokens: 200,
        }),
      });

      console.log("Response: ", response);

      if (!response.ok) {
        console.error("Non-successful HTTP status code: ", response.status);
        Alert.alert("Error", "Non-successful HTTP status code");
        return;
    }

    const data = await response.json();
    console.log("Data:", data);

    if (data && data.choices && data.choices.length > 0) {
        setApiResponse(data.choices[0].text);
    } else {
        console.error("Unexpected response format");
        Alert.alert("Error", "Unexpected response format");
    }

} catch (error) {
    console.error("Error fetching data: ", error);
    Alert.alert("Error", "Something went wrong");
}
};

  return (
    <View style={styles.container}>
      <TextInput
        style={styles.input}
        placeholder="Enter your prompt"
        value={userPrompt}
        onChangeText={(text) => setUserPrompt(text)}
      />

      <Button title="Submit" onPress={handleButtonPress} />

      {apiResponse ? (
        <Text style={styles.responseText}>Response: {apiResponse}</Text>
      ) : null}

      <StatusBar style="auto" />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff",
    alignItems: "center",
    justifyContent: "center",
  },
  input: {
    width: 200,
    borderBottomWidth: 1,
    margin: 10,
    padding: 5,
  },
  responseText: {
    marginTop: 20,
    fontSize: 16,
  },
});
