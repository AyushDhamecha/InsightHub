"use client"

import { createContext, useContext, useState, useEffect } from "react"
import { sampleUsers, getRandomUsers } from "./sampleUsers"
import axios from "axios"

const ProjectContext = createContext()

export const useProjects = () => {
  const context = useContext(ProjectContext)
  if (!context) {
    throw new Error("useProjects must be used within a ProjectProvider")
  }
  return context
}

export const ProjectProvider = ({ children }) => {
  const [projects, setProjects] = useState([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    axios
      .get("http://localhost:5000/projects")
      .then((response) => {
        const formattedProjects = response.data.map((project) => ({
          id: project._id,
          name: project.title,
          description: project.description,
          assignedUsers: project.people.map((name, index) => ({
            id: index + 1,
            name,
            avatar: name.charAt(0).toUpperCase(),
            color: getRandomUserColor(index),
          })),
          status: mapStatus(project.status),
          completion: project.completedPercentage,
          dueDate: new Date(project.dueDate).toISOString().split("T")[0], // Format to YYYY-MM-DD
          createdAt: project.createdAt,
          priority: project.priority,
          tags: project.tags,
          tasks: formatTasks(project.taskDetails),
        }))

        setProjects(formattedProjects)
        setLoading(false)
      })
      .catch((error) => {
        console.error("Error fetching data:", error)
        // Fallback to sample data if API fails
        const sampleProjects = [
          {
            id: 1,
            name: "Banking App Redesign",
            description: "Complete redesign of the mobile banking application with new UI/UX",
            assignedUsers: getRandomUsers(3),
            status: "in-progress",
            completion: 67,
            dueDate: "2025-02-15",
            createdAt: new Date().toISOString(),
            priority: "high",
            tags: ["Design", "Mobile", "Banking"],
          },
          {
            id: 2,
            name: "E-commerce Platform",
            description: "Development of a new e-commerce platform with modern features",
            assignedUsers: getRandomUsers(2),
            status: "created-now",
            completion: 0,
            dueDate: "2025-03-01",
            createdAt: new Date().toISOString(),
            priority: "medium",
            tags: ["Development", "E-commerce"],
          },
          {
            id: 3,
            name: "Marketing Website",
            description: "New marketing website for product launch",
            assignedUsers: getRandomUsers(4),
            status: "completed",
            completion: 100,
            dueDate: "2025-01-20",
            createdAt: new Date().toISOString(),
            priority: "low",
            tags: ["Marketing", "Website"],
          },
        ]
        setProjects(sampleProjects)
        setLoading(false)
      })
  }, [])

  // Helper function to map MongoDB status to our app's status format
  const mapStatus = (status) => {
    const statusMap = {
      "in progress": "in-progress",
      created: "created-now",
      completed: "completed",
    }
    return statusMap[status] || status
  }

  // Helper function to generate consistent colors for users
  const getRandomUserColor = (index) => {
    const colors = [
      "bg-blue-500",
      "bg-green-500",
      "bg-yellow-500",
      "bg-red-500",
      "bg-purple-500",
      "bg-pink-500",
      "bg-indigo-500",
      "bg-teal-500",
    ]
    return colors[index % colors.length]
  }

  // Helper function to format task details
  const formatTasks = (taskDetails) => {
    if (!taskDetails) return []

    const allTasks = [
      ...(taskDetails.todo || []).map((task) => ({
        ...task,
        id: task._id,
        status: "todo",
      })),
      ...(taskDetails.inProgress || []).map((task) => ({
        ...task,
        id: task._id,
        status: "in-progress",
      })),
      ...(taskDetails.done || []).map((task) => ({
        ...task,
        id: task._id,
        status: "done",
      })),
    ]

    return allTasks
  }

  // Save projects to localStorage whenever projects change
  useEffect(() => {
    if (!loading) {
      localStorage.setItem("dashboard-projects", JSON.stringify(projects))
    }
  }, [projects, loading])

  const addProject = (projectData) => {
    const newProject = {
      id: Date.now(),
      ...projectData,
      createdAt: new Date().toISOString(),
      completion: 0,
    }
    setProjects((prev) => [newProject, ...prev])
    return newProject
  }

  const updateProject = (id, updates) => {
    setProjects((prev) => prev.map((project) => (project.id === id ? { ...project, ...updates } : project)))
  }

  const deleteProject = (id) => {
    setProjects((prev) => prev.filter((project) => project.id !== id))
  }

  const getProjectsByStatus = (status) => {
    return projects.filter((project) => project.status === status)
  }

  const getRecentProjects = (limit = 5) => {
    return projects.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt)).slice(0, limit)
  }

  const getProjectStats = () => {
    const total = projects.length
    const completed = projects.filter((p) => p.status === "completed").length
    const inProgress = projects.filter((p) => p.status === "in-progress").length
    const created = projects.filter((p) => p.status === "created-now").length

    return {
      total,
      completed,
      inProgress,
      created,
      completionRate: total > 0 ? Math.round((completed / total) * 100) : 0,
    }
  }

  const value = {
    projects,
    loading,
    addProject,
    updateProject,
    deleteProject,
    getProjectsByStatus,
    getRecentProjects,
    getProjectStats,
    sampleUsers,
  }

  return <ProjectContext.Provider value={value}>{children}</ProjectContext.Provider>
}
