import React from "react";
import {
  View,
  Text,
  ScrollView,
  TouchableOpacity,
  Linking
} from "react-native";
import { Ionicons } from "@expo/vector-icons";

export default function LessonPlayerScreen({ route }) {
  const { lesson } = route.params;

  const openVideo = () => {
    if (lesson.videoUrl) {
      Linking.openURL(lesson.videoUrl);
    }
  };

  return (
    <View style={{ flex: 1, backgroundColor: "#F0F4FF" }}>
      
      {/* HEADER */}
      <View
        style={{
          backgroundColor: "#6C63FF",
          paddingTop: 70,
          paddingBottom: 30,
          paddingHorizontal: 20,
          borderBottomLeftRadius: 30,
          borderBottomRightRadius: 30,
          elevation: 10
        }}
      >
        <Text style={{ color: "#C4BFFF", fontSize: 13 }}>
          Lesson
        </Text>

        <Text
          style={{
            color: "#FFFFFF",
            fontSize: 24,
            fontWeight: "800",
            marginTop: 5
          }}
        >
          {lesson.title}
        </Text>
      </View>

      {/* CONTENT */}
      <ScrollView contentContainerStyle={{ padding: 20 }}>
        
        {/* CONTENT CARD */}
        <View
          style={{
            backgroundColor: "#FFFFFF",
            borderRadius: 20,
            padding: 20,
            marginTop: -40,
            elevation: 5
          }}
        >
          <Text
            style={{
              fontSize: 16,
              fontWeight: "700",
              color: "#1E1E2D",
              marginBottom: 10
            }}
          >
            Lesson Content 📘
          </Text>

          <Text
            style={{
              fontSize: 14,
              color: "#555",
              lineHeight: 22
            }}
          >
            {lesson.content || "No content available."}
          </Text>
        </View>

        {/* VIDEO SECTION */}
        <View style={{ marginTop: 20 }}>
          <Text
            style={{
              fontSize: 16,
              fontWeight: "700",
              color: "#1E1E2D",
              marginBottom: 10
            }}
          >
            Video 🎥
          </Text>

          {lesson.videoUrl ? (
            <TouchableOpacity
              onPress={openVideo}
              style={{
                backgroundColor: "#6C63FF",
                padding: 16,
                borderRadius: 14,
                flexDirection: "row",
                alignItems: "center",
                justifyContent: "center"
              }}
            >
              <Ionicons name="play-circle" size={20} color="#fff" />
              <Text
                style={{
                  color: "#fff",
                  marginLeft: 8,
                  fontWeight: "700"
                }}
              >
                Watch Video
              </Text>
            </TouchableOpacity>
          ) : (
            <Text style={{ color: "#8E8EA0" }}>
              No video available
            </Text>
          )}
        </View>

        {/* RAW LINK (OPTIONAL) */}
        {lesson.videoUrl && (
          <Text
            style={{
              marginTop: 10,
              fontSize: 12,
              color: "#6C63FF"
            }}
            numberOfLines={1}
          >
            {lesson.videoUrl}
          </Text>
        )}
      </ScrollView>
    </View>
  );
}