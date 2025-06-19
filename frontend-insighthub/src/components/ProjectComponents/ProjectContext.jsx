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
  const API_URL = `${import.meta.env.VITE_API_BASE}/projects`


  // Fetch projects from MongoDB
  useEffect(() => {
    axios
      .get(API_URL)
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
          // Other sample projects...
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

  // Helper function to map our app's status format to MongoDB status
  const mapStatusToMongo = (status) => {
    const statusMap = {
      "in-progress": "in progress",
      "created-now": "created",
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

  const addProject = async (projectData) => {
    try {
      // Prepare data for MongoDB format
      const mongoProjectData = {
        name: projectData.name,
        description: projectData.description,
        assignedUsers: projectData.assignedUsers || [],
        status: mapStatusToMongo(projectData.status || "created-now"),
        completion: projectData.completion || 0,
        dueDate: projectData.dueDate,
        priority: projectData.priority || "medium",
        tags: projectData.tags || [],
      }

      // Send POST request to backend
      const response = await axios.post(API_URL, mongoProjectData)

      // Format the response data to match our frontend structure
      const savedProject = {
        id: response.data._id,
        name: response.data.title,
        description: response.data.description,
        assignedUsers: response.data.people.map((name, index) => ({
          id: index + 1,
          name,
          avatar: name.charAt(0).toUpperCase(),
          color: getRandomUserColor(index),
        })),
        status: mapStatus(response.data.status),
        completion: response.data.completedPercentage,
        dueDate: new Date(response.data.dueDate).toISOString().split("T")[0],
        createdAt: response.data.createdAt,
        priority: response.data.priority,
        tags: response.data.tags,
        tasks: formatTasks(response.data.taskDetails),
      }

      // Update local state
      setProjects((prev) => [savedProject, ...prev])

      console.log("Project saved to MongoDB:", savedProject)
      return savedProject
    } catch (error) {
      console.error("Error saving project to MongoDB:", error)

      // Fallback to local storage only if API fails
      const newProject = {
        id: Date.now(),
        ...projectData,
        createdAt: new Date().toISOString(),
        completion: 0,
      }
      setProjects((prev) => [newProject, ...prev])

      return newProject
    }
  }

  const updateProject = async (id, updates) => {
    try {
      // Find the current project to get its current data
      const currentProject = projects.find((project) => project.id === id)
      if (!currentProject) {
        console.error("Project not found for update:", id)
        return
      }

      // Merge current project data with updates
      const updatedProjectData = { ...currentProject, ...updates }

      // Prepare data for MongoDB format
      const mongoUpdateData = {
        name: updatedProjectData.name,
        description: updatedProjectData.description,
        assignedUsers: updatedProjectData.assignedUsers || [],
        status: mapStatusToMongo(updatedProjectData.status),
        completion: updatedProjectData.completion,
        dueDate: updatedProjectData.dueDate,
        priority: updatedProjectData.priority,
        tags: updatedProjectData.tags || [],
        tasks: updatedProjectData.tasks || [],
      }

      // Send PUT request to backend
      const response = await axios.put(`${API_URL}/${id}`, mongoUpdateData)

      // Format the response data to match our frontend structure
      const updatedProject = {
        id: response.data._id,
        name: response.data.title,
        description: response.data.description,
        assignedUsers: response.data.people.map((name, index) => ({
          id: index + 1,
          name,
          avatar: name.charAt(0).toUpperCase(),
          color: getRandomUserColor(index),
        })),
        status: mapStatus(response.data.status),
        completion: response.data.completedPercentage,
        dueDate: new Date(response.data.dueDate).toISOString().split("T")[0],
        createdAt: response.data.createdAt,
        priority: response.data.priority,
        tags: response.data.tags,
        tasks: formatTasks(response.data.taskDetails),
      }

      // Update local state
      setProjects((prev) => prev.map((project) => (project.id === id ? updatedProject : project)))

      console.log("Project updated in MongoDB:", updatedProject)
      return updatedProject
    } catch (error) {
      console.error("Error updating project in MongoDB:", error)

      // Fallback to local update only if API fails
      setProjects((prev) => prev.map((project) => (project.id === id ? { ...project, ...updates } : project)))
    }
  }

  const deleteProject = async (id) => {
    try {
      console.log("Deleting project from MongoDB:", id)

      // Send DELETE request to backend
      await axios.delete(`${API_URL}/${id}`)

      // Update local state
      setProjects((prev) => prev.filter((project) => project.id !== id))

      console.log("Project deleted from MongoDB successfully")
      return true
    } catch (error) {
      console.error("Error deleting project from MongoDB:", error)

      // Fallback to local delete only if API fails
      setProjects((prev) => prev.filter((project) => project.id !== id))
      return false
    }
  }

  // New function to update task status in MongoDB
  const updateTaskInProject = async (projectId, taskId, updates) => {
    try {
      console.log("Updating task in MongoDB:", { projectId, taskId, updates })

      // Send PUT request to backend to update task
      const response = await axios.put(`${API_URL}/${projectId}/tasks/${taskId}`, updates)

      // Format the response data to match our frontend structure
      const updatedProject = {
        id: response.data._id,
        name: response.data.title,
        description: response.data.description,
        assignedUsers: response.data.people.map((name, index) => ({
          id: index + 1,
          name,
          avatar: name.charAt(0).toUpperCase(),
          color: getRandomUserColor(index),
        })),
        status: mapStatus(response.data.status),
        completion: response.data.completedPercentage,
        dueDate: new Date(response.data.dueDate).toISOString().split("T")[0],
        createdAt: response.data.createdAt,
        priority: response.data.priority,
        tags: response.data.tags,
        tasks: formatTasks(response.data.taskDetails),
      }

      // Update local state
      setProjects((prev) => prev.map((project) => (project.id === projectId ? updatedProject : project)))

      console.log("Task updated in MongoDB successfully")
      return updatedProject
    } catch (error) {
      console.error("Error updating task in MongoDB:", error)

      // Fallback to local update only if API fails
      setProjects((prev) =>
        prev.map((project) => {
          if (project.id === projectId) {
            const updatedTasks = project.tasks.map((task) => (task.id === taskId ? { ...task, ...updates } : task))
            return { ...project, tasks: updatedTasks }
          }
          return project
        }),
      )
    }
  }

  // New function to create task in MongoDB
  const createTaskInProject = async (projectId, taskData) => {
    try {
      console.log("Creating task in MongoDB:", { projectId, taskData })

      // Send POST request to backend to create task
      const response = await axios.post(`${API_URL}/${projectId}/tasks`, taskData)

      // Format the response data to match our frontend structure
      const updatedProject = {
        id: response.data._id,
        name: response.data.title,
        description: response.data.description,
        assignedUsers: response.data.people.map((name, index) => ({
          id: index + 1,
          name,
          avatar: name.charAt(0).toUpperCase(),
          color: getRandomUserColor(index),
        })),
        status: mapStatus(response.data.status),
        completion: response.data.completedPercentage,
        dueDate: new Date(response.data.dueDate).toISOString().split("T")[0],
        createdAt: response.data.createdAt,
        priority: response.data.priority,
        tags: response.data.tags,
        tasks: formatTasks(response.data.taskDetails),
      }

      // Update local state
      setProjects((prev) => prev.map((project) => (project.id === projectId ? updatedProject : project)))

      console.log("Task created in MongoDB successfully")
      return updatedProject
    } catch (error) {
      console.error("Error creating task in MongoDB:", error)

      // Fallback to local update only if API fails
      const taskWithId = {
        ...taskData,
        id: Date.now(),
        createdAt: new Date().toISOString(),
      }

      setProjects((prev) =>
        prev.map((project) => {
          if (project.id === projectId) {
            const updatedTasks = [...(project.tasks || []), taskWithId]
            return { ...project, tasks: updatedTasks }
          }
          return project
        }),
      )
    }
  }

  // New function to delete task from MongoDB
  const deleteTaskFromProject = async (projectId, taskId) => {
    try {
      console.log("Deleting task from MongoDB:", { projectId, taskId })

      // Send DELETE request to backend to delete task
      const response = await axios.delete(`${API_URL}/${projectId}/tasks/${taskId}`)

      // Format the response data to match our frontend structure
      const updatedProject = {
        id: response.data._id,
        name: response.data.title,
        description: response.data.description,
        assignedUsers: response.data.people.map((name, index) => ({
          id: index + 1,
          name,
          avatar: name.charAt(0).toUpperCase(),
          color: getRandomUserColor(index),
        })),
        status: mapStatus(response.data.status),
        completion: response.data.completedPercentage,
        dueDate: new Date(response.data.dueDate).toISOString().split("T")[0],
        createdAt: response.data.createdAt,
        priority: response.data.priority,
        tags: response.data.tags,
        tasks: formatTasks(response.data.taskDetails),
      }

      // Update local state
      setProjects((prev) => prev.map((project) => (project.id === projectId ? updatedProject : project)))

      console.log("Task deleted from MongoDB successfully")
      return updatedProject
    } catch (error) {
      console.error("Error deleting task from MongoDB:", error)

      // Fallback to local update only if API fails
      setProjects((prev) =>
        prev.map((project) => {
          if (project.id === projectId) {
            const updatedTasks = project.tasks.filter((task) => task.id !== taskId)
            return { ...project, tasks: updatedTasks }
          }
          return project
        }),
      )
    }
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
    updateTaskInProject,
    createTaskInProject,
    deleteTaskFromProject,
    getProjectsByStatus,
    getRecentProjects,
    getProjectStats,
    sampleUsers,
  }

  return <ProjectContext.Provider value={value}>{children}</ProjectContext.Provider>
}
