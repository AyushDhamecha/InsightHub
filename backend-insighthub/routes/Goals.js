const express = require("express")
const router = express.Router()
const Goal = require("../models/Goals")

// GET all goals
router.get("/", async (req, res) => {
  try {
    const goals = await Goal.find().sort({ createdAt: -1 })
    res.json(goals)
  } catch (error) {
    console.error("Error fetching goals:", error)
    res.status(500).json({ message: "Error fetching goals", error: error.message })
  }
})

// GET a single goal by ID
router.get("/:id", async (req, res) => {
  try {
    const goal = await Goal.findById(req.params.id)
    if (!goal) {
      return res.status(404).json({ message: "Goal not found" })
    }
    res.json(goal)
  } catch (error) {
    console.error("Error fetching goal:", error)
    res.status(500).json({ message: "Error fetching goal", error: error.message })
  }
})

// POST create a new goal
router.post("/", async (req, res) => {
  try {
    const { title, priority = "medium" } = req.body

    if (!title || title.trim() === "") {
      return res.status(400).json({ message: "Title is required" })
    }

    const newGoal = new Goal({
      title: title.trim(),
      priority,
      completed: false,
    })

    const savedGoal = await newGoal.save()
    res.status(201).json(savedGoal)
  } catch (error) {
    console.error("Error creating goal:", error)
    res.status(500).json({ message: "Error creating goal", error: error.message })
  }
})

// PUT update a goal
router.put("/:id", async (req, res) => {
  try {
    const { title, priority, completed } = req.body

    const updateData = {}
    if (title !== undefined) updateData.title = title.trim()
    if (priority !== undefined) updateData.priority = priority
    if (completed !== undefined) updateData.completed = completed

    const updatedGoal = await Goal.findByIdAndUpdate(req.params.id, updateData, { new: true, runValidators: true })

    if (!updatedGoal) {
      return res.status(404).json({ message: "Goal not found" })
    }

    res.json(updatedGoal)
  } catch (error) {
    console.error("Error updating goal:", error)
    res.status(500).json({ message: "Error updating goal", error: error.message })
  }
})

// PATCH toggle goal completion status
router.patch("/:id/toggle", async (req, res) => {
  try {
    const goal = await Goal.findById(req.params.id)
    if (!goal) {
      return res.status(404).json({ message: "Goal not found" })
    }

    goal.completed = !goal.completed
    const updatedGoal = await goal.save()

    res.json(updatedGoal)
  } catch (error) {
    console.error("Error toggling goal:", error)
    res.status(500).json({ message: "Error toggling goal", error: error.message })
  }
})

// DELETE a goal
router.delete("/:id", async (req, res) => {
  try {
    const deletedGoal = await Goal.findByIdAndDelete(req.params.id)

    if (!deletedGoal) {
      return res.status(404).json({ message: "Goal not found" })
    }

    res.json({ message: "Goal deleted successfully", goal: deletedGoal })
  } catch (error) {
    console.error("Error deleting goal:", error)
    res.status(500).json({ message: "Error deleting goal", error: error.message })
  }
})

// DELETE all completed goals
router.delete("/completed/all", async (req, res) => {
  try {
    const result = await Goal.deleteMany({ completed: true })
    res.json({
      message: `${result.deletedCount} completed goals deleted successfully`,
      deletedCount: result.deletedCount,
    })
  } catch (error) {
    console.error("Error deleting completed goals:", error)
    res.status(500).json({ message: "Error deleting completed goals", error: error.message })
  }
})

module.exports = router
