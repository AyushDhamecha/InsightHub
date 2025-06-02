const mongoose = require("mongoose");

// Define the shape of each task
const SingleTaskSchema = new mongoose.Schema({
  title: { type: String, required: true },
  description: String,
  status: { type: String, enum: ["todo", "inProgress", "done"], required: true },
  priority: { type: String, enum: ["low", "medium", "high"], default: "medium" }
}, { _id: true }); // Enable auto _id for each task

// Embed task arrays for each status category
const TaskSchema = new mongoose.Schema({
  todo: [SingleTaskSchema],
  inProgress: [SingleTaskSchema],
  done: [SingleTaskSchema],
});

// Define the main Project schema
const ProjectSchema = new mongoose.Schema({
  title: { type: String, required: true },
  description: String,
  people: [String],
  completedPercentage: Number,
  dueDate: Date,
  status: { type: String, enum: ["created", "in progress", "completed"], default: "created" },
  priority: { type: String, enum: ["low", "medium", "high"], default: "medium" },
  tags: [String],
  taskDetails: TaskSchema,
}, { timestamps: true });

module.exports = mongoose.model("Project", ProjectSchema);
