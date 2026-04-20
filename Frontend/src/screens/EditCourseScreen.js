import React, { useState } from "react";
import {
  View,
  Text,
  TextInput,
  TouchableOpacity
} from "react-native";
import api from "../api/axios";

export default function EditCourseScreen({ route, navigation }) {
  const { course } = route.params;

  const [title, setTitle] = useState(course.title);
  const [description, setDescription] = useState(course.description || "");
  const [category, setCategory] = useState(course.category || "");

  const handleUpdate = async () => {
    try {
      await api.put(`/courses/${course.id}`, {
        title,
        description,
        category
      });

      alert("Course Updated ✅");
      navigation.goBack();
    } catch (err) {
      console.log(err);
      alert("Update failed");
    }
  };

  return (
    <View style={{ flex: 1, padding: 20 }}>
      <Text style={{ fontSize: 20, fontWeight: "bold", marginBottom: 20 }}>
        Edit Course
      </Text>

      <TextInput
        placeholder="Title"
        value={title}
        onChangeText={setTitle}
        style={{ borderWidth: 1, marginBottom: 10, padding: 10 }}
      />

      <TextInput
        placeholder="Description"
        value={description}
        onChangeText={setDescription}
        style={{ borderWidth: 1, marginBottom: 10, padding: 10 }}
      />

      <TextInput
        placeholder="Category"
        value={category}
        onChangeText={setCategory}
        style={{ borderWidth: 1, marginBottom: 20, padding: 10 }}
      />

      <TouchableOpacity
        onPress={handleUpdate}
        style={{ backgroundColor: "#6C63FF", padding: 15 }}
      >
        <Text style={{ color: "#fff", textAlign: "center" }}>
          Update Course
        </Text>
      </TouchableOpacity>
    </View>
  );
}