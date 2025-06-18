"use client"

import { useState, useEffect } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { goalsApi } from "../components/GoalsComponents/api/goalsApi"

const MyWorkSection = () => {
  const [activeTab, setActiveTab] = useState("todo")
  const [tasks, setTasks] = useState([])
  const [isLoading, setIsLoading] = useState(true)

  // Load tasks from MongoDB
  useEffect(() => {
    loadTasks()
  }, [])

  const loadTasks = async () => {
    try {
      setIsLoading(true)
      const tasksFromDB = await goalsApi.getAllGoals()
      setTasks(tasksFromDB)
    } catch (error) {
      console.error("Error loading tasks:", error)
      setTasks([])
    } finally {
      setIsLoading(false)
    }
  }

  // Filter tasks based on completion status
  const todoTasks = tasks.filter((task) => !task.completed)
  const doneTasks = tasks.filter((task) => task.completed)

  const tabs = [
    { id: "todo", label: "To do", count: todoTasks.length },
    { id: "done", label: "Done", count: doneTasks.length },
  ]

  const tabVariants = {
    inactive: { scale: 1, backgroundColor: "transparent" },
    active: { scale: 1.05, backgroundColor: "#111827" },
  }

  const contentVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: {
      opacity: 1,
      y: 0,
      transition: {
        duration: 0.3,
        staggerChildren: 0.1,
      },
    },
    exit: { opacity: 0, y: -20, transition: { duration: 0.2 } },
  }

  const itemVariants = {
    hidden: { opacity: 0, x: -20 },
    visible: { opacity: 1, x: 0 },
  }

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

  const formatDate = (dateString) => {
    const date = new Date(dateString)
    const now = new Date()
    const diffTime = Math.abs(now - date)
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24))

    if (diffDays === 1) return "Yesterday"
    if (diffDays === 2) return "2 days ago"
    if (diffDays <= 7) return `${diffDays} days ago`
    return date.toLocaleDateString()
  }

  const getCurrentTasks = () => {
    if (activeTab === "todo") return todoTasks
    if (activeTab === "done") return doneTasks
    return []
  }

  if (isLoading) {
    return (
      <motion.div
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
        className="bg-white rounded-xl border border-gray-200 p-4 lg:p-6 shadow-lg"
      >
        <div className="flex items-center justify-center py-8">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-gray-900"></div>
        </div>
      </motion.div>
    )
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 30 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6 }}
      className="bg-white rounded-xl border border-gray-200 p-4 lg:p-6 shadow-lg"
    >
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between mb-6 space-y-4 sm:space-y-0">
        <motion.h2
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.5 }}
          className="text-lg lg:text-xl font-semibold text-gray-900"
        >
          My Work <span className="text-gray-500">({tasks.length})</span>
        </motion.h2>
      </div>

      {/* Tabs */}
      <div className="flex flex-wrap gap-1 mb-6 overflow-x-auto">
        {tabs.map((tab, index) => (
          <motion.button
            key={tab.id}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.1 }}
            variants={tabVariants}
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            onClick={() => setActiveTab(tab.id)}
            className={`px-3 lg:px-4 py-2 rounded-lg text-xs lg:text-sm font-medium transition-all duration-200 whitespace-nowrap ${
              activeTab === tab.id ? "bg-gray-900 text-white" : "text-gray-600 hover:text-gray-900 hover:bg-gray-100"
            }`}
          >
            {tab.label}
            <motion.span
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              transition={{ delay: 0.2 + index * 0.1 }}
              className={`ml-2 px-1.5 lg:px-2 py-0.5 text-xs rounded-full ${
                activeTab === tab.id ? "bg-white text-gray-900" : "bg-gray-200 text-gray-600"
              }`}
            >
              {tab.count}
            </motion.span>
          </motion.button>
        ))}
      </div>

      {/* Content */}
      <AnimatePresence mode="wait">
        <motion.div
          key={activeTab}
          variants={contentVariants}
          initial="hidden"
          animate="visible"
          exit="exit"
          className="space-y-3"
        >
          {getCurrentTasks().length > 0 ? (
            getCurrentTasks().map((task, index) => (
              <motion.div
                key={task._id}
                variants={itemVariants}
                whileHover={{ scale: 1.02, x: 5 }}
                className="p-3 lg:p-4 bg-gray-50 rounded-lg border border-gray-100 hover:border-gray-200 transition-all duration-200 cursor-pointer"
              >
                {activeTab === "todo" && (
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-3">
                      <div className={`w-2 h-2 rounded-full ${getPriorityColor(task.priority)}`} />
                      <span className="font-medium text-gray-900 text-sm lg:text-base">{task.title}</span>
                    </div>
                    <span className="text-xs text-gray-500">You</span>
                  </div>
                )}

                {activeTab === "done" && (
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-3">
                      <div className="w-2 h-2 rounded-full bg-green-500" />
                      <span className="font-medium text-gray-900 text-sm lg:text-base">{task.title}</span>
                    </div>
                    <div className="text-right">
                      <div className="text-xs text-gray-600">You</div>
                      <div className="text-xs text-gray-500">{formatDate(task.updatedAt)}</div>
                    </div>
                  </div>
                )}
              </motion.div>
            ))
          ) : (
            <motion.div variants={itemVariants} className="text-center py-8 text-gray-500">
              <motion.svg
                className="w-12 h-12 mx-auto mb-4 text-gray-300"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                transition={{ type: "spring", stiffness: 200 }}
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M9 5H7a2 2 0 00-2 2v10a2 2 0 002 2h8a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012-2"
                />
              </motion.svg>
              <p className="text-sm lg:text-base">
                No items in {tabs.find((t) => t.id === activeTab)?.label.toLowerCase()}
              </p>
            </motion.div>
          )}
        </motion.div>
      </AnimatePresence>
    </motion.div>
  )
}

export default MyWorkSection
