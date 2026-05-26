import React, { useState } from "react";
import { View, Text, ScrollView, TouchableOpacity, ActivityIndicator } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import api from "../api/axios";
import SoftCard from "../components/SoftCard";
import SoftButton from "../components/SoftButton";
import Toast from "react-native-toast-message";

export default function TranscriptScreen({ route, navigation }) {
  const { transcript, fileName } = route.params || {};
  const [summary, setSummary] = useState("");
  const [summarizing, setSummarizing] = useState(false);
  const [expanded, setExpanded] = useState(false);

  // Automatically uses "medium" on the backend now to save credits
  const handleSummarize = async () => {
    if (!transcript) return;
    setSummarizing(true);
    setSummary("");
    try {
      const res = await api.post("/ai/summarize", { text: transcript, summaryType: "medium" });
      const s = res.data?.data?.summary || res.data?.data?.data?.summary || "No summary returned.";
      setSummary(s);
      Toast.show({ type: "success", text1: "Summary ready! 📝" });
    } catch (err) {
      Toast.show({ type: "error", text1: "Summarization failed", text2: err.message });
    } finally {
      setSummarizing(false);
    }
  };

  const handleGenerateQuiz = () => {
    if (!transcript) return;
    navigation.navigate("Quiz", { transcript });
  };

  const displayText = expanded
    ? transcript
    : transcript?.slice(0, 320) + (transcript?.length > 320 ? "..." : "");

  return (
    <View style={{ flex: 1, backgroundColor: "#F0F4FF" }}>
      <ScrollView
        contentContainerStyle={{ padding: 24, paddingTop: 60, paddingBottom: 120 }}
        showsVerticalScrollIndicator={false}
      >
        <TouchableOpacity
          onPress={() => navigation.goBack()}
          style={{ marginBottom: 20, alignSelf: "flex-start" }}
        >
          <View style={{
            backgroundColor: "#FFFFFF", borderRadius: 12, padding: 10,
            shadowColor: "#6C63FF", shadowOffset: { width: 0, height: 4 },
            shadowOpacity: 0.1, shadowRadius: 8, elevation: 3
          }}>
            <Ionicons name="arrow-back" size={20} color="#6C63FF" />
          </View>
        </TouchableOpacity>

        <Text style={{ fontSize: 24, fontWeight: "800", color: "#1E1E2D" }}>Transcript 📄</Text>
        {fileName && (
          <Text style={{ fontSize: 13, color: "#8E8EA0", marginTop: 4, marginBottom: 20 }}>
            {fileName}
          </Text>
        )}

        <SoftCard style={{ marginBottom: 24 }}>
          <View style={{ flexDirection: "row", alignItems: "center", marginBottom: 12 }}>
            <View style={{
              width: 36, height: 36, borderRadius: 10, backgroundColor: "#6C63FF20",
              alignItems: "center", justifyContent: "center", marginRight: 10
            }}>
              <Ionicons name="document-text" size={18} color="#6C63FF" />
            </View>
            <Text style={{ fontSize: 14, fontWeight: "700", color: "#1E1E2D" }}>Transcribed Text</Text>
          </View>
          <Text style={{ fontSize: 14, color: "#1E1E2D", lineHeight: 22 }}>
            {displayText || "No transcript available."}
          </Text>
          {transcript?.length > 320 && (
            <TouchableOpacity onPress={() => setExpanded(!expanded)} style={{ marginTop: 10 }}>
              <Text style={{ color: "#6C63FF", fontWeight: "700", fontSize: 13 }}>
                {expanded ? "Show less ▲" : "Show more ▼"}
              </Text>
            </TouchableOpacity>
          )}
        </SoftCard>

        {/* Start AI Section */}
        {!summary && !summarizing && (
          <SoftButton
            title="Generate AI Summary"
            onPress={handleSummarize}
            icon={<Ionicons name="sparkles" size={17} color="#FFFFFF" />}
          />
        )}

        {summarizing && (
          <SoftCard style={{ alignItems: "center", padding: 24 }}>
            <ActivityIndicator size="large" color="#6C63FF" />
            <Text style={{ color: "#8E8EA0", marginTop: 10, fontSize: 13 }}>
              Generating summary...
            </Text>
          </SoftCard>
        )}

        {summary ? (
          <SoftCard style={{ marginBottom: 20 }}>
            <View style={{ flexDirection: "row", alignItems: "center", marginBottom: 12 }}>
              <View style={{
                width: 36, height: 36, borderRadius: 10, backgroundColor: "#4CC9A020",
                alignItems: "center", justifyContent: "center", marginRight: 10
              }}>
                <Ionicons name="sparkles" size={18} color="#4CC9A0" />
              </View>
              <Text style={{ fontSize: 14, fontWeight: "700", color: "#1E1E2D" }}>AI Summary</Text>
            </View>
            <Text style={{ fontSize: 14, color: "#1E1E2D", lineHeight: 22 }}>{summary}</Text>
          </SoftCard>
        ) : null}

        <View style={{ marginTop: 12 }}>
          <SoftButton
            title="Generate Quiz"
            onPress={handleGenerateQuiz}
            variant="secondary"
            icon={<Ionicons name="help-circle-outline" size={18} color="#6C63FF" />}
          />
        </View>
      </ScrollView>
    </View>
  );
}