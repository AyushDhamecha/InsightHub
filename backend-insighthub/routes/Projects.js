const express = require('express');
const router = express.Router();
const Project = require('../models/Projects');

// GET all projects
router.get('/', async (req, res) => {
  try {
    const projects = await Project.find();
    console.log("Fetched Projects:", projects);  // Also logs to terminal
    res.status(200).json(projects);
  } catch (error) {
    res.status(500).json({ message: "Error fetching projects", error });
  }
});

module.exports = router;
