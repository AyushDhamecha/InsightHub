"use client"

import { motion } from "framer-motion"
import { useState } from "react"
import { useNavigate } from "react-router-dom"
import ProjectStatusBadge from "./ProjectStatusBadge"
import { useProjects } from "./ProjectContext"

const ProjectCard = ({ project, onEdit, onDelete, index = 0 }) => {
  const navigate = useNavigate()
  const [showActions, setShowActions] = useState(false)
  const { updateProject } = useProjects()

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString("en-US", {
      month: "short",
      day: "numeric",
    })
  }

  const getDaysUntilDue = (dueDate) => {
    const today = new Date()
    const due = new Date(dueDate)
    const diffTime = due - today
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24))
    return diffDays
  }

  const daysUntilDue = getDaysUntilDue(project.dueDate)

  const handleStatusChange = (newStatus) => {
    const completion = newStatus === "completed" ? 100 : newStatus === "in-progress" ? project.completion : 0
    updateProject(project.id, { status: newStatus, completion })
  }

  const handleCardClick = () => {
    console.log("Navigating to project:", project.id)
    navigate(`/projects/${project.id}`)
  }

  // Get card background color based on project index or status
  const getCardBackground = () => {
    const backgrounds = [
      "bg-gradient-to-br from-gray-50 to-gray-100", // Light gray
      "bg-gradient-to-br from-orange-200 to-orange-300", // Orange
      "bg-gradient-to-br from-green-200 to-green-300", // Green
      "bg-gradient-to-br from-pink-200 to-pink-300", // Pink
      "bg-gradient-to-br from-blue-200 to-blue-300", // Blue
      "bg-gradient-to-br from-purple-200 to-purple-300", // Purple
      "bg-gradient-to-br from-yellow-200 to-yellow-300", // Yellow
      "bg-gradient-to-br from-indigo-200 to-indigo-300", // Indigo
    ]
    return backgrounds[index % backgrounds.length]
  }

  const getProgressBarColor = () => {
    const colors = [
      "bg-blue-500", // For light gray cards
      "bg-orange-600", // For orange cards
      "bg-green-600", // For green cards
      "bg-pink-600", // For pink cards
      "bg-blue-600", // For blue cards
      "bg-purple-600", // For purple cards
      "bg-yellow-600", // For yellow cards
      "bg-indigo-600", // For indigo cards
    ]
    return colors[index % colors.length]
  }

  const cardVariants = {
    hidden: { opacity: 0, y: 20, scale: 0.95 },
    visible: {
      opacity: 1,
      y: 0,
      scale: 1,
      transition: {
        duration: 0.4,
        delay: index * 0.1,
        ease: "easeOut",
      },
    },
  }

  // Safely get the first tag or provide a default
  const primaryTag = project.tags && project.tags.length > 0 ? project.tags[0] : "General"

  return (
    <motion.div
      variants={cardVariants}
      initial="hidden"
      animate="visible"
      whileHover={{
        scale: 1.02,
        y: -8,
        transition: { duration: 0.2 },
      }}
      onHoverStart={() => setShowActions(true)}
      onHoverEnd={() => setShowActions(false)}
      onClick={handleCardClick}
      className={`${getCardBackground()} rounded-2xl p-6 shadow-lg hover:shadow-xl transition-all duration-300 cursor-pointer relative overflow-hidden border border-white/20`}
    >
      {/* Header with date and actions */}
      <div className="flex items-start justify-between mb-4">
        <motion.div
          initial={{ opacity: 0, x: -10 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.2 + index * 0.1 }}
          className="text-sm text-gray-600 font-medium"
        >
          {formatDate(project.dueDate)}
        </motion.div>

        {/* Actions Menu */}
        <motion.div
          className="flex items-center space-x-1"
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: showActions ? 1 : 0.3, x: 0 }}
          transition={{ duration: 0.2 }}
        >
          <motion.button
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.9 }}
            onClick={(e) => {
              e.stopPropagation()
              onEdit(project)
            }}
            className="p-1.5 text-gray-500 hover:text-gray-700 rounded-lg hover:bg-white/30 transition-colors duration-200"
          >
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M12 5v.01M12 12v.01M12 19v.01M12 6a1 1 0 110-2 1 1 0 010 2zm0 7a1 1 0 110-2 1 1 0 010 2zm0 7a1 1 0 110-2 1 1 0 010 2z"
              />
            </svg>
          </motion.button>
        </motion.div>
      </div>

      {/* Project Title and Category */}
      <motion.div
        className="mb-6"
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.3 + index * 0.1 }}
      >
        <h3 className="text-xl font-bold text-gray-900 mb-1 leading-tight">{project.name}</h3>
        <p className="text-sm text-gray-600 font-medium">{primaryTag}</p>
      </motion.div>

      {/* Progress Section */}
      <motion.div
        className="mb-6"
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.4 + index * 0.1 }}
      >
        <div className="flex items-center justify-between mb-2">
          <span className="text-sm font-medium text-gray-700">Progress</span>
          <motion.span
            className="text-2xl font-bold text-gray-900"
            key={project.completion}
            initial={{ scale: 1.2 }}
            animate={{ scale: 1 }}
            transition={{ duration: 0.3 }}
          >
            {project.completion}%
          </motion.span>
        </div>

        {/* Progress Bar */}
        <div className="w-full bg-white/40 rounded-full h-2 overflow-hidden">
          <motion.div
            className={`h-full ${getProgressBarColor()} rounded-full`}
            initial={{ width: 0 }}
            animate={{ width: `${project.completion}%` }}
            transition={{
              duration: 1.5,
              delay: 0.5 + index * 0.1,
              ease: "easeOut",
            }}
          />
        </div>
      </motion.div>

      {/* Bottom Section */}
      <motion.div
        className="flex items-center justify-between"
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.6 + index * 0.1 }}
      >
        {/* User Avatars */}
        <div className="flex -space-x-2">
          {project.assignedUsers &&
            project.assignedUsers.slice(0, 3).map((user, userIndex) => (
              <motion.div
                key={userIndex}
                initial={{ scale: 0, x: -20 }}
                animate={{ scale: 1, x: 0 }}
                transition={{ delay: 0.7 + index * 0.1 + userIndex * 0.05 }}
                whileHover={{ scale: 1.2, zIndex: 10 }}
                className={`w-8 h-8 ${user.color || "bg-gray-400"} rounded-full border-2 border-white flex items-center justify-center text-white text-xs font-semibold cursor-pointer shadow-sm`}
                title={user.name}
              >
                {user.avatar || user.name.charAt(0).toUpperCase()}
              </motion.div>
            ))}
          {project.assignedUsers && project.assignedUsers.length > 3 && (
            <motion.div
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              transition={{ delay: 0.8 + index * 0.1 }}
              className="w-8 h-8 bg-gray-400 rounded-full border-2 border-white flex items-center justify-center text-white text-xs font-semibold shadow-sm"
            >
              +{project.assignedUsers.length - 3}
            </motion.div>
          )}
        </div>

        {/* Time Remaining */}
        <motion.div
          className="flex items-center space-x-2 bg-white/30 backdrop-blur-sm rounded-full px-3 py-1.5"
          whileHover={{ scale: 1.05 }}
        >
          <motion.svg
            className="w-4 h-4 text-gray-600"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
            animate={{ rotate: 360 }}
            transition={{ duration: 20, repeat: Number.POSITIVE_INFINITY, ease: "linear" }}
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"
            />
          </motion.svg>
          <span className="text-sm font-medium text-gray-700">
            {daysUntilDue > 0 ? `${daysUntilDue} days left` : daysUntilDue === 0 ? "Due today" : "Overdue"}
          </span>
        </motion.div>
      </motion.div>

      {/* Status Badge - Positioned absolutely */}
      <motion.div
        className="absolute top-4 right-4"
        initial={{ opacity: 0, scale: 0 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ delay: 0.8 + index * 0.1 }}
      >
        <ProjectStatusBadge status={project.status} size="sm" />
      </motion.div>

      {/* Floating Action Button */}
      <motion.button
        className="absolute bottom-4 right-4 w-10 h-10 bg-white/20 backdrop-blur-sm rounded-full flex items-center justify-center text-gray-600 hover:text-gray-800 hover:bg-white/40 transition-all duration-200 shadow-lg"
        initial={{ opacity: 0, scale: 0 }}
        animate={{ opacity: showActions ? 1 : 0, scale: showActions ? 1 : 0 }}
        whileHover={{ scale: 1.1 }}
        whileTap={{ scale: 0.9 }}
        onClick={(e) => {
          e.stopPropagation()
          onEdit(project)
        }}
      >
        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
        </svg>
      </motion.button>
    </motion.div>
  )
}

export default ProjectCard
