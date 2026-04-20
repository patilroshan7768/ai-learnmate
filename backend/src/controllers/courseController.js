const Course = require('../models/Course');
const User = require('../models/User');
const { validationResult } = require('express-validator');
const { logAction } = require('../utils/logger');

const createCourse = async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ 
        success: false, 
        errors: errors.array() 
      });
    }

    const { title, description, category } = req.body;

    const course = await Course.create({
      title,
      description,
      category,
      createdBy: req.user.id
    });

    const courseWithCreator = await Course.findByPk(course.id, {
      include: [{
        model: User,
        as: 'creator',
        attributes: ['id', 'name', 'email']
      }]
    });

    // Log action
    await logAction(req.user.id, 'course_created', 'success');

    res.status(201).json({
      success: true,
      message: 'Course created successfully.',
      data: { course: courseWithCreator }
    });
  } catch (error) {
    res.status(500).json({ 
      success: false, 
      message: 'Failed to create course.', 
      error: error.message 
    });
  }
};

const getAllCourses = async (req, res) => {
  try {
    const courses = await Course.findAll({
      include: [{
        model: User,
        as: 'creator',
        attributes: ['id', 'name', 'email']
      }],
      order: [['createdAt', 'DESC']]
    });

    res.status(200).json({
      success: true,
      count: courses.length,
      data: { courses }
    });
  } catch (error) {
    res.status(500).json({ 
      success: false, 
      message: 'Failed to fetch courses.', 
      error: error.message 
    });
  }
};

const getCourseById = async (req, res) => {
  try {
    const { id } = req.params;

    const course = await Course.findByPk(id, {
      include: [{
        model: User,
        as: 'creator',
        attributes: ['id', 'name', 'email']
      }]
    });

    if (!course) {
      return res.status(404).json({ 
        success: false, 
        message: 'Course not found.' 
      });
    }

    res.status(200).json({
      success: true,
      data: { course }
    });
  } catch (error) {
    res.status(500).json({ 
      success: false, 
      message: 'Failed to fetch course.', 
      error: error.message 
    });
  }
};

const updateCourse = async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ 
        success: false, 
        errors: errors.array() 
      });
    }

    const { id } = req.params;
    const { title, description, category } = req.body;

    const course = await Course.findByPk(id);

    if (!course) {
      return res.status(404).json({ 
        success: false, 
        message: 'Course not found.' 
      });
    }

    // Check if user is the creator
    if (course.createdBy !== req.user.id) {
      return res.status(403).json({ 
        success: false, 
        message: 'You can only update your own courses.' 
      });
    }

    await course.update({
      title: title || course.title,
      description: description !== undefined ? description : course.description,
      category: category || course.category
    });

    const updatedCourse = await Course.findByPk(course.id, {
      include: [{
        model: User,
        as: 'creator',
        attributes: ['id', 'name', 'email']
      }]
    });

    // Log action
    await logAction(req.user.id, 'course_updated', 'success');

    res.status(200).json({
      success: true,
      message: 'Course updated successfully.',
      data: { course: updatedCourse }
    });
  } catch (error) {
    res.status(500).json({ 
      success: false, 
      message: 'Failed to update course.', 
      error: error.message 
    });
  }
};

const deleteCourse = async (req, res) => {
  try {
    const { id } = req.params;

    const course = await Course.findByPk(id);

    if (!course) {
      return res.status(404).json({ 
        success: false, 
        message: 'Course not found.' 
      });
    }

    // Check if user is the creator
    if (course.createdBy !== req.user.id) {
      return res.status(403).json({ 
        success: false, 
        message: 'You can only delete your own courses.' 
      });
    }

    await course.destroy();

    // Log action
    await logAction(req.user.id, 'course_deleted', 'success');

    res.status(200).json({
      success: true,
      message: 'Course deleted successfully.'
    });
  } catch (error) {
    res.status(500).json({ 
      success: false, 
      message: 'Failed to delete course.', 
      error: error.message 
    });
  }
};

module.exports = {
  createCourse,
  getAllCourses,
  getCourseById,
  updateCourse,
  deleteCourse
};

