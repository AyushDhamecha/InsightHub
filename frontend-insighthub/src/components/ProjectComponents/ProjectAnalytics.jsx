"use client"

import { motion } from "framer-motion"
import { useState, useEffect } from "react"

const ProjectAnalytics = ({ project }) => {
  const [animatedValues, setAnimatedValues] = useState({
    completionRate: 0,
    todoCount: 0,
    inProgressCount: 0,
    doneCount: 0,
  })

  const tasks = project.tasks || []
  const totalTasks = tasks.length
  const todoTasks = tasks.filter((task) => task.status === "todo")
  const inProgressTasks = tasks.filter((task) => task.status === "in-progress")
  const doneTasks = tasks.filter((task) => task.status === "done")
  const completionRate = totalTasks > 0 ? Math.round((doneTasks.length / totalTasks) * 100) : 0

  const priorityStats = {
    high: tasks.filter((task) => task.priority === "high").length,
    medium: tasks.filter((task) => task.priority === "medium").length,
    low: tasks.filter((task) => task.priority === "low").length,
  }

  useEffect(() => {
    const timer = setTimeout(() => {
      setAnimatedValues({
        completionRate,
        todoCount: todoTasks.length,
        inProgressCount: inProgressTasks.length,
        doneCount: doneTasks.length,
      })
    }, 500)

    return () => clearTimeout(timer)
  }, [completionRate, todoTasks.length, inProgressTasks.length, doneTasks.length])

  const CircularProgress = ({ progress, size = 120, strokeWidth = 8 }) => {
    const radius = (size - strokeWidth) / 2
    const circumference = 2 * Math.PI * radius
    const strokeDasharray = circumference
    const strokeDashoffset = circumference - (progress / 100) * circumference

    return (
      <div className="relative" style={{ width: size, height: size }}>
        <svg className="w-full h-full transform -rotate-90" viewBox={`0 0 ${size} ${size}`}>
          {/* Background circle */}
          <circle
            cx={size / 2}
            cy={size / 2}
            r={radius}
            stroke="currentColor"
            strokeWidth={strokeWidth}
            fill="none"
            className="text-gray-200"
          />
          {/* Progress circle */}
          <motion.circle
            cx={size / 2}
            cy={size / 2}
            r={radius}
            stroke="currentColor"
            strokeWidth={strokeWidth}
            fill="none"
            strokeLinecap="round"
            className="text-green-500"
            strokeDasharray={strokeDasharray}
            initial={{ strokeDashoffset: circumference }}
            animate={{ strokeDashoffset: strokeDashoffset }}
            transition={{
              duration: 2,
              ease: "easeInOut",
              delay: 0.5,
            }}
          />
        </svg>
        <div className="absolute inset-0 flex items-center justify-center">
          <div className="text-center">
            <motion.div
              className="text-2xl font-bold text-gray-900"
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              transition={{ delay: 1, type: "spring", stiffness: 200 }}
            >
              {animatedValues.completionRate}%
            </motion.div>
            <div className="text-xs text-gray-600">Complete</div>
          </div>
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

  const cardVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0 },
  }

  return (
    <motion.div variants={containerVariants} initial="hidden" animate="visible" className="space-y-6">
      {/* Project Completion */}
      <motion.div variants={cardVariants} className="bg-white rounded-2xl p-6 shadow-lg border border-gray-100">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">Tasks Progress</h3>
        <div className="flex items-center justify-center">
          <CircularProgress progress={animatedValues.completionRate} />
        </div>
        <div className="mt-4 text-center">
          <p className="text-sm text-gray-600">
            {doneTasks.length} of {totalTasks} tasks completed
          </p>
        </div>
      </motion.div>

      {/* Task Status Overview */}
      <motion.div variants={cardVariants} className="bg-white rounded-2xl p-6 shadow-lg border border-gray-100">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">Task Overview</h3>
        <div className="space-y-4">
          {/* To Do */}
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <div className="w-4 h-4 bg-red-500 rounded-full"></div>
              <span className="text-sm font-medium text-gray-700">To Do</span>
            </div>
            <motion.span
              className="text-lg font-bold text-gray-900"
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              transition={{ delay: 0.5 }}
            >
              {animatedValues.todoCount}
            </motion.span>
          </div>

          {/* In Progress */}
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <div className="w-4 h-4 bg-yellow-500 rounded-full"></div>
              <span className="text-sm font-medium text-gray-700">In Progress</span>
            </div>
            <motion.span
              className="text-lg font-bold text-gray-900"
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              transition={{ delay: 0.7 }}
            >
              {animatedValues.inProgressCount}
            </motion.span>
          </div>

          {/* Done */}
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <div className="w-4 h-4 bg-green-500 rounded-full"></div>
              <span className="text-sm font-medium text-gray-700">Done</span>
            </div>
            <motion.span
              className="text-lg font-bold text-gray-900"
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              transition={{ delay: 0.9 }}
            >
              {animatedValues.doneCount}
            </motion.span>
          </div>
        </div>
      </motion.div>

      {/* Priority Distribution */}
      <motion.div variants={cardVariants} className="bg-white rounded-2xl p-6 shadow-lg border border-gray-100">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">Priority Distribution</h3>
        <div className="space-y-3">
          {/* High Priority */}
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-2">
              <span className="text-lg">🔥</span>
              <span className="text-sm font-medium text-gray-700">High</span>
            </div>
            <span className="text-sm font-bold text-red-600">{priorityStats.high}</span>
          </div>

          {/* Medium Priority */}
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-2">
              <span className="text-lg">⚡</span>
              <span className="text-sm font-medium text-gray-700">Medium</span>
            </div>
            <span className="text-sm font-bold text-yellow-600">{priorityStats.medium}</span>
          </div>

          {/* Low Priority */}
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-2">
              <span className="text-lg">🌱</span>
              <span className="text-sm font-medium text-gray-700">Low</span>
            </div>
            <span className="text-sm font-bold text-green-600">{priorityStats.low}</span>
          </div>
        </div>
      </motion.div>

      {/* Team Members */}
      <motion.div variants={cardVariants} className="bg-white rounded-2xl p-6 shadow-lg border border-gray-100">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">Team Members</h3>
        <div className="space-y-3">
          {project.assignedUsers?.map((user) => {
            const userTasks = tasks.filter((task) => task.assignee?.id === user.id)
            return (
              <div key={user.id} className="flex items-center justify-between">
                <div className="flex items-center space-x-3">
                  <div
                    className={`w-8 h-8 ${user.color} rounded-full flex items-center justify-center text-white text-sm font-semibold`}
                  >
                    {user.avatar}
                  </div>
                  <div>
                    <p className="text-sm font-medium text-gray-900">{user.name}</p>
                    <p className="text-xs text-gray-500">{user.role}</p>
                  </div>
                </div>
                <span className="text-sm font-bold text-gray-600">{userTasks.length} tasks</span>
              </div>
            )
          })}
        </div>
      </motion.div>
    </motion.div>
  )
}

export default ProjectAnalytics
