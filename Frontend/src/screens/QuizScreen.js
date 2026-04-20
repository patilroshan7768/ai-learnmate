import React, { useState, useEffect } from "react";
import { View, Text, ScrollView, TouchableOpacity, ActivityIndicator } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import api from "../api/axios";
import SoftCard from "../components/SoftCard";
import SoftButton from "../components/SoftButton";
import Toast from "react-native-toast-message";

export default function QuizScreen({ route, navigation }) {
  const { transcript } = route.params || {};
  const [questions, setQuestions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [answers, setAnswers] = useState({});
  const [submitted, setSubmitted] = useState(false);

  useEffect(() => { fetchQuiz(); }, []);

  const fetchQuiz = async () => {
    setLoading(true);
    setSubmitted(false);
    setAnswers({});
    try {
      const res = await api.post("/ai/quiz", { text: transcript });
      const qs =
        res.data?.data?.questions ||
        res.data?.data?.data?.questions ||
        [];
      setQuestions(qs);
    } catch (err) {
      Toast.show({ type: "error", text1: "Quiz generation failed", text2: err.message });
    } finally {
      setLoading(false);
    }
  };

  const handleAnswer = (idx) => {
    if (submitted) return;
    setAnswers((prev) => ({ ...prev, [idx]: "answered" }));
  };

  const handleSubmit = () => {
    if (Object.keys(answers).length < questions.length) {
      Toast.show({ type: "error", text1: "Answer all questions first!" });
      return;
    }
    setSubmitted(true);
    Toast.show({ type: "success", text1: "Quiz submitted! 🎉" });
  };

  const answeredCount = Object.keys(answers).length;
  const progress = questions.length > 0 ? answeredCount / questions.length : 0;

  return (
    <View style={{ flex: 1, backgroundColor: "#F0F4FF" }}>
      <ScrollView
        contentContainerStyle={{ padding: 24, paddingTop: 60, paddingBottom: 120 }}
        showsVerticalScrollIndicator={false}
      >
        {/* Back */}
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

        <Text style={{ fontSize: 24, fontWeight: "800", color: "#1E1E2D" }}>Quiz Time ❓</Text>
        <Text style={{ fontSize: 13, color: "#8E8EA0", marginTop: 4, marginBottom: 20 }}>
          Generated from your transcript using Gemini AI
        </Text>

        {loading ? (
          <SoftCard style={{ alignItems: "center", padding: 40 }}>
            <ActivityIndicator size="large" color="#6C63FF" />
            <Text style={{ color: "#6C63FF", fontWeight: "700", marginTop: 14, fontSize: 14 }}>
              Generating your quiz...
            </Text>
            <Text style={{ color: "#8E8EA0", fontSize: 12, marginTop: 4 }}>
              Powered by Gemini 2.5 Flash
            </Text>
          </SoftCard>
        ) : questions.length === 0 ? (
          <SoftCard style={{ alignItems: "center", padding: 32 }}>
            <Ionicons name="alert-circle-outline" size={40} color="#FFB347" />
            <Text style={{ color: "#8E8EA0", marginTop: 12, fontSize: 14, textAlign: "center" }}>
              Couldn't generate questions.{"\n"}Try with a longer transcript.
            </Text>
            <View style={{ marginTop: 16, width: "100%" }}>
              <SoftButton title="Retry" onPress={fetchQuiz} variant="secondary" />
            </View>
          </SoftCard>
        ) : (
          <>
            {/* Progress Bar */}
            <SoftCard style={{ marginBottom: 24 }}>
              <View style={{ flexDirection: "row", justifyContent: "space-between", marginBottom: 8 }}>
                <Text style={{ fontSize: 13, fontWeight: "700", color: "#1E1E2D" }}>Progress</Text>
                <Text style={{ fontSize: 13, color: "#6C63FF", fontWeight: "700" }}>
                  {answeredCount}/{questions.length}
                </Text>
              </View>
              <View style={{ height: 8, backgroundColor: "#F0F4FF", borderRadius: 100, overflow: "hidden" }}>
                <View style={{
                  height: "100%", width: `${progress * 100}%`,
                  backgroundColor: "#6C63FF", borderRadius: 100
                }} />
              </View>
            </SoftCard>

            {/* Questions */}
            {questions.map((q, idx) => {
              const isAnswered = answers[idx] !== undefined;
              return (
                <SoftCard key={idx} style={{ marginBottom: 18 }}>
                  <View style={{ flexDirection: "row", alignItems: "flex-start", gap: 12 }}>
                    <View style={{
                      width: 30, height: 30, borderRadius: 10,
                      backgroundColor: isAnswered ? "#6C63FF" : "#F0F4FF",
                      alignItems: "center", justifyContent: "center", flexShrink: 0
                    }}>
                      <Text style={{ fontSize: 13, fontWeight: "800", color: isAnswered ? "#FFFFFF" : "#8E8EA0" }}>
                        {idx + 1}
                      </Text>
                    </View>
                    <Text style={{ flex: 1, fontSize: 14, fontWeight: "600", color: "#1E1E2D", lineHeight: 21 }}>
                      {typeof q === "string"
                        ? q.replace(/^\d+[\.\)]\s*/, "")
                        : q.question || JSON.stringify(q)}
                    </Text>
                  </View>

                  <TouchableOpacity
                    onPress={() => handleAnswer(idx)}
                    style={{
                      marginTop: 14, borderWidth: 1.5,
                      borderColor: isAnswered ? "#6C63FF" : "#E8EAFF",
                      borderRadius: 12, padding: 12,
                      backgroundColor: isAnswered ? "#F5F3FF" : "#FAFBFF",
                      flexDirection: "row", alignItems: "center", gap: 10
                    }}
                  >
                    <Ionicons
                      name={isAnswered ? "checkmark-circle" : "ellipse-outline"}
                      size={20} color={isAnswered ? "#6C63FF" : "#C4C4D0"}
                    />
                    <Text style={{
                      fontSize: 13,
                      color: isAnswered ? "#6C63FF" : "#8E8EA0",
                      fontWeight: isAnswered ? "700" : "400"
                    }}>
                      {isAnswered
                        ? submitted ? "Answer reviewed ✓" : "Marked as answered"
                        : "Tap to mark as answered"}
                    </Text>
                  </TouchableOpacity>
                </SoftCard>
              );
            })}

            {!submitted ? (
              <SoftButton
                title={`Submit Quiz (${answeredCount}/${questions.length})`}
                onPress={handleSubmit}
                disabled={answeredCount === 0}
                icon={<Ionicons name="checkmark-done" size={18} color="#FFFFFF" />}
              />
            ) : (
              <SoftCard style={{ alignItems: "center", padding: 28, marginBottom: 16 }}>
                <Ionicons name="trophy" size={42} color="#FFB347" />
                <Text style={{ fontSize: 18, fontWeight: "800", color: "#1E1E2D", marginTop: 10 }}>
                  Quiz Complete! 🎉
                </Text>
                <Text style={{ fontSize: 13, color: "#8E8EA0", marginTop: 4, textAlign: "center" }}>
                  You answered all {questions.length} questions.{"\n"}Great work!
                </Text>
                <View style={{ marginTop: 18, width: "100%" }}>
                  <SoftButton
                    title="Generate New Quiz"
                    onPress={fetchQuiz}
                    variant="secondary"
                    icon={<Ionicons name="refresh" size={17} color="#6C63FF" />}
                  />
                </View>
              </SoftCard>
            )}
          </>
        )}
      </ScrollView>
    </View>
  );
}
