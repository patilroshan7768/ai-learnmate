const express = require("express");
const cors = require("cors");
require("dotenv").config();

const { testConnection } = require("./src/config/database");
const { swaggerUi, swaggerSpec } = require("./src/config/swagger");

// Import routes
const authRoutes = require("./src/routes/authRoutes");
const courseRoutes = require("./src/routes/courseRoutes");
const aiRoutes = require("./src/routes/aiRoutes");
const recommendationRoutes = require("./src/routes/recommendationRoutes");
const logRoutes = require("./src/routes/logRoutes");
const lessonRoutes = require("./src/routes/lessonRoutes");

// Import models
const User = require("./src/models/User");
const Course = require("./src/models/Course");
const Log = require("./src/models/Log");
const Lesson = require("./src/models/Lesson");

const app = express();
app.use((req, res, next) => {
  console.log("➡️ Incoming request:", req.method, req.originalUrl);
  next();
});

const PORT = process.env.PORT || 3000;

// Middleware
app.use(
  cors({
    origin: process.env.CORS_ORIGIN || "*",
    credentials: true,
  })
);
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Swagger documentation
app.use("/api-docs", swaggerUi.serve, swaggerUi.setup(swaggerSpec));

// Health check
app.get("/health", (req, res) => {
  res.status(200).json({
    success: true,
    message: "Server is running",
    timestamp: new Date().toISOString(),
  });
});

// API Routes
app.use("/api/auth", authRoutes);
app.use("/api/courses", courseRoutes);
app.use("/api/ai", aiRoutes);
app.use("/api/recommendations", recommendationRoutes);
app.use("/api/logs", logRoutes);
app.use("/api/lessons", lessonRoutes);

// 404 handler
app.use((req, res) => {
  res.status(404).json({
    success: false,
    message: "Route not found",
  });
});

// Error handler
app.use((err, req, res, next) => {
  console.error("Error:", err);
  res.status(err.status || 500).json({
    success: false,
    message: err.message || "Internal server error",
    ...(process.env.NODE_ENV === "development" && { stack: err.stack }),
  });
});

// Initialize database and start server
const startServer = async () => {
  try {
    // Test database connection
    await testConnection();

    // Sync database models
    // Note: In production, use migrations instead of force: false
    await User.sync({ alter: false });
    await Course.sync({ alter: false });
    await Log.sync({ alter: false });
    await Lesson.sync({ alter: true }); 

    console.log("✅ Database models synchronized.");

    // Start server
    app.listen(PORT, () => {
      console.log(`🚀 Server is running on http://localhost:${PORT}`);
      console.log(`📚 API Documentation: http://localhost:${PORT}/api-docs`);
      console.log(`🏥 Health Check: http://localhost:${PORT}/health`);
    });
  } catch (error) {
    console.error("❌ Failed to start server:", error);
    process.exit(1);
  }
};

startServer();

console.log("JWT_SECRET:", process.env.JWT_SECRET);
console.log("DATABASE_URL:", process.env.DATABASE_URL);


module.exports = app;
