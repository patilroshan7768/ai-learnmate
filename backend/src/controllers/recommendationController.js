const Course = require('../models/Course');
const User = require('../models/User');
const Log = require('../models/Log');

const getRecommendations = async (req, res) => {
  try {
    const { userId } = req.params;

    // 1️⃣ Verify user exists
    const user = await User.findByPk(userId);
    if (!user) {
      return res.status(404).json({
        success: false,
        message: 'User not found.'
      });
    }

    // 2️⃣ Fetch recent learning activity
    const recentLogs = await Log.findAll({
      where: { userId },
      order: [['createdAt', 'DESC']],
      limit: 5
    });

    // 3️⃣ Determine user engagement level
    let engagementLevel = 'low';

    if (recentLogs.length >= 4) {
      engagementLevel = 'high';
    } else if (recentLogs.length >= 2) {
      engagementLevel = 'medium';
    }

    // 4️⃣ Adaptive recommendation logic
    let recommendedCourses;

    if (user.role === 'student') {
      // Students → latest + diverse categories
      recommendedCourses = await Course.findAll({
        where: {
          createdBy: { $ne: userId }
        },
        order: [['createdAt', 'DESC']],
        limit: 5
      });
    } else {
      // Teachers → popular or recent courses
      recommendedCourses = await Course.findAll({
        order: [['createdAt', 'DESC']],
        limit: 5
      });
    }

    // 5️⃣ Fallback if no adaptive recommendations
if (recommendedCourses.length === 0) {
  recommendedCourses = await Course.findAll({
    order: [['createdAt', 'DESC']],
    limit: 5
  });
}

return res.status(200).json({
  success: true,
  message: 'Adaptive recommendations fetched successfully.',
  data: {
    userId: parseInt(userId),
    role: user.role,
    engagementLevel,
    recommendedCourses,
    count: recommendedCourses.length,
    fallbackUsed: recommendedCourses.length > 0
  }
});


  } catch (error) {
    return res.status(500).json({
      success: false,
      message: 'Failed to fetch recommendations.',
      error: error.message
    });
  }
};

module.exports = { getRecommendations };
