const express = require("express")
const router = express.Router()
const Project = require("../models/Projects")

// GET all projects
router.get("/", async (req, res) => {
  try {
    const projects = await Project.find()
    console.log("Fetched Projects:", projects) // Also logs to terminal
    res.status(200).json(projects)
  } catch (error) {
    res.status(500).json({ message: "Error fetching projects", error })
  }
})

// POST create new project
router.post("/", async (req, res) => {
  try {
    const { name, description, assignedUsers, status, completion, dueDate, priority, tags } = req.body

    // Transform frontend data structure to match MongoDB schema
    const newProject = new Project({
      title: name,
      description,
      people: assignedUsers.map((user) => user.name),
      status: status === "created-now" ? "created" : status === "in-progress" ? "in progress" : status,
      completedPercentage: completion || 0,
      dueDate,
      priority,
      tags,
      taskDetails: {
        todo: [],
        inProgress: [],
        done: [],
      },
    })

    const savedProject = await newProject.save()
    console.log("Created new project:", savedProject)
    res.status(201).json(savedProject)
  } catch (error) {
    console.error("Error creating project:", error)
    res.status(500).json({ message: "Error creating project", error: error.message })
  }
})

// PUT update existing project
router.put("/:id", async (req, res) => {
  try {
    const { id } = req.params
    const { name, description, assignedUsers, status, completion, dueDate, priority, tags, tasks } = req.body

    // Transform frontend data structure to match MongoDB schema
    const updateData = {
      title: name,
      description,
      people: assignedUsers.map((user) => user.name),
      status: status === "created-now" ? "created" : status === "in-progress" ? "in progress" : status,
      completedPercentage: completion,
      dueDate,
      priority,
      tags,
      updatedAt: new Date(),
    }

    // If tasks are provided, update taskDetails
    if (tasks) {
      updateData.taskDetails = {
        todo: tasks
          .filter((task) => task.status === "todo")
          .map((task) => ({
            title: task.title,
            description: task.description,
            status: "todo",
            priority: task.priority,
          })),
        inProgress: tasks
          .filter((task) => task.status === "in-progress")
          .map((task) => ({
            title: task.title,
            description: task.description,
            status: "inProgress",
            priority: task.priority,
          })),
        done: tasks
          .filter((task) => task.status === "done")
          .map((task) => ({
            title: task.title,
            description: task.description,
            status: "done",
            priority: task.priority,
          })),
      }
    }

    const updatedProject = await Project.findByIdAndUpdate(id, updateData, {
      new: true, // Return the updated document
      runValidators: true, // Run schema validators
    })

    if (!updatedProject) {
      return res.status(404).json({ message: "Project not found" })
    }

    console.log("Updated project:", updatedProject)
    res.status(200).json(updatedProject)
  } catch (error) {
    console.error("Error updating project:", error)
    res.status(500).json({ message: "Error updating project", error: error.message })
  }
})

// PUT update task status in a project
router.put("/:id/tasks/:taskId", async (req, res) => {
  try {
    const { id, taskId } = req.params
    const { status, title, description, priority } = req.body

    const project = await Project.findById(id)
    if (!project) {
      return res.status(404).json({ message: "Project not found" })
    }

    // Find and remove the task from its current location
    let taskToMove = null
    const taskDetails = project.taskDetails

    // Search in all status arrays
    for (const statusKey of ["todo", "inProgress", "done"]) {
      const taskIndex = taskDetails[statusKey].findIndex((task) => task._id.toString() === taskId)
      if (taskIndex !== -1) {
        taskToMove = taskDetails[statusKey][taskIndex]
        taskDetails[statusKey].splice(taskIndex, 1)
        break
      }
    }

    if (!taskToMove) {
      return res.status(404).json({ message: "Task not found" })
    }

    // Update task properties if provided
    if (title !== undefined) taskToMove.title = title
    if (description !== undefined) taskToMove.description = description
    if (priority !== undefined) taskToMove.priority = priority

    // Map frontend status to MongoDB status
    const mongoStatus = status === "in-progress" ? "inProgress" : status === "todo" ? "todo" : "done"
    taskToMove.status = mongoStatus

    // Add task to new status array
    taskDetails[mongoStatus].push(taskToMove)

    // Save the updated project
    const updatedProject = await project.save()

    console.log("Updated task status:", { taskId, newStatus: status })
    res.status(200).json(updatedProject)
  } catch (error) {
    console.error("Error updating task status:", error)
    res.status(500).json({ message: "Error updating task status", error: error.message })
  }
})

// POST create new task in a project
router.post("/:id/tasks", async (req, res) => {
  try {
    const { id } = req.params
    const { title, description, status, priority, assignee } = req.body

    const project = await Project.findById(id)
    if (!project) {
      return res.status(404).json({ message: "Project not found" })
    }

    // Create new task
    const newTask = {
      title,
      description,
      status: status === "in-progress" ? "inProgress" : status === "todo" ? "todo" : "done",
      priority: priority || "medium",
    }

    // Add task to appropriate status array
    const mongoStatus = status === "in-progress" ? "inProgress" : status === "todo" ? "todo" : "done"
    project.taskDetails[mongoStatus].push(newTask)

    // Save the updated project
    const updatedProject = await project.save()

    console.log("Created new task:", newTask)
    res.status(201).json(updatedProject)
  } catch (error) {
    console.error("Error creating task:", error)
    res.status(500).json({ message: "Error creating task", error: error.message })
  }
})

// DELETE task from a project
router.delete("/:id/tasks/:taskId", async (req, res) => {
  try {
    const { id, taskId } = req.params

    const project = await Project.findById(id)
    if (!project) {
      return res.status(404).json({ message: "Project not found" })
    }

    // Find and remove the task from its current location
    let taskRemoved = false
    const taskDetails = project.taskDetails

    // Search in all status arrays
    for (const statusKey of ["todo", "inProgress", "done"]) {
      const taskIndex = taskDetails[statusKey].findIndex((task) => task._id.toString() === taskId)
      if (taskIndex !== -1) {
        taskDetails[statusKey].splice(taskIndex, 1)
        taskRemoved = true
        break
      }
    }

    if (!taskRemoved) {
      return res.status(404).json({ message: "Task not found" })
    }

    // Save the updated project
    const updatedProject = await project.save()

    console.log("Deleted task:", taskId)
    res.status(200).json(updatedProject)
  } catch (error) {
    console.error("Error deleting task:", error)
    res.status(500).json({ message: "Error deleting task", error: error.message })
  }
})

module.exports = router
