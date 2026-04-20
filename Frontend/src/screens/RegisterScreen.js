import React, { useState } from "react";
import {
  View, Text, ScrollView, TouchableOpacity,
  KeyboardAvoidingView, Platform
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { useAuth } from "../context/AuthContext";
import SoftInput from "../components/SoftInput";
import SoftButton from "../components/SoftButton";
import Toast from "react-native-toast-message";

const ROLES = ["student", "teacher"];

export default function RegisterScreen({ navigation }) {
  const { register } = useAuth();
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [role, setRole] = useState("student");
  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState({});

  const validate = () => {
    const e = {};
    if (!name.trim()) e.name = "Name is required";
    if (!email.trim()) e.email = "Email is required";
    else if (!/\S+@\S+\.\S+/.test(email)) e.email = "Enter a valid email";
    if (!password.trim()) e.password = "Password is required";
    else if (password.length < 6) e.password = "Min 6 characters";
    setErrors(e);
    return Object.keys(e).length === 0;
  };

  const handleRegister = async () => {
    if (!validate()) return;
    setLoading(true);
    try {
      await register(name.trim(), email.trim(), password, role);
      Toast.show({ type: "success", text1: "Account created! 🎉" });
    } catch (err) {
      Toast.show({ type: "error", text1: "Registration Failed", text2: err.message });
    } finally {
      setLoading(false);
    }
  };

  return (
    <KeyboardAvoidingView
      behavior={Platform.OS === "ios" ? "padding" : undefined}
      style={{ flex: 1, backgroundColor: "#F0F4FF" }}
    >
      <ScrollView
        contentContainerStyle={{ flexGrow: 1, paddingHorizontal: 24 }}
        keyboardShouldPersistTaps="handled"
        showsVerticalScrollIndicator={false}
      >
        <TouchableOpacity
          onPress={() => navigation.goBack()}
          style={{ marginTop: 58, marginBottom: 8, alignSelf: "flex-start" }}
        >
          <View
            style={{
              backgroundColor: "#FFFFFF", borderRadius: 12, padding: 10,
              shadowColor: "#6C63FF", shadowOffset: { width: 0, height: 4 },
              shadowOpacity: 0.1, shadowRadius: 8, elevation: 3
            }}
          >
            <Ionicons name="arrow-back" size={20} color="#6C63FF" />
          </View>
        </TouchableOpacity>

        <View style={{ marginBottom: 28, marginTop: 12 }}>
          <Text style={{ fontSize: 28, fontWeight: "800", color: "#1E1E2D" }}>Create Account</Text>
          <Text style={{ fontSize: 14, color: "#8E8EA0", marginTop: 6 }}>
            Join thousands of learners today ✨
          </Text>
        </View>

        <View
          style={{
            backgroundColor: "#FFFFFF", borderRadius: 24, padding: 24,
            shadowColor: "#6C63FF", shadowOffset: { width: 0, height: 8 },
            shadowOpacity: 0.1, shadowRadius: 20, elevation: 6
          }}
        >
          <SoftInput
            label="Full Name" value={name} onChangeText={setName}
            placeholder="John Doe" autoCapitalize="words" error={errors.name}
            icon={<Ionicons name="person-outline" size={18} color="#8E8EA0" />}
          />
          <SoftInput
            label="Email Address" value={email} onChangeText={setEmail}
            placeholder="you@example.com" keyboardType="email-address" error={errors.email}
            icon={<Ionicons name="mail-outline" size={18} color="#8E8EA0" />}
          />
          <SoftInput
            label="Password" value={password} onChangeText={setPassword}
            placeholder="Min 6 characters" secureTextEntry error={errors.password}
            icon={<Ionicons name="lock-closed-outline" size={18} color="#8E8EA0" />}
          />

          <Text style={{ fontSize: 13, fontWeight: "600", color: "#1E1E2D", marginBottom: 10 }}>
            I am a...
          </Text>
          <View style={{ flexDirection: "row", gap: 12, marginBottom: 20 }}>
            {ROLES.map((r) => (
              <TouchableOpacity
                key={r}
                onPress={() => setRole(r)}
                style={{
                  flex: 1, paddingVertical: 12, borderRadius: 14, alignItems: "center",
                  backgroundColor: role === r ? "#6C63FF" : "#F0F4FF",
                  borderWidth: 1.5, borderColor: role === r ? "#6C63FF" : "#E8EAFF",
                  shadowColor: "#6C63FF", shadowOffset: { width: 0, height: 4 },
                  shadowOpacity: role === r ? 0.2 : 0, shadowRadius: 8,
                  elevation: role === r ? 4 : 0
                }}
              >
                <Ionicons
                  name={r === "student" ? "book-outline" : "school-outline"}
                  size={20} color={role === r ? "#FFFFFF" : "#6C63FF"}
                />
                <Text style={{
                  marginTop: 4, fontSize: 13, fontWeight: "700",
                  color: role === r ? "#FFFFFF" : "#6C63FF", textTransform: "capitalize"
                }}>
                  {r}
                </Text>
              </TouchableOpacity>
            ))}
          </View>

          <SoftButton title="Create Account" onPress={handleRegister} loading={loading} />
        </View>

        <View style={{ flexDirection: "row", justifyContent: "center", marginTop: 28 }}>
          <Text style={{ color: "#8E8EA0", fontSize: 14 }}>Already have an account? </Text>
          <TouchableOpacity onPress={() => navigation.navigate("Login")}>
            <Text style={{ color: "#6C63FF", fontWeight: "700", fontSize: 14 }}>Sign In</Text>
          </TouchableOpacity>
        </View>
        <View style={{ height: 40 }} />
      </ScrollView>
    </KeyboardAvoidingView>
  );
}
