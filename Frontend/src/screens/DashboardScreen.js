import React, { useEffect, useState } from "react";
import {
  View, Text, ScrollView, TouchableOpacity,
  RefreshControl, ActivityIndicator
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { useAuth } from "../context/AuthContext";
import api from "../api/axios";
import SoftCard from "../components/SoftCard";
import Toast from "react-native-toast-message";
import { Alert } from "react-native";

const STAT_COLORS = ["#6C63FF", "#48CAE4", "#4CC9A0", "#FFB347"];

function getGreeting() {
  const h = new Date().getHours();
  if (h < 12) return "Morning";
  if (h < 17) return "Afternoon";
  return "Evening";
}

export default function DashboardScreen({ navigation }) {
  const { user } = useAuth();
  const [courses, setCourses] = useState([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);

  const fetchCourses = async () => {
    try {
      const res = await api.get("/courses");
      setCourses(res.data.data.courses || []);
    } catch (err) {
      Toast.show({ type: "error", text1: "Failed to load courses", text2: err.message });
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };

  useEffect(() => { fetchCourses(); }, []);
  const onRefresh = () => { setRefreshing(true); fetchCourses(); };

  const stats = [
    { label: "Courses", value: courses.length, icon: "book" },
    { label: "Role", value: user?.role === "teacher" ? "Teacher" : "Student", icon: "person" },
    { label: "AI Tools", value: "3", icon: "flash" },
    { label: "Status", value: "Active", icon: "checkmark-circle" }
  ];

  const quickActions = [
    { label: "Transcribe Audio", icon: "mic", color: "#6C63FF", screen: "AI Tools" },
    { label: "For You", icon: "bulb", color: "#FFB347", screen: "Recommendations" },
    { label: "My Profile", icon: "person-circle", color: "#4CC9A0", screen: "Profile" }
  ];

  const handleDeleteCourse = (courseId) => {
  Alert.alert(
    "Delete Course",
    "Are you sure you want to delete this course?",
    [
      { text: "Cancel" },
      {
        text: "Delete",
        onPress: async () => {
          try {
            await api.delete(`/courses/${courseId}`);
            setCourses((prev) =>
              prev.filter((c) => c.id !== courseId)
            );
          } catch (err) {
            console.log(err);
            Toast.show({
              type: "error",
              text1: "Delete failed",
              text2: err.message
            });
          }
        }
      }
    ]
  );
};

  return (
    <View style={{ flex: 1, backgroundColor: "#F0F4FF" }}>
      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={{ paddingBottom: 100 }}
        refreshControl={
          <RefreshControl refreshing={refreshing} onRefresh={onRefresh} colors={["#6C63FF"]} />
        }
      >
        {/* Header */}
        <View
          style={{
            backgroundColor: "#6C63FF", paddingTop: 60, paddingBottom: 36,
            paddingHorizontal: 24, borderBottomLeftRadius: 32, borderBottomRightRadius: 32,
            shadowColor: "#6C63FF", shadowOffset: { width: 0, height: 10 },
            shadowOpacity: 0.4, shadowRadius: 20, elevation: 12
          }}
        >
          <View style={{ flexDirection: "row", justifyContent: "space-between", alignItems: "center" }}>
            <View>
              <Text style={{ color: "#C4BFFF", fontSize: 13, fontWeight: "600" }}>
                Good {getGreeting()} 👋
              </Text>
              <Text style={{ color: "#FFFFFF", fontSize: 22, fontWeight: "800", marginTop: 2 }}>
                {user?.name?.split(" ")[0] || "Learner"}
              </Text>
            </View>
            <View style={{
              width: 48, height: 48, borderRadius: 16,
              backgroundColor: "rgba(255,255,255,0.2)",
              alignItems: "center", justifyContent: "center"
            }}>
              <Ionicons name="notifications-outline" size={22} color="#FFFFFF" />
            </View>
          </View>

          <View style={{ flexDirection: "row", flexWrap: "wrap", gap: 10, marginTop: 24 }}>
            {stats.map((s, i) => (
              <View key={i} style={{
                flex: 1, minWidth: "44%",
                backgroundColor: "rgba(255,255,255,0.15)",
                borderRadius: 16, padding: 14,
                borderWidth: 1, borderColor: "rgba(255,255,255,0.2)"
              }}>
                <Ionicons name={s.icon} size={18} color="#C4BFFF" />
                <Text style={{ color: "#FFFFFF", fontSize: 16, fontWeight: "800", marginTop: 6 }}>
                  {s.value}
                </Text>
                <Text style={{ color: "#C4BFFF", fontSize: 11, marginTop: 2 }}>{s.label}</Text>
              </View>
            ))}
          </View>
        </View>

        
        <View style={{ paddingHorizontal: 20, marginTop: 24 }}>
          <Text style={{ fontSize: 16, fontWeight: "800", color: "#1E1E2D", marginBottom: 14 }}>
            Quick Actions
          </Text>
          <View style={{ flexDirection: "row", gap: 10, marginBottom: 28 }}>
            {quickActions.map((a, i) => (
              <TouchableOpacity
                key={i}
                onPress={() => navigation.navigate(a.screen)}
                style={{ flex: 1 }}
                activeOpacity={0.8}
              >
                <SoftCard style={{ alignItems: "center", padding: 16 }}>
                  <View style={{
                    width: 44, height: 44, borderRadius: 14,
                    backgroundColor: a.color + "20",
                    alignItems: "center", justifyContent: "center", marginBottom: 8
                  }}>
                    <Ionicons name={a.icon} size={22} color={a.color} />
                  </View>
                  <Text style={{ fontSize: 11, fontWeight: "700", color: "#1E1E2D", textAlign: "center" }}>
                    {a.label}
                  </Text>
                </SoftCard>
              </TouchableOpacity>
            ))}
          </View>
          {/* ✅ Create Course Button (Teacher only) */}
          {user?.role === "teacher" && (
            <TouchableOpacity
              onPress={() => navigation.navigate("AddCourse")}
              style={{
                backgroundColor: "#6C63FF",
                padding: 14,
                borderRadius: 12,
                marginBottom: 20,
                alignItems: "center"
              }}
            >
              <Text style={{ color: "#fff", fontWeight: "700" }}>
                + Create Course
              </Text>
            </TouchableOpacity>
          )}          

          <View style={{ flexDirection: "row", justifyContent: "space-between", alignItems: "center", marginBottom: 14 }}>
            <Text style={{ fontSize: 16, fontWeight: "800", color: "#1E1E2D" }}>All Courses</Text>
            <Text style={{ fontSize: 12, color: "#8E8EA0" }}>{courses.length} courses</Text>
          </View>

          {loading ? (
            <ActivityIndicator color="#6C63FF" size="large" style={{ marginTop: 30 }} />
          ) : courses.length === 0 ? (
            <SoftCard style={{ alignItems: "center", padding: 32 }}>
              <Ionicons name="book-outline" size={40} color="#C4BFFF" />
              <Text style={{ color: "#8E8EA0", marginTop: 12, fontSize: 14, textAlign: "center" }}>
                No courses yet.{"\n"}Check back later!
              </Text>
            </SoftCard>
          ) : (
            courses.map((course, i) => (
              <TouchableOpacity
  key={course.id}
  onPress={() => navigation.navigate("CourseDetail", { course })}
  activeOpacity={0.8}
>
  <SoftCard style={{ marginBottom: 14 }}>

    <View style={{
      flexDirection: "row",
      alignItems: "center",
      justifyContent: "space-between"
    }}>

      {/* LEFT SIDE */}
      <View style={{ flexDirection: "row", alignItems: "center", flex: 1 }}>
        <View style={{
          width: 46,
          height: 46,
          borderRadius: 14,
          backgroundColor: STAT_COLORS[i % STAT_COLORS.length] + "20",
          alignItems: "center",
          justifyContent: "center",
          marginRight: 14
        }}>
          <Ionicons name="book" size={22} color={STAT_COLORS[i % STAT_COLORS.length]} />
        </View>

        <View style={{ flex: 1 }}>
          <Text style={{ fontSize: 14, fontWeight: "700", color: "#1E1E2D" }} numberOfLines={1}>
            {course.title}
          </Text>
          <Text style={{ fontSize: 12, color: "#8E8EA0", marginTop: 2 }} numberOfLines={1}>
            {course.category || "General"} • by {course.creator?.name || "Unknown"}
          </Text>
        </View>
      </View>

       {/* EDIT */}
  {user?.role === "teacher" && (
    <TouchableOpacity
      onPress={() => navigation.navigate("EditCourse", { course })}
      style={{ marginRight: 10 }}
    >
      <Ionicons name="create-outline" size={20} color="#6C63FF" />
    </TouchableOpacity>
  )}

      {/* 🔥 DELETE BUTTON (TEACHER ONLY) */}
      {user?.role === "teacher" && (
        <TouchableOpacity
          onPress={() => handleDeleteCourse(course.id)}
          style={{ padding: 6 }}
        >
          <Ionicons name="trash-outline" size={20} color="#FF4D4D" />
        </TouchableOpacity>
      )}
    </View>

    {course.description ? (
      <Text
        style={{
          fontSize: 12,
          color: "#8E8EA0",
          marginTop: 10,
          lineHeight: 18
        }}
        numberOfLines={2}
      >
        {course.description}
      </Text>
    ) : null}

  </SoftCard>
</TouchableOpacity>
            ))
          )}
        </View>
        

        
      </ScrollView>
    </View>
  );
}
