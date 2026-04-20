import React, { useState } from "react";
import { View, Text, TextInput, TouchableOpacity } from "react-native";
import api from "../api/axios";

export default function AddLessonScreen({ route, navigation }) {
  const { courseId } = route.params;
  console.log("CourseId:", courseId);

  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");
  const [videoUrl, setVideoUrl] = useState("");

  const handleAddLesson = async () => {
    try {
      await api.post("/lessons", {
        title,
        content,
        videoUrl,
        courseId
      });

      alert("Lesson Added ✅");
      navigation.goBack();
    } catch (err) {
      console.log(err);
      alert("Error adding lesson");
    }
  };
  return (
    <View style={{ flex: 1, padding: 20 }}>
      <Text style={{ fontSize: 20, fontWeight: "bold", marginBottom: 20 }}>
        Add Lesson
      </Text>

      <TextInput placeholder="Title" value={title} onChangeText={setTitle} style={{ borderWidth: 1, marginBottom: 10, padding: 10 }} />
      <TextInput placeholder="Content" value={content} onChangeText={setContent} style={{ borderWidth: 1, marginBottom: 10, padding: 10 }} />
      <TextInput placeholder="Video URL" value={videoUrl} onChangeText={setVideoUrl} style={{ borderWidth: 1, marginBottom: 20, padding: 10 }} />

      <TouchableOpacity onPress={handleAddLesson} style={{ backgroundColor: "#6C63FF", padding: 15 }}>
        <Text style={{ color: "#fff", textAlign: "center" }}>Add Lesson</Text>
      </TouchableOpacity>
    </View>
    
  );
}
