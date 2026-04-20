import React from "react";
import { View } from "react-native";

export default function SoftCard({ children, className = "", style = {} }) {
  return (
    <View
      style={{
        backgroundColor: "#FFFFFF",
        borderRadius: 20,
        padding: 18,
        shadowColor: "#6C63FF",
        shadowOffset: { width: 0, height: 6 },
        shadowOpacity: 0.08,
        shadowRadius: 16,
        elevation: 5,
        ...style
      }}
      className={className}
    >
      {children}
    </View>
  );
}
