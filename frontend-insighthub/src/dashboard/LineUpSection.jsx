"use client"

import { motion } from "framer-motion"
import { useState, useEffect } from "react"
import { useProjects } from "../components/ProjectComponents/ProjectContext"
import { useNavigate } from "react-router-dom"
import CreateProjectForm from "../components/ProjectComponents/CreateProjectForm"

const LineUpSection = () => {
  const { projects, loading } = useProjects()
  const navigate = useNavigate()
  const [lineupItems, setLineupItems] = useState([])
  const [showCreateForm, setShowCreateForm] = useState(false)

  // Get the 3 projects closest to their due dates
  const getClosestProjects = () => {
    const now = new Date()

    return projects
      .filter((project) => project.status !== "completed") // Exclude completed projects
      .map((project) => {
        const dueDate = new Date(project.dueDate)
        const timeLeft = Math.max(0, Math.floor((dueDate - now) / 1000)) // Time left in seconds

        return {
          ...project,
          timeLeft,
          dueDate,
        }
      })
      .sort((a, b) => a.timeLeft - b.timeLeft) // Sort by time left (closest first)
      .slice(0, 3) // Take only the first 3
  }

  // Get background color based on index
  const getCardColor = (index) => {
    const colors = [
      { bg: "bg-white", text: "text-gray-900" },
      { bg: "bg-[#c0c954]", text: "text-white" },
      { bg: "bg-[#FFC275]", text: "text-gray-900" },
    ]
    return colors[index] || { bg: "bg-gray-100", text: "text-gray-900" }
  }

  // Get platform/category from tags
  const getPlatform = (project) => {
    return project.tags && project.tags.length > 0
      ? project.tags[0].charAt(0).toUpperCase() + project.tags[0].slice(1)
      : "General"
  }

  useEffect(() => {
    if (!loading && projects.length > 0) {
      const closestProjects = getClosestProjects()
      setLineupItems(closestProjects)
    }
  }, [projects, loading])

  // Update countdown timers every second
  useEffect(() => {
    const timer = setInterval(() => {
      setLineupItems((prev) =>
        prev.map((item) => ({
          ...item,
          timeLeft: Math.max(0, item.timeLeft - 1),
        })),
      )
    }, 1000)

    return () => clearInterval(timer)
  }, [])

  const formatTime = (seconds) => {
    if (seconds <= 0) return "Overdue"

    const days = Math.floor(seconds / (24 * 3600))
    const hours = Math.floor((seconds % (24 * 3600)) / 3600)
    const minutes = Math.floor((seconds % 3600) / 60)

    if (days > 0) {
      return `${days}d ${hours}h`
    } else if (hours > 0) {
      return `${hours}h ${minutes}m`
    } else {
      return `${minutes}m`
    }
  }

  const handleCardClick = (projectId) => {
    navigate(`/projects/${projectId}`)
  }

  const handleCreateProject = () => {
    setShowCreateForm(true)
  }

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.2,
      },
    },
  }

  const cardVariants = {
    hidden: { opacity: 0, y: 20, scale: 0.95 },
    visible: {
      opacity: 1,
      y: 0,
      scale: 1,
      transition: {
        duration: 0.5,
        ease: "easeOut",
      },
    },
  }

  if (loading) {
    return (
      <div className="mb-6 lg:mb-8">
        <h2 className="text-lg lg:text-xl font-semibold text-gray-900 mb-4">
          LineUp <span className="text-gray-500">(Loading...)</span>
        </h2>
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
          {[1, 2, 3].map((i) => (
            <div key={i} className="bg-gray-200 animate-pulse rounded-xl h-48"></div>
          ))}
        </div>
      </div>
    )
  }

  return (
    <div className="mb-6 lg:mb-8">
      <motion.h2
        initial={{ opacity: 0, x: -20 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ duration: 0.5 }}
        className="text-lg lg:text-xl font-semibold text-gray-900 mb-4"
      >
        LineUp <span className="text-gray-500">({lineupItems.length})</span>
      </motion.h2>

      <motion.div
        variants={containerVariants}
        initial="hidden"
        animate="visible"
        className="grid grid-cols-1 lg:grid-cols-2 gap-4"
      >
        {/* Project Cards */}
        {lineupItems.map((item, index) => {
          const cardColor = getCardColor(index)
          return (
            <motion.div
              key={item.id}
              variants={cardVariants}
              whileHover={{
                scale: 1.02,
                transition: { duration: 0.2 },
              }}
              whileTap={{ scale: 0.98 }}
              onClick={() => handleCardClick(item.id)}
              className={`${cardColor.bg} ${cardColor.text} rounded-xl p-4 lg:p-6 cursor-pointer shadow-lg hover:shadow-xl transition-shadow duration-300`}
            >
              <motion.div
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.3 + index * 0.1 }}
                className="mb-4"
              >
                <p className="text-xs lg:text-sm opacity-80 mb-1">{getPlatform(item)}</p>
                <h3 className="font-semibold text-base lg:text-lg">{item.name}</h3>
              </motion.div>

              <div className="flex items-center justify-between mb-4">
                <motion.div
                  className="text-2xl lg:text-3xl font-bold"
                  initial={{ scale: 0 }}
                  animate={{ scale: 1 }}
                  transition={{ delay: 0.5 + index * 0.1, type: "spring", stiffness: 200 }}
                >
                  {item.completion}%
                </motion.div>
                <motion.div
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 0.7 + index * 0.1 }}
                  className="flex items-center space-x-2"
                >
                  <motion.svg
                    className="w-4 h-4"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                    animate={{ rotate: 360 }}
                    transition={{ duration: 2, repeat: Number.POSITIVE_INFINITY, ease: "linear" }}
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"
                    />
                  </motion.svg>
                  <span className="text-xs lg:text-sm font-mono">{formatTime(item.timeLeft)}</span>
                </motion.div>
              </div>

              <div className="flex items-center justify-between">
                <div className="flex -space-x-2">
                  {item.assignedUsers?.slice(0, 3).map((user, avatarIndex) => (
                    <motion.div
                      key={user.name}
                      initial={{ scale: 0, x: -20 }}
                      animate={{ scale: 1, x: 0 }}
                      transition={{ delay: 0.9 + index * 0.1 + avatarIndex * 0.05 }}
                      whileHover={{ scale: 1.2, zIndex: 10 }}
                      className="w-6 h-6 lg:w-7 lg:h-7 bg-white bg-opacity-20 rounded-full border-2 border-white flex items-center justify-center text-white text-xs font-semibold cursor-pointer"
                      title={user.name}
                    >
                      {user.name.charAt(0)}
                    </motion.div>
                  ))}
                  {item.assignedUsers?.length > 3 && (
                    <motion.div
                      initial={{ scale: 0, x: -20 }}
                      animate={{ scale: 1, x: 0 }}
                      transition={{ delay: 0.9 + index * 0.1 + 0.15 }}
                      className="w-6 h-6 lg:w-7 lg:h-7 bg-white bg-opacity-20 rounded-full border-2 border-white flex items-center justify-center text-white text-xs font-semibold"
                    >
                      +{item.assignedUsers.length - 3}
                    </motion.div>
                  )}
                </div>

                <motion.button
                  whileHover={{ scale: 1.1, rotate: 90 }}
                  whileTap={{ scale: 0.9 }}
                  className="p-2 bg-white bg-opacity-20 rounded-lg hover:bg-opacity-30 transition-all duration-200"
                  onClick={(e) => {
                    e.stopPropagation()
                    handleCardClick(item.id)
                  }}
                >
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                  </svg>
                </motion.button>
              </div>

              {/* Progress Bar */}
              <motion.div
                initial={{ width: 0 }}
                animate={{ width: "100%" }}
                transition={{ delay: 1 + index * 0.1, duration: 0.8 }}
                className="mt-4 bg-blue-400 bg-opacity-20 rounded-full h-1 overflow-hidden"
              >
                <motion.div
                  initial={{ width: 0 }}
                  animate={{ width: `${item.completion}%` }}
                  transition={{ delay: 1.2 + index * 0.1, duration: 1, ease: "easeOut" }}
                  className="h-full bg-white rounded-full"
                />
              </motion.div>
            </motion.div>
          )
        })}

        {/* Add Project Card */}
        <motion.div
          variants={cardVariants}
          whileHover={{
            scale: 1.02,
            transition: { duration: 0.2 },
          }}
          whileTap={{ scale: 0.98 }}
          onClick={handleCreateProject}
          className="bg-white border-2 border-dashed border-gray-300 rounded-xl p-4 lg:p-6 cursor-pointer hover:border-blue-400 hover:bg-blue-50 transition-all duration-300 flex items-center justify-center min-h-[200px]"
        >
          <motion.div
            className="text-center"
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.5 }}
          >
            <motion.div
              whileHover={{ scale: 1.1, rotate: 90 }}
              whileTap={{ scale: 0.9 }}
              className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-3"
            >
              <svg className="w-6 h-6 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
              </svg>
            </motion.div>
            <h3 className="text-lg font-semibold text-gray-700 mb-1">Add Project</h3>
            <p className="text-sm text-gray-500">Create a new project</p>
          </motion.div>
        </motion.div>

        {/* Empty State */}
        {lineupItems.length === 0 && !loading && (
          <motion.div
            variants={cardVariants}
            className="col-span-full bg-gray-50 border-2 border-dashed border-gray-300 rounded-xl p-8 text-center"
          >
            <div className="text-gray-500">
              <svg
                className="w-12 h-12 mx-auto mb-4 text-gray-400"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M9 5H7a2 2 0 00-2 2v10a2 2 0 002 2h8a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2"
                />
              </svg>
              <h3 className="text-lg font-semibold text-gray-700 mb-2">No upcoming projects</h3>
              <p className="text-gray-500">Create your first project to get started</p>
            </div>
          </motion.div>
        )}
      </motion.div>

      {/* Create Project Modal */}
      <CreateProjectForm
        isOpen={showCreateForm}
        onClose={() => setShowCreateForm(false)}
        onSuccess={() => setShowCreateForm(false)}
      />
    </div>
  )
}

export default LineUpSection
