import React, { useState } from "react";
import { View, Text, ScrollView, TouchableOpacity, Alert } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { useAuth } from "../context/AuthContext";
import SoftCard from "../components/SoftCard";
import SoftButton from "../components/SoftButton";
import Toast from "react-native-toast-message";

const AVATAR_COLORS = ["#6C63FF", "#48CAE4", "#4CC9A0", "#FFB347", "#F72585"];

function getAvatarColor(name = "") {
  return AVATAR_COLORS[name.charCodeAt(0) % AVATAR_COLORS.length];
}

function InfoRow({ icon, label, value }) {
  return (
    <View style={{
      flexDirection: "row", alignItems: "center",
      paddingVertical: 14, borderBottomWidth: 1, borderBottomColor: "#F0F4FF"
    }}>
      <View style={{
        width: 36, height: 36, borderRadius: 10, backgroundColor: "#6C63FF15",
        alignItems: "center", justifyContent: "center", marginRight: 14
      }}>
        <Ionicons name={icon} size={17} color="#6C63FF" />
      </View>
      <View style={{ flex: 1 }}>
        <Text style={{ fontSize: 11, color: "#8E8EA0", fontWeight: "600" }}>{label}</Text>
        <Text style={{ fontSize: 14, color: "#1E1E2D", fontWeight: "700", marginTop: 2 }}>
          {value || "—"}
        </Text>
      </View>
    </View>
  );
}

export default function ProfileScreen() {
  const { user, logout } = useAuth();
  const [loggingOut, setLoggingOut] = useState(false);

  const initials = user?.name
    ? user.name.split(" ").map((n) => n[0]).slice(0, 2).join("").toUpperCase()
    : "?";

  const handleLogout = () => {
    Alert.alert("Sign Out", "Are you sure you want to sign out?", [
      { text: "Cancel", style: "cancel" },
      {
        text: "Sign Out", style: "destructive",
        onPress: async () => {
          setLoggingOut(true);
          try {
            await logout();
            Toast.show({ type: "success", text1: "Signed out successfully" });
          } catch (_) {}
          setLoggingOut(false);
        }
      }
    ]);
  };

  const menuItems = [
    {
      icon: "school-outline", label: "Learning Role",
      value: user?.role === "teacher" ? "Teacher 👨‍🏫" : "Student 📚"
    },
    { icon: "mail-outline", label: "Email Address", value: user?.email },
    {
      icon: "calendar-outline", label: "Member Since",
      value: user?.createdAt
        ? new Date(user.createdAt).toLocaleDateString("en-IN", {
            year: "numeric", month: "long", day: "numeric"
          })
        : "—"
    },
    { icon: "shield-checkmark-outline", label: "Account Status", value: "Active ✅" }
  ];

  const features = [
    { icon: "mic-outline", label: "Audio Transcription", desc: "Groq Whisper large-v3", color: "#6C63FF" },
    { icon: "document-text-outline", label: "AI Summarization", desc: "Gemini 2.5 Flash", color: "#48CAE4" },
    { icon: "help-circle-outline", label: "Quiz Generation", desc: "Gemini 2.5 Flash", color: "#4CC9A0" },
    { icon: "bulb-outline", label: "Recommendations", desc: "Adaptive engine", color: "#FFB347" }
  ];

  return (
    <View style={{ flex: 1, backgroundColor: "#F0F4FF" }}>
      <ScrollView contentContainerStyle={{ paddingBottom: 120 }} showsVerticalScrollIndicator={false}>

        {/* Header */}
        <View style={{
          backgroundColor: "#6C63FF", paddingTop: 64, paddingBottom: 40,
          alignItems: "center", borderBottomLeftRadius: 32, borderBottomRightRadius: 32,
          shadowColor: "#6C63FF", shadowOffset: { width: 0, height: 10 },
          shadowOpacity: 0.4, shadowRadius: 20, elevation: 12
        }}>
          <View style={{
            width: 84, height: 84, borderRadius: 26,
            backgroundColor: "rgba(255,255,255,0.25)",
            alignItems: "center", justifyContent: "center",
            marginBottom: 14, borderWidth: 3, borderColor: "rgba(255,255,255,0.4)"
          }}>
            <Text style={{ fontSize: 30, fontWeight: "800", color: "#FFFFFF" }}>{initials}</Text>
          </View>
          <Text style={{ fontSize: 20, fontWeight: "800", color: "#FFFFFF" }}>
            {user?.name || "Learner"}
          </Text>
          <View style={{
            marginTop: 8, backgroundColor: "rgba(255,255,255,0.2)",
            borderRadius: 20, paddingHorizontal: 14, paddingVertical: 5,
            flexDirection: "row", alignItems: "center", gap: 6
          }}>
            <Ionicons
              name={user?.role === "teacher" ? "school" : "book"}
              size={13} color="#C4BFFF"
            />
            <Text style={{
              fontSize: 12, color: "#C4BFFF", fontWeight: "700", textTransform: "capitalize"
            }}>
              {user?.role || "student"}
            </Text>
          </View>
        </View>

        <View style={{ padding: 20 }}>
          {/* Account Info */}
          <Text style={{ fontSize: 14, fontWeight: "800", color: "#1E1E2D", marginBottom: 12 }}>
            Account Information
          </Text>
          <SoftCard style={{ marginBottom: 24 }}>
            {menuItems.map((item, i) => (
              <InfoRow key={i} icon={item.icon} label={item.label} value={item.value} />
            ))}
          </SoftCard>

          {/* AI Features */}
          <Text style={{ fontSize: 14, fontWeight: "800", color: "#1E1E2D", marginBottom: 12 }}>
            Available AI Features
          </Text>
          <View style={{ flexDirection: "row", flexWrap: "wrap", gap: 12, marginBottom: 28 }}>
            {features.map((f, i) => (
              <SoftCard key={i} style={{ width: "47%", padding: 16, alignItems: "flex-start" }}>
                <View style={{
                  width: 38, height: 38, borderRadius: 12,
                  backgroundColor: f.color + "20",
                  alignItems: "center", justifyContent: "center", marginBottom: 10
                }}>
                  <Ionicons name={f.icon} size={19} color={f.color} />
                </View>
                <Text style={{ fontSize: 12, fontWeight: "700", color: "#1E1E2D" }}>{f.label}</Text>
                <Text style={{ fontSize: 11, color: "#8E8EA0", marginTop: 2 }}>{f.desc}</Text>
              </SoftCard>
            ))}
          </View>

          {/* App Info */}
          <SoftCard style={{ marginBottom: 24, alignItems: "center", padding: 20 }}>
            <View style={{
              width: 50, height: 50, borderRadius: 16, backgroundColor: "#6C63FF",
              alignItems: "center", justifyContent: "center", marginBottom: 10,
              shadowColor: "#6C63FF", shadowOffset: { width: 0, height: 6 },
              shadowOpacity: 0.3, shadowRadius: 12, elevation: 6
            }}>
              <Ionicons name="school" size={26} color="#FFFFFF" />
            </View>
            <Text style={{ fontSize: 15, fontWeight: "800", color: "#1E1E2D" }}>AI LearnMate</Text>
            <Text style={{ fontSize: 12, color: "#8E8EA0", marginTop: 4 }}>
              Version 1.0.0 • Made with ❤️
            </Text>
          </SoftCard>

          {/* Logout */}
          <SoftButton
            title="Sign Out"
            onPress={handleLogout}
            loading={loggingOut}
            variant="danger"
            icon={<Ionicons name="log-out-outline" size={18} color="#FFFFFF" />}
          />
        </View>
      </ScrollView>
    </View>
  );
}
