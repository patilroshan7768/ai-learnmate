import React, { useState, useRef } from "react";
import {
  View,
  TextInput,
  Text,
  TouchableOpacity,
  Pressable
} from "react-native";
import { Ionicons } from "@expo/vector-icons";

export default function SoftInput({
  label,
  value,
  onChangeText,
  placeholder,
  secureTextEntry = false,
  keyboardType = "default",
  autoCapitalize = "none",
  error = "",
  icon = null
}) {
  
  const [showPassword, setShowPassword] = useState(false);

  

  return (
    <View style={{ marginBottom: 16 }}>
      {/* Label */}
      {label && (
        <Text
          style={{
            fontSize: 13,
            fontWeight: "600",
            color: "#1E1E2D",
            marginBottom: 6
          }}
        >
          {label}
        </Text>
      )}

      {/* Pressable wrapper to handle focus */}
      
        <View
          style={{
            flexDirection: "row",
            alignItems: "center",
            backgroundColor: "#F8F9FF",
            borderRadius: 14,
            borderWidth: 1.5,
            borderColor: error ? "#FF6B6B" : "#E8EAFF",
            paddingHorizontal: 14,
            paddingVertical: 2,
            minHeight: 48,
            shadowColor: "transparent",
            shadowOffset: { width: 0, height: 4 },
            shadowOpacity: 0.1,
            shadowRadius: 8,
            elevation: 0
          }}
        >        
          {/* Left Icon */}
          {icon && <View style={{ marginRight: 10 }}>{icon}</View>}

          {/* Input */}
          <TextInput
            
            value={value}
            onChangeText={onChangeText}
            placeholder={placeholder}
            placeholderTextColor="#B0B4C8"
            secureTextEntry={secureTextEntry && !showPassword}
            keyboardType={keyboardType}
            autoCapitalize={autoCapitalize}

            blurOnSubmit={false}
            style={{
              flex: 1,
              fontSize: 15,
              color: "#1E1E2D",
              paddingVertical: 13
            }}
          />

          {/* Password Toggle */}
          {secureTextEntry && (
            <TouchableOpacity
              onPress={(e) => {
                e.stopPropagation(); // 🔥 prevents focus loss
                setShowPassword(!showPassword);
              }}
              activeOpacity={0.7}
              style={{ padding: 6 }}
            >
              <Ionicons
                name={showPassword ? "eye-outline" : "eye-off-outline"}
                size={20}
                color="#8E8EA0"
              />
            </TouchableOpacity>
          )}
        </View>
      

      {/* Error */}
      {error ? (
        <Text
          style={{
            color: "#FF6B6B",
            fontSize: 12,
            marginTop: 4,
            marginLeft: 4
          }}
        >
          {error}
        </Text>
      ) : null}
    </View>
  );
}