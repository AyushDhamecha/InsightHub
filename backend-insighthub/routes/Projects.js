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

module.exports = router
