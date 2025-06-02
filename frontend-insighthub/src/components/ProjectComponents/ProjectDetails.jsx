"use client"

import { motion } from "framer-motion"
import { useState, useEffect } from "react"
import { useNavigate, useParams } from "react-router-dom"
import { useProjects } from "./ProjectContext"
import KanbanBoard from "./KanbanBoard"
import ProjectAnalytics from "./ProjectAnalytics"
import ProjectStatusBadge from "./ProjectStatusBadge"

const ProjectDetails = ({ projectId }) => {
  const navigate = useNavigate()
  // Fallback to useParams if projectId is not passed as prop
  const { id: paramId } = useParams()
  const actualProjectId = projectId || paramId

  const { projects, updateProject, updateTaskInProject, createTaskInProject, deleteTaskFromProject } = useProjects()
  const [project, setProject] = useState(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    console.log("ProjectDetails mounted with ID:", actualProjectId)
    console.log("Available projects:", projects)

    const foundProject = projects.find((p) => p.id.toString() === actualProjectId?.toString())
    console.log("Found project:", foundProject)

    if (foundProject) {
      // Initialize tasks if they don't exist
      if (!foundProject.tasks || foundProject.tasks.length === 0) {
        const initialTasks = [
          {
            id: Date.now() + 1,
            title: "Design wireframes",
            description: "Create initial wireframes for the project",
            status: "todo",
            priority: "high",
            assignee: foundProject.assignedUsers?.[0] || null,
            createdAt: new Date().toISOString(),
          },
          {
            id: Date.now() + 2,
            title: "Setup development environment",
            description: "Configure development tools and dependencies",
            status: "in-progress",
            priority: "medium",
            assignee: foundProject.assignedUsers?.[1] || null,
            createdAt: new Date().toISOString(),
          },
          {
            id: Date.now() + 3,
            title: "Research competitors",
            description: "Analyze competitor solutions and features",
            status: "done",
            priority: "low",
            assignee: foundProject.assignedUsers?.[2] || null,
            createdAt: new Date().toISOString(),
          },
        ]
        const updatedProject = { ...foundProject, tasks: initialTasks }
        updateProject(foundProject.id, { tasks: initialTasks })
        setProject(updatedProject)
      } else {
        setProject(foundProject)
      }
    }
    setLoading(false)
  }, [actualProjectId, projects, updateProject])

  // Update project state when projects context changes
  useEffect(() => {
    if (actualProjectId && projects.length > 0) {
      const updatedProject = projects.find((p) => p.id.toString() === actualProjectId?.toString())
      if (updatedProject) {
        setProject(updatedProject)
      }
    }
  }, [projects, actualProjectId])

  const handleTaskUpdate = async (taskId, updates) => {
    if (!project) return

    console.log("Handling task update:", { taskId, updates, projectId: project.id })

    try {
      // Update task in MongoDB via context
      await updateTaskInProject(project.id, taskId, updates)
      console.log("Task updated successfully in MongoDB")
    } catch (error) {
      console.error("Error updating task:", error)
    }
  }

  const handleTaskCreate = async (newTask) => {
    if (!project) return

    console.log("Handling task creation:", { newTask, projectId: project.id })

    try {
      // Create task in MongoDB via context
      await createTaskInProject(project.id, newTask)
      console.log("Task created successfully in MongoDB")
    } catch (error) {
      console.error("Error creating task:", error)
    }
  }

  const handleTaskDelete = async (taskId) => {
    if (!project) return

    console.log("Handling task deletion:", { taskId, projectId: project.id })

    try {
      // Delete task from MongoDB via context
      await deleteTaskFromProject(project.id, taskId)
      console.log("Task deleted successfully from MongoDB")
    } catch (error) {
      console.error("Error deleting task:", error)
    }
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 flex items-center justify-center">
        <motion.div
          animate={{ rotate: 360 }}
          transition={{ duration: 1, repeat: Number.POSITIVE_INFINITY, ease: "linear" }}
          className="w-8 h-8 border-2 border-blue-500 border-t-transparent rounded-full"
        />
      </div>
    )
  }

  if (!project) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-gray-900 mb-4">Project Not Found</h1>
          <p className="text-gray-600 mb-4">Project ID: {actualProjectId}</p>
          <button
            onClick={() => navigate("/projects")}
            className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
          >
            Back to Projects
          </button>
        </div>
      </div>
    )
  }

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1,
      },
    },
  }

  const headerVariants = {
    hidden: { opacity: 0, y: -20 },
    visible: { opacity: 1, y: 0 },
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100">
      <motion.div variants={containerVariants} initial="hidden" animate="visible" className="p-6 space-y-6">
        {/* Header */}
        <motion.div variants={headerVariants} className="flex items-center justify-between">
          <div className="flex items-center space-x-4">
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={() => navigate("/projects")}
              className="p-2 text-gray-500 hover:text-gray-700 rounded-lg hover:bg-white/50 transition-colors"
            >
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
              </svg>
            </motion.button>
            <div>
              <h1 className="text-3xl font-bold text-gray-900">{project.name}</h1>
              <p className="text-gray-600 mt-1">{project.description}</p>
            </div>
          </div>
          <div className="flex items-center space-x-4">
            <ProjectStatusBadge status={project.status} size="lg" />
            <div className="flex -space-x-2">
              {project.assignedUsers?.slice(0, 3).map((user) => (
                <div
                  key={user.id}
                  className={`w-10 h-10 ${user.color} rounded-full border-2 border-white flex items-center justify-center text-white font-semibold shadow-sm`}
                  title={user.name}
                >
                  {user.avatar}
                </div>
              ))}
            </div>
          </div>
        </motion.div>

        {/* Main Content */}
        <div className="flex gap-6">
          {/* Kanban Board - 60% width */}
          <motion.div variants={headerVariants} className="flex-1" style={{ width: "60%" }}>
            <KanbanBoard
              project={project}
              onTaskUpdate={handleTaskUpdate}
              onTaskCreate={handleTaskCreate}
              onTaskDelete={handleTaskDelete}
            />
          </motion.div>

          {/* Analytics Section - 40% width */}
          <motion.div variants={headerVariants} className="w-2/5">
            <ProjectAnalytics project={project} />
          </motion.div>
        </div>
      </motion.div>
    </div>
  )
}

export default ProjectDetails
