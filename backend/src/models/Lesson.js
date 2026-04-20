const { DataTypes } = require("sequelize");
const { sequelize } = require("../config/database");
const Course = require("./Course");

const Lesson = sequelize.define("Lesson", {
  id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true
  },
  title: {
    type: DataTypes.STRING,
    allowNull: false
  },
  content: {
    type: DataTypes.TEXT,
    allowNull: true
  },
  videoUrl: {
    type: DataTypes.STRING,
    allowNull: true
  },
 courseId: {
  type: DataTypes.INTEGER,
  allowNull: false,
  field: "course_id"   // 🔥 THIS FIXES EVERYTHING
}
}, {
  tableName: "lessons",
  timestamps: true
});

Course.hasMany(Lesson, { foreignKey: "courseId" });
Lesson.belongsTo(Course, { foreignKey: "courseId" });

module.exports = Lesson;