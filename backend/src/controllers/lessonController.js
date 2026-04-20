const Lesson = require("../models/Lesson");

exports.createLesson = async (req, res) => {
  try {
    const { title, content, videoUrl, courseId } = req.body;

    const lesson = await Lesson.create({
      title,
      content,
      videoUrl,
      courseId
    });

    res.json({ success: true, data: lesson });
  } catch (err) {
    console.error("🔥 FULL ERROR:", err);
    console.error("🔥 MESSAGE:", err.message);
    console.error("🔥 STACK:", err.stack);
    res.status(500).json({ error: err.message });
  }
};

exports.getLessonsByCourse = async (req, res) => {
  try {
    const { courseId } = req.params;

    const lessons = await Lesson.findAll({
      where: { courseId }
    });

    res.json({ success: true, data: lessons });
  } catch (err) {
    console.error("FULL ERROR:", err);
    res.status(500).json({ error: err.message });
  }
};

exports.deleteLesson = async (req, res) => {
  try {
    const { id } = req.params;

    const lesson = await Lesson.findByPk(id);

    if (!lesson) {
      return res.status(404).json({ message: "Lesson not found" });
    }

    await lesson.destroy();

    res.json({ success: true, message: "Lesson deleted" });
  } catch (err) {
    console.error("DELETE ERROR:", err);
    res.status(500).json({ error: err.message });
  }
};