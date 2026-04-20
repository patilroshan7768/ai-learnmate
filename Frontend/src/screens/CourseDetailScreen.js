import React, { useEffect, useState } from "react";
import {
  View,
  Text,
  ScrollView,
  TouchableOpacity,
  ActivityIndicator,
  Alert
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import api from "../api/axios";
import { useAuth } from "../context/AuthContext";

export default function CourseDetailScreen({ route, navigation }) {
  const { course } = route.params;
  const { user } = useAuth();

  const [loading, setLoading] = useState(false);
  const [lessons, setLessons] = useState([]);

  useEffect(() => {
    fetchLessons();
  }, []);

  const fetchLessons = async () => {
    try {
      setLoading(true);
      const res = await api.get(`/lessons/${course.id}`);
      setLessons(res.data.data || []);
    } catch (err) {
      console.log("Fetch error:", err);
    } finally {
      setLoading(false);
    }
  };

  // 🔥 DELETE LESSON
  const handleDeleteLesson = (lessonId) => {
    Alert.alert(
      "Delete Lesson",
      "Are you sure you want to delete this lesson?",
      [
        { text: "Cancel" },
        {
          text: "Delete",
          onPress: async () => {
            try {
              await api.delete(`/lessons/${lessonId}`);
              setLessons((prev) =>
                prev.filter((l) => l.id !== lessonId)
              );
            } catch (err) {
              console.log(err);
              alert("Delete failed");
            }
          }
        }
      ]
    );
  };

  return (
    <View style={{ flex: 1, backgroundColor: "#F0F4FF" }}>
      
      {/* HEADER */}
      <View
        style={{
          backgroundColor: "#6C63FF",
          paddingTop: 70,
          paddingBottom: 40,
          paddingHorizontal: 20,
          borderBottomLeftRadius: 30,
          borderBottomRightRadius: 30,
          elevation: 10
        }}
      >
        <Text style={{ color: "#C4BFFF", fontSize: 13 }}>Course</Text>

        <Text
          style={{
            color: "#FFFFFF",
            fontSize: 24,
            fontWeight: "800",
            marginTop: 5
          }}
        >
          {course.title}
        </Text>
      </View>

      {/* CONTENT */}
      <ScrollView contentContainerStyle={{ padding: 20 }}>
        
        {/* COURSE INFO */}
        <View
          style={{
            backgroundColor: "#FFFFFF",
            borderRadius: 20,
            padding: 20,
            marginTop: -40,
            elevation: 5
          }}
        >
          <Text style={{ fontSize: 14, color: "#1E1E2D" }}>
            {course.description || "No description available."}
          </Text>
        </View>

        {/* ADD LESSON BUTTON (TEACHER) */}
        {user?.role === "teacher" && (
          <TouchableOpacity
            onPress={() =>
              navigation.navigate("AddLesson", { courseId: course.id })
            }
            style={{
              backgroundColor: "#6C63FF",
              padding: 14,
              borderRadius: 14,
              alignItems: "center",
              marginTop: 20
            }}
          >
            <Text style={{ color: "#fff", fontWeight: "700" }}>
              + Add Lesson
            </Text>
          </TouchableOpacity>
        )}

        {/* LESSONS */}
        <View style={{ marginTop: 25 }}>
          <Text style={{ fontSize: 16, fontWeight: "800", marginBottom: 10 }}>
            Lessons
          </Text>

          {loading ? (
            <ActivityIndicator color="#6C63FF" />
          ) : lessons.length === 0 ? (
            <Text style={{ color: "#8E8EA0" }}>No lessons yet</Text>
          ) : (
            lessons.map((lesson) => (
              <View
                key={lesson.id}
                style={{
                  backgroundColor: "#fff",
                  padding: 14,
                  borderRadius: 12,
                  marginBottom: 10,
                  flexDirection: "row",
                  alignItems: "center",
                  justifyContent: "space-between"
                }}
              >
                {/* CLICKABLE */}
                <TouchableOpacity
                  style={{ flexDirection: "row", alignItems: "center" }}
                  onPress={() =>
                    navigation.navigate("LessonPlayer", { lesson })
                  }
                >
                  <Ionicons
                    name="play-circle-outline"
                    size={22}
                    color="#6C63FF"
                  />
                  <Text style={{ marginLeft: 10, fontWeight: "600" }}>
                    {lesson.title}
                  </Text>
                </TouchableOpacity>

                {/* DELETE BUTTON (ONLY TEACHER) */}
                {user?.role === "teacher" && (
                  <TouchableOpacity
                    onPress={() => handleDeleteLesson(lesson.id)}
                  >
                    <Ionicons
                      name="trash-outline"
                      size={20}
                      color="#FF4D4D"
                    />
                  </TouchableOpacity>
                )}
              </View>
            ))
          )}
        </View>
      </ScrollView>
    </View>
  );
}