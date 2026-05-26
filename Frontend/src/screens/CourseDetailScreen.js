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

  // DELETE LESSON
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
    <View style={{ flex: 1, backgroundColor: "#F4F6FF" }}>
      
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
        <Text
          style={{
            color: "#D6D1FF",
            fontSize: 13,
            fontWeight: "600"
          }}
        >
          COURSE
        </Text>

        <Text
          style={{
            color: "#FFFFFF",
            fontSize: 28,
            fontWeight: "800",
            marginTop: 8
          }}
        >
          {course.title}
        </Text>

        <Text
          style={{
            color: "#E5E2FF",
            marginTop: 10,
            lineHeight: 22,
            fontSize: 14
          }}
        >
          {course.description || "No description available"}
        </Text>

        {/* CATEGORY */}
        <View
          style={{
            alignSelf: "flex-start",
            backgroundColor: "rgba(255,255,255,0.2)",
            paddingHorizontal: 14,
            paddingVertical: 6,
            borderRadius: 20,
            marginTop: 16
          }}
        >
          <Text
            style={{
              color: "#fff",
              fontWeight: "700",
              fontSize: 12
            }}
          >
            {course.category || "General"}
          </Text>
        </View>
      </View>

      {/* CONTENT */}
      <ScrollView
        contentContainerStyle={{
          padding: 20,
          paddingBottom: 50
        }}
        showsVerticalScrollIndicator={false}
      >

        {/* ADD LESSON */}
        {user?.role === "teacher" && (
          <TouchableOpacity
            onPress={() =>
              navigation.navigate("AddLesson", {
                courseId: course.id
              })
            }
            activeOpacity={0.85}
            style={{
              backgroundColor: "#6C63FF",
              paddingVertical: 16,
              borderRadius: 18,
              alignItems: "center",
              marginBottom: 24,
              elevation: 5,
              flexDirection: "row",
              justifyContent: "center"
            }}
          >
            <Ionicons
              name="add-circle-outline"
              size={20}
              color="#fff"
            />

            <Text
              style={{
                color: "#fff",
                fontWeight: "800",
                marginLeft: 8,
                fontSize: 15
              }}
            >
              Add Lesson
            </Text>
          </TouchableOpacity>
        )}

        {/* SECTION TITLE */}
        <View
          style={{
            flexDirection: "row",
            alignItems: "center",
            marginBottom: 14
          }}
        >
          <Ionicons
            name="library-outline"
            size={22}
            color="#6C63FF"
          />

          <Text
            style={{
              fontSize: 18,
              fontWeight: "800",
              color: "#1E1E2D",
              marginLeft: 8
            }}
          >
            Lessons
          </Text>
        </View>

        {/* LOADING */}
        {loading ? (
          <ActivityIndicator
            size="large"
            color="#6C63FF"
            style={{ marginTop: 20 }}
          />
        ) : lessons.length === 0 ? (
          <View
            style={{
              backgroundColor: "#fff",
              padding: 30,
              borderRadius: 20,
              alignItems: "center"
            }}
          >
            <Ionicons
              name="document-text-outline"
              size={40}
              color="#B8B8D2"
            />

            <Text
              style={{
                marginTop: 10,
                color: "#8E8EA0",
                fontWeight: "600"
              }}
            >
              No lessons added yet
            </Text>
          </View>
        ) : (
          lessons.map((lesson, index) => (
            <TouchableOpacity
              key={lesson.id}
              activeOpacity={0.85}
              onPress={() =>
                navigation.navigate("LessonPlayer", {
                  lesson
                })
              }
              style={{
                backgroundColor: "#FFFFFF",
                borderRadius: 20,
                padding: 18,
                marginBottom: 16,
                elevation: 4
              }}
            >
              <View
                style={{
                  flexDirection: "row",
                  justifyContent: "space-between",
                  alignItems: "center"
                }}
              >
                {/* LEFT */}
                <View
                  style={{
                    flexDirection: "row",
                    alignItems: "center",
                    flex: 1
                  }}
                >
                  <View
                    style={{
                      width: 52,
                      height: 52,
                      borderRadius: 16,
                      backgroundColor: "#EEEAFE",
                      alignItems: "center",
                      justifyContent: "center",
                      marginRight: 14
                    }}
                  >
                    <Ionicons
                      name="play-circle"
                      size={28}
                      color="#6C63FF"
                    />
                  </View>

                  <View style={{ flex: 1 }}>
                    <Text
                      style={{
                        fontSize: 16,
                        fontWeight: "800",
                        color: "#1E1E2D"
                      }}
                      numberOfLines={1}
                    >
                      {lesson.title}
                    </Text>

                    <Text
                      style={{
                        marginTop: 4,
                        color: "#8E8EA0",
                        fontSize: 13
                      }}
                      numberOfLines={2}
                    >
                      {lesson.content || "No lesson content"}
                    </Text>
                  </View>
                </View>

                {/* DELETE */}
                {user?.role === "teacher" && (
                  <TouchableOpacity
                    onPress={() =>
                      handleDeleteLesson(lesson.id)
                    }
                    style={{
                      marginLeft: 12
                    }}
                  >
                    <Ionicons
                      name="trash-outline"
                      size={22}
                      color="#FF4D4D"
                    />
                  </TouchableOpacity>
                )}
              </View>

              {/* FOOTER */}
              <View
                style={{
                  flexDirection: "row",
                  alignItems: "center",
                  marginTop: 16
                }}
              >
                <Ionicons
                  name="time-outline"
                  size={15}
                  color="#8E8EA0"
                />

                <Text
                  style={{
                    marginLeft: 6,
                    fontSize: 12,
                    color: "#8E8EA0"
                  }}
                >
                  Lesson {index + 1}
                </Text>
              </View>
            </TouchableOpacity>
          ))
        )}
      </ScrollView>
    </View>
  );
}