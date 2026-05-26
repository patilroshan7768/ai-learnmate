import React, { useState } from "react";
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  ScrollView,
  KeyboardAvoidingView,
  Platform
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
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
    <KeyboardAvoidingView
      behavior={Platform.OS === "ios" ? "padding" : undefined}
      style={{ flex: 1, backgroundColor: "#F0F4FF" }}
    >
      <ScrollView
        contentContainerStyle={{ paddingBottom: 40 }}
        showsVerticalScrollIndicator={false}
      >
        {/* HEADER */}
        <View
          style={{
            backgroundColor: "#6C63FF",
            paddingTop: 70,
            paddingBottom: 35,
            paddingHorizontal: 24,
            borderBottomLeftRadius: 32,
            borderBottomRightRadius: 32,
            elevation: 10
          }}
        >
          <View
            style={{
              width: 70,
              height: 70,
              borderRadius: 20,
              backgroundColor: "rgba(255,255,255,0.2)",
              alignItems: "center",
              justifyContent: "center",
              marginBottom: 18
            }}
          >
            <Ionicons name="book-outline" size={34} color="#fff" />
          </View>

          <Text
            style={{
              color: "#fff",
              fontSize: 28,
              fontWeight: "800"
            }}
          >
            Create Course
          </Text>

          <Text
            style={{
              color: "#D9D6FF",
              marginTop: 8,
              fontSize: 14
            }}
          >
            Add a new learning course for students 🚀
          </Text>
        </View>

        {/* FORM CARD */}
        <View
          style={{
            backgroundColor: "#FFFFFF",
            marginHorizontal: 20,
            marginTop: -25,
            borderRadius: 24,
            padding: 22,
            elevation: 6
          }}
        >
          {/* TITLE */}
          <Text
            style={{
              fontSize: 14,
              fontWeight: "700",
              color: "#1E1E2D",
              marginBottom: 8
            }}
          >
            Course Title
          </Text>

          <TextInput
            placeholder="Enter course title"
            value={title}
            onChangeText={setTitle}
            placeholderTextColor="#A0A0B2"
            style={{
              backgroundColor: "#F8F9FF",
              borderRadius: 14,
              paddingHorizontal: 16,
              paddingVertical: 14,
              marginBottom: 18,
              fontSize: 14,
              borderWidth: 1,
              borderColor: "#E8EAFF"
            }}
          />

          {/* CATEGORY */}
          <Text
            style={{
              fontSize: 14,
              fontWeight: "700",
              color: "#1E1E2D",
              marginBottom: 8
            }}
          >
            Category
          </Text>

          <TextInput
            placeholder="AI / Web Dev / ML ..."
            value={category}
            onChangeText={setCategory}
            placeholderTextColor="#A0A0B2"
            style={{
              backgroundColor: "#F8F9FF",
              borderRadius: 14,
              paddingHorizontal: 16,
              paddingVertical: 14,
              marginBottom: 18,
              fontSize: 14,
              borderWidth: 1,
              borderColor: "#E8EAFF"
            }}
          />

          {/* DESCRIPTION */}
          <Text
            style={{
              fontSize: 14,
              fontWeight: "700",
              color: "#1E1E2D",
              marginBottom: 8
            }}
          >
            Description
          </Text>

          <TextInput
            placeholder="Write detailed course description..."
            value={description}
            onChangeText={setDescription}
            placeholderTextColor="#A0A0B2"
            multiline
            textAlignVertical="top"
            style={{
              backgroundColor: "#F8F9FF",
              borderRadius: 14,
              paddingHorizontal: 16,
              paddingTop: 16,
              height: 140,
              marginBottom: 24,
              fontSize: 14,
              borderWidth: 1,
              borderColor: "#E8EAFF"
            }}
          />

          {/* BUTTON */}
          <TouchableOpacity
            onPress={handleCreate}
            activeOpacity={0.8}
            style={{
              backgroundColor: "#6C63FF",
              paddingVertical: 16,
              borderRadius: 16,
              alignItems: "center",
              elevation: 4
            }}
          >
            <Text
              style={{
                color: "#FFFFFF",
                fontSize: 15,
                fontWeight: "800"
              }}
            >
              Create Course 
            </Text>
          </TouchableOpacity>
        </View>
      </ScrollView>
    </KeyboardAvoidingView>
  );
}