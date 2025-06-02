"use client"

import { motion } from "framer-motion"
import { useState } from "react"
import TaskDetailModal from "./TaskDetailModal"

const TaskCard = ({ task, index, onUpdate, onDelete, onDragStart }) => {
  const [showDetailModal, setShowDetailModal] = useState(false)

  const getPriorityColor = (priority) => {
    switch (priority) {
      case "high":
        return "bg-red-500"
      case "medium":
        return "bg-yellow-500"
      case "low":
        return "bg-green-500"
      default:
        return "bg-gray-500"
    }
  }

  const getPriorityIcon = (priority) => {
    switch (priority) {
      case "high":
        return "🔥"
      case "medium":
        return "⚡"
      case "low":
        return "🌱"
      default:
        return "📌"
    }
  }

  const cardVariants = {
    hidden: { opacity: 0, y: 20, scale: 0.95 },
    visible: {
      opacity: 1,
      y: 0,
      scale: 1,
      transition: {
        duration: 0.3,
        delay: index * 0.1,
      },
    },
    exit: {
      opacity: 0,
      scale: 0.95,
      y: -20,
      transition: {
        duration: 0.2,
      },
    },
  }

  return (
    <>
      <motion.div
        variants={cardVariants}
        initial="hidden"
        animate="visible"
        exit="exit"
        whileHover={{
          scale: 1.02,
          y: -2,
          transition: { duration: 0.2 },
        }}
        draggable
        onDragStart={(e) => onDragStart(e, task.id)}
        onClick={() => setShowDetailModal(true)}
        className="bg-white rounded-xl p-4 shadow-sm hover:shadow-md transition-all duration-200 cursor-pointer border border-gray-100"
      >
        {/* Task Header */}
        <div className="flex items-start justify-between mb-3">
          <div className="flex items-center space-x-2">
            <span className="text-lg">{getPriorityIcon(task.priority)}</span>
            <div className={`w-2 h-2 rounded-full ${getPriorityColor(task.priority)}`} />
          </div>
          <motion.button
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.9 }}
            onClick={(e) => {
              e.stopPropagation()
              if (window.confirm("Are you sure you want to delete this task?")) {
                onDelete(task.id)
              }
            }}
            className="text-gray-400 hover:text-red-500 transition-colors"
          >
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </motion.button>
        </div>

        {/* Task Content */}
        <div className="mb-3">
          <h4 className="font-semibold text-gray-900 mb-1 line-clamp-2">{task.title}</h4>
          {task.description && <p className="text-sm text-gray-600 line-clamp-2">{task.description}</p>}
        </div>

        {/* Task Footer */}
        <div className="flex items-center justify-between">
          {task.assignee && (
            <div
              className={`w-6 h-6 ${task.assignee.color} rounded-full flex items-center justify-center text-white text-xs font-semibold`}
              title={task.assignee.name}
            >
              {task.assignee.avatar}
            </div>
          )}
          <div className="flex items-center space-x-1 text-xs text-gray-500">
            <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"
              />
            </svg>
            <span>{new Date(task.createdAt).toLocaleDateString()}</span>
          </div>
        </div>
      </motion.div>

      <TaskDetailModal
        task={task}
        isOpen={showDetailModal}
        onClose={() => setShowDetailModal(false)}
        onUpdate={onUpdate}
        onDelete={onDelete}
      />
    </>
  )
}

export default TaskCard
