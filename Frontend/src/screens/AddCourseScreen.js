import React, { useState } from "react";
import { View, Text, TextInput, TouchableOpacity } from "react-native";
import api from "../api/axios";

export default function AddCourseScreen({ navigation }) {
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [category, setCategory] = useState("");

  const handleCreate = async () => {
    try {
      await api.post("/courses", {
        title,
        description,
        category
      });

      alert("Course Created ✅");
      navigation.goBack();
    } catch (err) {
      console.log(err);
      alert("Error creating course");
    }
  };

  return (
    <View style={{ flex: 1, padding: 20 }}>
      <Text style={{ fontSize: 20, fontWeight: "bold", marginBottom: 20 }}>
        Create Course
      </Text>

      <TextInput placeholder="Title" value={title} onChangeText={setTitle} style={{ borderWidth: 1, marginBottom: 10, padding: 10 }} />
      <TextInput placeholder="Description" value={description} onChangeText={setDescription} style={{ borderWidth: 1, marginBottom: 10, padding: 10 }} />
      <TextInput placeholder="Category" value={category} onChangeText={setCategory} style={{ borderWidth: 1, marginBottom: 20, padding: 10 }} />

      <TouchableOpacity onPress={handleCreate} style={{ backgroundColor: "#6C63FF", padding: 15 }}>
        <Text style={{ color: "#fff", textAlign: "center" }}>Create</Text>
      </TouchableOpacity>
    </View>
  );
}