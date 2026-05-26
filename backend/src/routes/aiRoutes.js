console.log("✅ aiRoutes.js loaded");

const express = require("express");
const router = express.Router();
const multer = require("multer");

const { authenticate } = require("../middlewares/auth");
const {
  summarize,
  generateQuiz,
  transcribe,
  transcribeYoutube, // 🔥 ADD THIS LINE
} = require("../controllers/aiController");

// Multer config for audio and video uploads
const upload = multer({
  dest: "uploads/",
  fileFilter: (req, file, cb) => {
    const allowedTypes = [
      "audio/mpeg",
      "audio/wav",
      "audio/mp3",
      "video/mp4",
      "video/webm"
    ];

    if (allowedTypes.includes(file.mimetype)) {
      cb(null, true);
    } else {
      cb(new Error("Only audio/video files allowed"), false);
    }
  }
});

/**
 * @swagger
 * /api/ai/summarize:
 *   post:
 *     summary: Summarize text using AI (BART / T5)
 *     tags: [AI]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               text:
 *                 type: string
 *                 description: Text to summarize
 *                 example: "Artificial Intelligence enables personalized learning experiences."
 *     responses:
 *       200:
 *         description: Successfully summarized text
 */

router.get("/test", (req, res) => {
  res.json({ success: true, message: "AI route test working" });
});


router.post(
  "/summarize",
  authenticate,
  summarize
);

/**
 * @swagger
 * /api/ai/quiz:
 *   post:
 *     summary: Generate quiz questions from text using AI
 *     tags: [AI]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               text:
 *                 type: string
 *                 description: Input text for quiz generation
 *                 example: "Artificial Intelligence in education"
 *     responses:
 *       200:
 *         description: Successfully generated quiz
 */
router.post(
  "/quiz",
  authenticate,
  generateQuiz
);

/**
 * @swagger
 * /api/ai/transcribe:
 *   post:
 *     summary: Transcribe audio file using Whisper AI
 *     tags: [AI]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         multipart/form-data:
 *           schema:
 *             type: object
 *             properties:
 *               file:
 *                 type: string
 *                 format: binary
 *                 description: Audio file to be transcribed
 *     responses:
 *       200:
 *         description: Successfully transcribed audio
 */
router.post(
  "/transcribe",
  authenticate,
  upload.single("file"),
  transcribe
);

/**
 * @swagger
 * /api/ai/transcribe-youtube:
 *   post:
 *     summary: Transcribe a YouTube video via URL
 *     tags: [AI]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               url:
 *                 type: string
 *                 description: YouTube URL
 *     responses:
 *       200:
 *         description: Successfully transcribed YouTube video
 */
router.post(
  "/transcribe-youtube",
  authenticate,
  transcribeYoutube
);
module.exports = router;
