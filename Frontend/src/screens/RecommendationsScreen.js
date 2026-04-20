import React, { useEffect, useState } from "react";
import {
  View, Text, ScrollView, RefreshControl,
  ActivityIndicator
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { useAuth } from "../context/AuthContext";
import api from "../api/axios";
import SoftCard from "../components/SoftCard";
import Toast from "react-native-toast-message";

const CATEGORY_COLORS = {
  Technology: "#6C63FF",
  Science: "#48CAE4",
  Math: "#4CC9A0",
  Business: "#FFB347",
  Arts: "#F72585",
  General: "#8E8EA0"
};

const ENGAGEMENT_CONFIG = {
  high: { color: "#4CC9A0", icon: "flame", label: "High Engagement" },
  medium: { color: "#FFB347", icon: "trending-up", label: "Medium Engagement" },
  low: { color: "#FF6B6B", icon: "trending-down", label: "Low Engagement" }
};

export default function RecommendationsScreen() {
  const { user } = useAuth();
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);

  const fetchRecommendations = async () => {
    try {
      const res = await api.get(`/recommendations/${user?.id}`);
      setData(res.data?.data || null);
    } catch (err) {
      Toast.show({ type: "error", text1: "Failed to load recommendations", text2: err.message });
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };

  useEffect(() => { fetchRecommendations(); }, []);
  const onRefresh = () => { setRefreshing(true); fetchRecommendations(); };

  const engagement = data?.engagementLevel || "medium";
  const engConf = ENGAGEMENT_CONFIG[engagement] || ENGAGEMENT_CONFIG.medium;
  const courses = data?.recommendedCourses || [];

  return (
    <View style={{ flex: 1, backgroundColor: "#F0F4FF" }}>
      <ScrollView
        contentContainerStyle={{ paddingBottom: 100 }}
        showsVerticalScrollIndicator={false}
        refreshControl={
          <RefreshControl refreshing={refreshing} onRefresh={onRefresh} colors={["#6C63FF"]} />
        }
      >
        {/* Header */}
        <View style={{
          paddingTop: 60, paddingBottom: 28, paddingHorizontal: 24,
          backgroundColor: "#FFFFFF", borderBottomLeftRadius: 28, borderBottomRightRadius: 28,
          shadowColor: "#6C63FF", shadowOffset: { width: 0, height: 6 },
          shadowOpacity: 0.07, shadowRadius: 16, elevation: 4
        }}>
          <Text style={{ fontSize: 24, fontWeight: "800", color: "#1E1E2D" }}>For You ✨</Text>
          <Text style={{ fontSize: 13, color: "#8E8EA0", marginTop: 4 }}>
            Personalized course recommendations
          </Text>

          {data && (
            <View style={{
              flexDirection: "row", alignItems: "center", gap: 8, marginTop: 16,
              backgroundColor: engConf.color + "15", borderRadius: 14,
              paddingHorizontal: 14, paddingVertical: 10, alignSelf: "flex-start"
            }}>
              <Ionicons name={engConf.icon} size={16} color={engConf.color} />
              <Text style={{ fontSize: 13, fontWeight: "700", color: engConf.color }}>
                {engConf.label}
              </Text>
            </View>
          )}
        </View>

        <View style={{ padding: 20 }}>
          {loading ? (
            <View style={{ alignItems: "center", marginTop: 60 }}>
              <ActivityIndicator size="large" color="#6C63FF" />
              <Text style={{ color: "#8E8EA0", marginTop: 12, fontSize: 13 }}>
                Finding courses for you...
              </Text>
            </View>
          ) : courses.length === 0 ? (
            <SoftCard style={{ alignItems: "center", padding: 36 }}>
              <Ionicons name="bulb-outline" size={44} color="#C4BFFF" />
              <Text style={{ fontSize: 16, fontWeight: "700", color: "#1E1E2D", marginTop: 14 }}>
                No Recommendations Yet
              </Text>
              <Text style={{ fontSize: 13, color: "#8E8EA0", marginTop: 6, textAlign: "center" }}>
                Explore more courses and use AI tools{"\n"}to get personalized picks
              </Text>
            </SoftCard>
          ) : (
            <>
              {data?.fallbackUsed && (
                <View style={{
                  flexDirection: "row", alignItems: "center", gap: 8,
                  backgroundColor: "#FFB34720", borderRadius: 12,
                  padding: 12, marginBottom: 16
                }}>
                  <Ionicons name="information-circle-outline" size={16} color="#FFB347" />
                  <Text style={{ fontSize: 12, color: "#8E8EA0", flex: 1 }}>
                    Showing popular courses — use more AI tools to get tailored picks
                  </Text>
                </View>
              )}

              <Text style={{ fontSize: 14, fontWeight: "700", color: "#1E1E2D", marginBottom: 14 }}>
                {courses.length} Recommended Course{courses.length > 1 ? "s" : ""}
              </Text>

              {courses.map((course, i) => {
                const catColor = CATEGORY_COLORS[course.category] || CATEGORY_COLORS.General;
                return (
                  <SoftCard key={course.id || i} style={{ marginBottom: 16 }}>
                    <View style={{
                      flexDirection: "row", alignItems: "center",
                      justifyContent: "space-between", marginBottom: 12
                    }}>
                      <View style={{
                        backgroundColor: catColor + "20", borderRadius: 8,
                        paddingHorizontal: 10, paddingVertical: 4
                      }}>
                        <Text style={{ fontSize: 11, fontWeight: "700", color: catColor }}>
                          {course.category || "General"}
                        </Text>
                      </View>
                      <View style={{
                        width: 30, height: 30, borderRadius: 10,
                        backgroundColor: catColor + "20",
                        alignItems: "center", justifyContent: "center"
                      }}>
                        <Ionicons name="book" size={15} color={catColor} />
                      </View>
                    </View>

                    <Text style={{ fontSize: 15, fontWeight: "800", color: "#1E1E2D" }}>
                      {course.title}
                    </Text>
                    {course.description ? (
                      <Text style={{ fontSize: 13, color: "#8E8EA0", marginTop: 6, lineHeight: 19 }} numberOfLines={2}>
                        {course.description}
                      </Text>
                    ) : null}
                    {course.creator && (
                      <View style={{ flexDirection: "row", alignItems: "center", gap: 6, marginTop: 12 }}>
                        <View style={{
                          width: 24, height: 24, borderRadius: 8,
                          backgroundColor: "#6C63FF20",
                          alignItems: "center", justifyContent: "center"
                        }}>
                          <Ionicons name="person" size={12} color="#6C63FF" />
                        </View>
                        <Text style={{ fontSize: 12, color: "#8E8EA0" }}>{course.creator.name}</Text>
                      </View>
                    )}
                  </SoftCard>
                );
              })}
            </>
          )}
        </View>
      </ScrollView>
    </View>
  );
}
