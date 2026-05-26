import React, { useState } from "react";
import { View, Text, ScrollView, TouchableOpacity, ActivityIndicator, TextInput, Alert } from "react-native";
import * as DocumentPicker from "expo-document-picker";
import { Ionicons } from "@expo/vector-icons";
import api from "../api/axios";
import SoftCard from "../components/SoftCard";
import SoftButton from "../components/SoftButton";
import Toast from "react-native-toast-message";
import * as ImagePicker from 'expo-image-picker';

export default function UploadScreen({ navigation }) {
  const [file, setFile] = useState(null);
  const [youtubeUrl, setYoutubeUrl] = useState(""); // 🔥 NEW: State for YouTube Link
  const [loading, setLoading] = useState(false);

  const pickFile = async () => {
    try {
      const result = await DocumentPicker.getDocumentAsync({
        type: ["audio/*","video/*"],
        copyToCacheDirectory: true
      });
      if (!result.canceled && result.assets?.length > 0) {
        setFile(result.assets[0]);
        setYoutubeUrl(""); // Clear YouTube URL if they pick a file
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
        quality: 0.3, 
        videoExportPreset: ImagePicker.VideoExportPreset.H264_720p, 
      });

      if (!result.canceled && result.assets?.length > 0) {
        const video = result.assets[0];
        setFile({
          uri: video.uri,
          name: video.fileName || "video.mp4",
          mimeType: "video/mp4",
          size: video.fileSize,
        });
        setYoutubeUrl(""); // Clear YouTube URL if they pick a video
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

  // 🎤 ORIGINAL FILE UPLOAD HANDLER
  const handleTranscribe = async () => {
    if (!file) {
      Toast.show({ type: "error", text1: "Please select an audio/video file first" });
      return;
    }
    setLoading(true);
    try {
      const formData = new FormData();
      formData.append("file", {
        uri: file.uri,
        name: file.name,
        type: file.mimeType || (file.name.endsWith(".mp4") ? "video/mp4" : "audio/mpeg")
      });
      
      const res = await api.post("/ai/transcribe", formData, {
        headers: { "Content-Type": "multipart/form-data" },
        timeout: 300000
      });
      
      const transcript = res.data?.data?.transcript || res.data?.transcript || "";
      Toast.show({ type: "success", text1: "Transcription complete! ✅" });
      navigation.navigate("Transcript", { transcript, fileName: file.name });
    } catch (err) {
      Toast.show({ type: "error", text1: "Transcription Failed", text2: err.message });
    } finally {
      setLoading(false);
    }
  };

  // 🔥 NEW YOUTUBE HANDLER
  const handleYoutubeTranscribe = async () => {
    if (!youtubeUrl.includes("youtube.com") && !youtubeUrl.includes("youtu.be")) {
      Toast.show({ type: "error", text1: "Please enter a valid YouTube link" });
      return;
    }
    setLoading(true);
    Toast.show({ type: "info", text1: "Downloading audio... this is usually fast! 🚀" });

    try {
      // Notice we are passing JSON here, not FormData!
      const res = await api.post("/ai/transcribe-youtube", { url: youtubeUrl }, {
        timeout: 300000
      });

      // Drill down safely into the response (matching your Node.js response structure)
      const transcript = res.data?.data?.transcript || res.data?.transcript || "";
      
      Toast.show({ type: "success", text1: "Transcription complete! ✅" });
      navigation.navigate("Transcript", { transcript, fileName: "YouTube Video" });
    } catch (err) {
      Toast.show({ type: "error", text1: "YouTube Transcription Failed", text2: err.message });
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
          Upload a file or paste a YouTube link to get started
        </Text>

        {/* 1️⃣ FILE UPLOAD SECTION */}
        <TouchableOpacity onPress={handlePick} activeOpacity={0.8} disabled={loading}>
          <View style={{
            borderWidth: 2, borderColor: file ? "#6C63FF" : "#D1D5FF",
            borderStyle: "dashed", borderRadius: 24, padding: 36,
            alignItems: "center", backgroundColor: file ? "#F5F3FF" : "#FFFFFF",
            marginBottom: 12
          }}>
            <View style={{
              width: 72, height: 72, borderRadius: 22,
              backgroundColor: file ? "#6C63FF" : "#F0F4FF",
              alignItems: "center", justifyContent: "center", marginBottom: 16,
              shadowColor: "#6C63FF", shadowOffset: { width: 0, height: 8 },
              shadowOpacity: file ? 0.3 : 0, shadowRadius: 14, elevation: file ? 6 : 0
            }}>
              <Ionicons
                name={file?.mimeType?.startsWith("video") ? "videocam" : file ? "musical-notes" : "cloud-upload-outline"}
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
              </>
            ) : (
              <>
                <Text style={{ fontSize: 15, fontWeight: "700", color: "#1E1E2D" }}>Tap to select file</Text>
                <Text style={{ fontSize: 13, color: "#8E8EA0", marginTop: 4, textAlign: "center" }}>
                  Supports MP3, WAV, MP4
                </Text>
              </>
            )}
          </View>
        </TouchableOpacity>

        {/* Start Transcription Button (Only shows if file is selected) */}
        {file && !youtubeUrl && (
          <SoftButton
            title={loading ? "Transcribing..." : "Start File Transcription"}
            onPress={handleTranscribe}
            loading={loading}
            icon={<Ionicons name="mic" size={18} color="#FFFFFF" />}
          />
        )}

        {/* DIVIDER */}
        <Text style={{ textAlign: "center", marginVertical: 20, color: "#8E8EA0", fontWeight: "700" }}>
          — OR —
        </Text>

        {/* 2️⃣ YOUTUBE LINK SECTION */}
        <SoftCard style={{ marginBottom: 28, padding: 20 }}>
          <Text style={{ fontSize: 15, fontWeight: "700", color: "#1E1E2D", marginBottom: 12 }}>
            Paste YouTube Link 📺
          </Text>
          <TextInput
            style={{
              backgroundColor: "#F8F9FA",
              borderWidth: 1,
              borderColor: "#E5E7EB",
              borderRadius: 12,
              padding: 14,
              fontSize: 14,
              color: "#1E1E2D",
              marginBottom: 16
            }}
            placeholder="https://www.youtube.com/watch?v=..."
            placeholderTextColor="#9CA3AF"
            value={youtubeUrl}
            onChangeText={(text) => {
              setYoutubeUrl(text);
              if (text) setFile(null); // Clear file if they start typing a URL
            }}
            editable={!loading}
          />
          
          <SoftButton
            title={loading ? "Processing..." : "Transcribe YouTube"}
            onPress={handleYoutubeTranscribe}
            loading={loading && !!youtubeUrl}
            disabled={!youtubeUrl || loading}
            icon={<Ionicons name="logo-youtube" size={18} color="#FFFFFF" />}
          />
        </SoftCard>

        {/* LOADING INDICATOR OVERLAY */}
        {loading && (
          <SoftCard style={{ alignItems: "center", padding: 28, marginBottom: 20 }}>
            <ActivityIndicator size="large" color="#6C63FF" />
            <Text style={{ color: "#6C63FF", fontWeight: "700", marginTop: 14, fontSize: 14 }}>
              Working on it...
            </Text>
            <Text style={{ color: "#8E8EA0", fontSize: 12, marginTop: 4, textAlign: "center" }}>
              This may take a moment. Please don't close the app.
            </Text>
          </SoftCard>
        )}
      </ScrollView>
    </View>
  );
}