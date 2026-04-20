import React, { useState } from "react";
import { View, Text, ScrollView, TouchableOpacity, ActivityIndicator } from "react-native";
import * as DocumentPicker from "expo-document-picker";
import { Ionicons } from "@expo/vector-icons";
import api from "../api/axios";
import SoftCard from "../components/SoftCard";
import SoftButton from "../components/SoftButton";
import Toast from "react-native-toast-message";
import * as ImagePicker from 'expo-image-picker';
import { Alert } from "react-native";

export default function UploadScreen({ navigation }) {
  const [file, setFile] = useState(null);
  const [loading, setLoading] = useState(false);

  const pickFile = async () => {
    try {
      const result = await DocumentPicker.getDocumentAsync({
        type: ["audio/*","video/*"],
        copyToCacheDirectory: true
      });
      if (!result.canceled && result.assets?.length > 0) {
        setFile(result.assets[0]);
      }
    } catch (err) {
      Toast.show({ type: "error", text1: "Could not pick file" });
    }
  };

  const pickVideo = async () => {
  try {
    const permission = await ImagePicker.requestMediaLibraryPermissionsAsync();

    if (!permission.granted) {
      Toast.show({ type: "error", text1: "Permission required" });
      return;
    }

    let result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Videos,
      allowsEditing: true,
      quality: 0.3, // 🔥 compress video
      videoExportPreset: ImagePicker.VideoExportPreset.H264_720p, // 🔥 reduce size
    });

    if (!result.canceled && result.assets?.length > 0) {
      const video = result.assets[0];

      // 🔥 Normalize file structure (IMPORTANT)
      setFile({
        uri: video.uri,
        name: video.fileName || "video.mp4",
        mimeType: "video/mp4",
        size: video.fileSize,
      });
    }
  } catch (err) {
    Toast.show({ type: "error", text1: "Could not pick video" });
  }
};

    const handlePick = () => {
  Alert.alert(
    "Select File Type",
    "Choose what you want to upload",
    [
      { text: "🎥 Video", onPress: pickVideo },
      { text: "🎧 Audio", onPress: pickFile },
      { text: "Cancel", style: "cancel" }
    ]
  );
};


  const handleTranscribe = async () => {
    if (!file) {
      Toast.show({ type: "error", text1: "Please select an audio file first" });
      return;
    }
    setLoading(true);
    try {
      const formData = new FormData();
      formData.append("file", {
        uri: file.uri,
        name: file.name,
        type: file.mimeType || (
  file.name.endsWith(".mp4") ? "video/mp4" : "audio/mpeg"
)
      });
      const res = await api.post("/ai/transcribe", formData, {
        headers: { "Content-Type": "multipart/form-data" },
        timeout: 120000
      });
      const transcript =
        res.data?.data?.transcript || res.data?.data?.data?.transcript || "";
      Toast.show({ type: "success", text1: "Transcription complete! ✅" });
      navigation.navigate("Transcript", { transcript, fileName: file.name });
    } catch (err) {
      Toast.show({ type: "error", text1: "Transcription Failed", text2: err.message });
    } finally {
      setLoading(false);
    }
  };

  const formatSize = (bytes) => {
    if (!bytes) return "Unknown size";
    if (bytes < 1024) return `${bytes} B`;
    if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`;
    return `${(bytes / (1024 * 1024)).toFixed(1)} MB`;
  };

  return (
    <View style={{ flex: 1, backgroundColor: "#F0F4FF" }}>
      <ScrollView
        contentContainerStyle={{ padding: 24, paddingTop: 60, paddingBottom: 120 }}
        showsVerticalScrollIndicator={false}
      >
        <Text style={{ fontSize: 26, fontWeight: "800", color: "#1E1E2D" }}>
          AI Transcribe 🎙️
        </Text>
        <Text style={{ fontSize: 14, color: "#8E8EA0", marginTop: 6, marginBottom: 28 }}>
          Upload an audio or video file to get a transcript
        </Text>

        <TouchableOpacity onPress={handlePick} activeOpacity={0.8}>
          <View style={{
            borderWidth: 2, borderColor: file ? "#6C63FF" : "#D1D5FF",
            borderStyle: "dashed", borderRadius: 24, padding: 36,
            alignItems: "center", backgroundColor: file ? "#F5F3FF" : "#FFFFFF",
            marginBottom: 24
          }}>
            <View style={{
              width: 72, height: 72, borderRadius: 22,
              backgroundColor: file ? "#6C63FF" : "#F0F4FF",
              alignItems: "center", justifyContent: "center", marginBottom: 16,
              shadowColor: "#6C63FF", shadowOffset: { width: 0, height: 8 },
              shadowOpacity: file ? 0.3 : 0, shadowRadius: 14, elevation: file ? 6 : 0
            }}>
              <Ionicons
                name={
  file?.mimeType?.startsWith("video")
    ? "videocam"
    : file
    ? "musical-notes"
    : "cloud-upload-outline"
}
                size={34} color={file ? "#FFFFFF" : "#6C63FF"}
              />
            </View>
            {file ? (
              <>
                <Text style={{ fontSize: 15, fontWeight: "700", color: "#1E1E2D", textAlign: "center" }}>
                  {file.name}
                </Text>
                <Text style={{ fontSize: 13, color: "#8E8EA0", marginTop: 4 }}>
                  {formatSize(file.size)}
                </Text>
                <View style={{
                  marginTop: 12, backgroundColor: "#6C63FF20",
                  borderRadius: 20, paddingHorizontal: 14, paddingVertical: 5
                }}>
                  <Text style={{ fontSize: 12, color: "#6C63FF", fontWeight: "600" }}>
                    Tap to change file
                  </Text>
                </View>
              </>
            ) : (
              <>
                <Text style={{ fontSize: 15, fontWeight: "700", color: "#1E1E2D" }}>
                  Tap to select audio or video
                </Text>
                <Text style={{ fontSize: 13, color: "#8E8EA0", marginTop: 4, textAlign: "center" }}>
                  Supports MP3, WAV, M4A, OGG, MP4
                </Text>
              </>
            )}
          </View>
        </TouchableOpacity>

        <SoftCard style={{ marginBottom: 16 }}>
          <View style={{ flexDirection: "row", alignItems: "center", gap: 14 }}>
            <View style={{
              width: 40, height: 40, borderRadius: 12,
              backgroundColor: "#48CAE420", alignItems: "center", justifyContent: "center"
            }}>
              <Ionicons name="time-outline" size={20} color="#48CAE4" />
            </View>
            <View style={{ flex: 1 }}>
              <Text style={{ fontSize: 13, fontWeight: "700", color: "#1E1E2D" }}>Processing Time</Text>
              <Text style={{ fontSize: 12, color: "#8E8EA0", marginTop: 2 }}>
                May take up to 60s depending on file size
              </Text>
            </View>
          </View>
        </SoftCard>

        <SoftCard style={{ marginBottom: 28 }}>
          <View style={{ flexDirection: "row", alignItems: "center", gap: 14 }}>
            <View style={{
              width: 40, height: 40, borderRadius: 12,
              backgroundColor: "#4CC9A020", alignItems: "center", justifyContent: "center"
            }}>
              <Ionicons name="shield-checkmark-outline" size={20} color="#4CC9A0" />
            </View>
            <View style={{ flex: 1 }}>
              <Text style={{ fontSize: 13, fontWeight: "700", color: "#1E1E2D" }}>
                Powered by Whisper AI
              </Text>
              <Text style={{ fontSize: 12, color: "#8E8EA0", marginTop: 2 }}>
                Groq Whisper large-v3 — highly accurate
              </Text>
            </View>
          </View>
        </SoftCard>

        {loading && (
          <SoftCard style={{ alignItems: "center", padding: 28, marginBottom: 20 }}>
            <ActivityIndicator size="large" color="#6C63FF" />
            <Text style={{ color: "#6C63FF", fontWeight: "700", marginTop: 14, fontSize: 14 }}>
              Transcribing your audio...
            </Text>
            <Text style={{ color: "#8E8EA0", fontSize: 12, marginTop: 4, textAlign: "center" }}>
              This may take a moment. Please don't close the app.
            </Text>
          </SoftCard>
        )}

        <SoftButton
          title={loading ? "Transcribing..." : "Start Transcription"}
          onPress={handleTranscribe}
          loading={loading}
          disabled={!file || loading}
          icon={<Ionicons name="mic" size={18} color="#FFFFFF" />}
        />
      </ScrollView>
    </View>
  );
}
