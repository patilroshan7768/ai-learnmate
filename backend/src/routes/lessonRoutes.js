const express = require("express");
const router = express.Router();
const {
  createLesson,
  getLessonsByCourse,
  deleteLesson 
} = require("../controllers/lessonController");

router.post("/", createLesson);
router.get("/:courseId", getLessonsByCourse);
router.delete("/:id", deleteLesson);

module.exports = router;