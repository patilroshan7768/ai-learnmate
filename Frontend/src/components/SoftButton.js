import React from "react";
import { TouchableOpacity, Text, ActivityIndicator, View } from "react-native";

export default function SoftButton({
  title,
  onPress,
  loading = false,
  disabled = false,
  variant = "primary",
  className = "",
  icon = null
}) {
  const variants = {
    primary: { bg: "#6C63FF", text: "#FFFFFF", shadow: "#6C63FF" },
    secondary: { bg: "#F0F4FF", text: "#6C63FF", shadow: "#6C63FF" },
    danger: { bg: "#FF6B6B", text: "#FFFFFF", shadow: "#FF6B6B" },
    success: { bg: "#4CC9A0", text: "#FFFFFF", shadow: "#4CC9A0" }
  };

  const v = variants[variant] || variants.primary;

  return (
    <TouchableOpacity
      onPress={onPress}
      disabled={disabled || loading}
      activeOpacity={0.82}
      style={{
        backgroundColor: disabled ? "#D1D5DB" : v.bg,
        borderRadius: 14,
        paddingVertical: 14,
        paddingHorizontal: 24,
        alignItems: "center",
        justifyContent: "center",
        flexDirection: "row",
        shadowColor: v.shadow,
        shadowOffset: { width: 0, height: 6 },
        shadowOpacity: disabled ? 0 : 0.25,
        shadowRadius: 12,
        elevation: disabled ? 0 : 6
      }}
    >
      {loading ? (
        <ActivityIndicator color={v.text} size="small" />
      ) : (
        <View style={{ flexDirection: "row", alignItems: "center", gap: 8 }}>
          {icon && icon}
          <Text style={{ color: v.text, fontWeight: "700", fontSize: 15 }}>{title}</Text>
        </View>
      )}
    </TouchableOpacity>
  );
}
