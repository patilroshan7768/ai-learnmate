const express = require('express');
const router = express.Router();
const { body } = require('express-validator');
const {
  createCourse,
  getAllCourses,
  getCourseById,
  updateCourse,
  deleteCourse
} = require('../controllers/courseController');
const { authenticate, authorize } = require('../middlewares/auth');

// Validation rules
const courseValidation = [
  body('title').trim().notEmpty().withMessage('Title is required'),
  body('description').optional().trim(),
  body('category').optional().trim()
];

/**
 * @swagger
 * /api/courses:
 *   post:
 *     summary: Create a new course (Teacher only)
 *     tags: [Courses]
 *     security:
 *       - bearerAuth: []
 */
router.post('/', authenticate, authorize('teacher'), courseValidation, createCourse);

/**
 * @swagger
 * /api/courses:
 *   get:
 *     summary: Get all courses
 *     tags: [Courses]
 */
router.get('/', getAllCourses);

/**
 * @swagger
 * /api/courses/{id}:
 *   get:
 *     summary: Get course by ID
 *     tags: [Courses]
 */
router.get('/:id', getCourseById);

/**
 * @swagger
 * /api/courses/{id}:
 *   put:
 *     summary: Update course (Teacher only, own courses)
 *     tags: [Courses]
 *     security:
 *       - bearerAuth: []
 */
router.put('/:id', authenticate, authorize('teacher'), courseValidation, updateCourse);

/**
 * @swagger
 * /api/courses/{id}:
 *   delete:
 *     summary: Delete course (Teacher only, own courses)
 *     tags: [Courses]
 *     security:
 *       - bearerAuth: []
 */
router.delete('/:id', authenticate, authorize('teacher'), deleteCourse);

module.exports = router;

