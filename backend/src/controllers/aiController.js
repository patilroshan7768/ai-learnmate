const fs = require("fs");
const axios = require("axios");
const FormData = require("form-data");
const { logAction } = require("../utils/logger");
const ffmpeg = require("fluent-ffmpeg");
const path = require("path");

console.log("🚀 Sending file to AI server...");

// FastAPI base URL
// const AI_BASE_URL = "http://127.0.0.1:5001";

// To this (Use YOUR actual Render link):
const AI_BASE_URL = "https://ai-learnmate-fb2m.onrender.com";

console.log("✅ Received response from AI server");

/**
 * 🎤 TRANSCRIBE AUDIO (Whisper)
 * Expects: multipart/form-data (audio file)
 */
const transcribe = async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({
        success: false,
        message: "Audio file is required for transcription",
      });
    }

    console.log("📥 Received file:", req.file);
    console.log("📥 MIME TYPE:", req.file.mimetype);
    console.log("📥 FILE NAME:", req.file.originalname);

    let filePath = req.file.path;
let finalPath = filePath;

// 🎥 If video → convert to audio
if (req.file.mimetype.startsWith("video")) {
  const audioPath = filePath + ".mp3";

  await new Promise((resolve, reject) => {
    ffmpeg(filePath)
      .output(audioPath)
      .noVideo()
      .audioCodec("libmp3lame")
      .audioBitrate(32)
      .on("end", resolve)
      .on("error", reject)
      .run();
  });

  finalPath = audioPath;
}

    const formData = new FormData();

    // ✅ FIXED: Send filename + correct MIME type
    formData.append("file", fs.createReadStream(finalPath), {
  filename: req.file.originalname,
  contentType: "audio/mpeg",
});

    const response = await axios.post(
      `${AI_BASE_URL}/transcribe`,
      formData,
      {
        headers: {
          ...formData.getHeaders(),
        },
        maxContentLength: Infinity,
        maxBodyLength: Infinity,
        timeout: 300000, // ✅ 5 minutes
      }
    );

    // Optional: log action
    if (req.user) {
      await logAction(req.user.id, "ai_transcribe", "success");
    }

    // Delete uploaded file after processing
    fs.unlinkSync(req.file.path);

// delete converted audio if created
if (finalPath !== req.file.path) {
  fs.unlinkSync(finalPath);
}

    return res.status(200).json({
      success: true,
      message: "Audio transcribed successfully",
      data: response.data,
    });

  } catch (error) {
    console.error("❌ Transcription Error:", error.response?.data || error.message);

    return res.status(500).json({
      success: false,
      message: "Failed to transcribe audio",
      error: error.response?.data || error.message,
    });
  }
};


/**
 * 📝 SUMMARIZE TEXT
 * Expects: JSON { text }
 */
const summarize = async (req, res) => {
  try {
    const { text, summaryType = "medium" } = req.body;

    if (!text) {
      return res.status(400).json({
        success: false,
        message: "Text is required for summarization",
      });
    }

    const response = await axios.post(
      `${AI_BASE_URL}/summarize-raw?summary_type=${summaryType}`,
      text,
      {
        headers: {
          "Content-Type": "text/plain",
        },
        timeout: 60000,
      }
    );

    return res.status(200).json({
      success: true,
      message: "Text summarized successfully",
      data: response.data,
    });

  } catch (error) {
    console.error("❌ Summarization Error:", error.response?.data || error.message);

    return res.status(500).json({
      success: false,
      message: "Failed to summarize text",
      error: error.response?.data || error.message,
    });
  }
};


/**
 * ❓ GENERATE QUIZ
 * Expects: JSON { text }
 */
const generateQuiz = async (req, res) => {
  try {
    const { text } = req.body;

    if (!text) {
      return res.status(400).json({
        success: false,
        message: "Text is required for quiz generation",
      });
    }

    const response = await axios.post(
      `${AI_BASE_URL}/generate-quiz`,
      { text },
      {
        timeout: 60000,
      }
    );

    if (req.user) {
      await logAction(req.user.id, "ai_generate_quiz", "success");
    }

    return res.status(200).json({
      success: true,
      message: "Quiz generated successfully",
      data: response.data,
    });

  } catch (error) {
    console.error("❌ Quiz Error:", error.response?.data || error.message);

    return res.status(500).json({
      success: false,
      message: "Failed to generate quiz",
      error: error.response?.data || error.message,
    });
  }
};

/**
 * 🎥 TRANSCRIBE YOUTUBE
 * Expects: JSON { url }
 */
const transcribeYoutube = async (req, res) => {
  try {
    const { url } = req.body;

    if (!url) {
      return res.status(400).json({
        success: false,
        message: "YouTube URL is required",
      });
    }

    console.log(`🚀 Sending YouTube URL to AI server: ${url}`);

    // Forward the request to the Python FastAPI service
    const response = await axios.post(
      `${AI_BASE_URL}/transcribe-youtube`,
      { url },
      {
        timeout: 300000, // 5 minutes to download and process
      }
    );

    if (req.user) {
      await logAction(req.user.id, "ai_transcribe_youtube", "success");
    }

    return res.status(200).json({
      success: true,
      message: "YouTube audio transcribed successfully",
      data: response.data,
    });

  } catch (error) {
    console.error("❌ YouTube Transcription Error:", error.response?.data || error.message);

    return res.status(500).json({
      success: false,
      message: "Failed to transcribe YouTube link",
      error: error.response?.data || error.message,
    });
  }
};

module.exports = {
  transcribe,
  summarize,
  generateQuiz,
  transcribeYoutube,    // 🔥 ADD THIS LINE
};