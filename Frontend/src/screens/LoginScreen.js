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

export default function LoginScreen({ navigation }) {
  const { login } = useAuth();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState({});

  const validate = () => {
    const e = {};
    if (!email.trim()) e.email = "Email is required";
    else if (!/\S+@\S+\.\S+/.test(email)) e.email = "Enter a valid email";
    if (!password.trim()) e.password = "Password is required";
    else if (password.length < 6) e.password = "Min 6 characters";
    setErrors(e);
    return Object.keys(e).length === 0;
  };

  const handleLogin = async () => {
    if (!validate()) return;
    setLoading(true);
    try {
      await login(email.trim(), password);
      Toast.show({ type: "success", text1: "Welcome back! 👋" });
    } catch (err) {
      Toast.show({ type: "error", text1: "Login Failed", text2: err.message });
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
        keyboardDismissMode="none"
        showsVerticalScrollIndicator={false}
      >
        <View style={{ alignItems: "center", paddingTop: 80, paddingBottom: 36 }}>
          <View
            style={{
              width: 90, height: 90, borderRadius: 28,
              backgroundColor: "#6C63FF",
              alignItems: "center", justifyContent: "center",
              shadowColor: "#6C63FF",
              shadowOffset: { width: 0, height: 12 },
              shadowOpacity: 0.35,
              shadowRadius: 20,
              elevation: 12,
              marginBottom: 20
            }}
          >
            <Ionicons name="school" size={44} color="#FFFFFF" />
          </View>
          <Text style={{ fontSize: 28, fontWeight: "800", color: "#1E1E2D" }}>
            AI LearnMate
          </Text>
          <Text style={{ fontSize: 14, color: "#8E8EA0", marginTop: 6 }}>
            Sign in to continue learning 🚀
          </Text>
        </View>

        <View
          style={{
            backgroundColor: "#FFFFFF",
            borderRadius: 24,
            padding: 24,
            shadowColor: "#6C63FF",
            shadowOffset: { width: 0, height: 8 },
            shadowOpacity: 0.1,
            shadowRadius: 20,
            elevation: 6
          }}
        >
          <SoftInput
            key="email"
            label="Email Address"
            value={email}
            onChangeText={setEmail}
            placeholder="you@example.com"
            keyboardType="email-address"
            error={errors.email}
            icon={<Ionicons name="mail-outline" size={18} color="#8E8EA0" />}
          />
          <SoftInput
            key="password"
            label="Password"
            value={password}
            onChangeText={setPassword}
            placeholder="Enter your password"
            secureTextEntry
            error={errors.password}
            icon={<Ionicons name="lock-closed-outline" size={18} color="#8E8EA0" />}
          />
          <View style={{ marginTop: 8 }}>
            <SoftButton title="Sign In" onPress={handleLogin} loading={loading} />
          </View>
        </View>

        <View style={{ flexDirection: "row", justifyContent: "center", marginTop: 28 }}>
          <Text style={{ color: "#8E8EA0", fontSize: 14 }}>Don't have an account? </Text>
          <TouchableOpacity onPress={() => navigation.navigate("Register")}>
            <Text style={{ color: "#6C63FF", fontWeight: "700", fontSize: 14 }}>Sign Up</Text>
          </TouchableOpacity>
        </View>
        <View style={{ height: 40 }} />
      </ScrollView>
    </KeyboardAvoidingView>
  );
}
