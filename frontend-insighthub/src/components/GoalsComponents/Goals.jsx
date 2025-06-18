"use client"

import React from "react"
import { useState, useEffect } from "react"
import { motion, AnimatePresence } from "framer-motion"
import TaskList from "./TaskList"
import AddTaskForm from "./AddTaskForm"
import AIAssistant from "./AIAssistant"
import { Sparkles, Target } from "lucide-react"
import { goalsApi } from "./api/goalsApi"
import { getAuth, onAuthStateChanged } from "firebase/auth"

// Error Boundary Component
class ErrorBoundary extends React.Component {
  constructor(props) {
    super(props)
    this.state = { hasError: false, error: null }
  }

  static getDerivedStateFromError(error) {
    return { hasError: true, error }
  }

  componentDidCatch(error, errorInfo) {
    console.error("Error caught by boundary:", error, errorInfo)
  }

  render() {
    if (this.state.hasError) {
      return (
        <div className="bg-red-50 border border-red-200 rounded-xl p-4">
          <h3 className="text-red-800 font-medium mb-2">Something went wrong</h3>
          <p className="text-red-600 text-sm mb-3">{this.state.error?.message || "An unexpected error occurred"}</p>
          <button
            onClick={() => this.setState({ hasError: false, error: null })}
            className="bg-red-500 text-white px-3 py-1 rounded-lg text-sm hover:bg-red-600 transition-colors"
          >
            Try Again
          </button>
        </div>
      )
    }

    return this.props.children
  }
}

const Goals = () => {
  const [tasks, setTasks] = useState([])
  const [showAI, setShowAI] = useState(false)
  const [userName, setUserName] = useState("User")
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState(null)
  const [currentTime, setCurrentTime] = useState(new Date())

  // Update current time every second
  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentTime(new Date())
    }, 1000)
    return () => clearInterval(timer)
  }, [])

  // Get user from Firebase Auth
  useEffect(() => {
    const auth = getAuth()
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      if (user) {
        // Use displayName if set, else fallback to email or UID
        setUserName(user.displayName || user.email?.split("@")[0] || "User")
      } else {
        setUserName("Guest")
      }
    })
    return () => unsubscribe()
  }, [])

  // Load tasks from MongoDB on component mount
  useEffect(() => {
    loadTasks()
  }, [])

  const loadTasks = async () => {
    try {
      setIsLoading(true)
      setError(null)
      const tasksFromDB = await goalsApi.getAllGoals()
      setTasks(tasksFromDB)
    } catch (error) {
      console.error("Error loading tasks:", error)
      setError("Failed to load tasks. Please try again.")
      // Fallback to default tasks if API fails
      loadDefaultTasks()
    } finally {
      setIsLoading(false)
    }
  }

  const loadDefaultTasks = () => {
    const defaultTasks = [
      {
        _id: "temp-1",
        title: "Create design system",
        priority: "high",
        completed: false,
        createdAt: new Date().toISOString(),
      },
      {
        _id: "temp-2",
        title: "Create 3 alternative hero section",
        priority: "medium",
        completed: false,
        createdAt: new Date().toISOString(),
      },
      {
        _id: "temp-3",
        title: "Upload dribbble shot",
        priority: "low",
        completed: false,
        createdAt: new Date().toISOString(),
      },
    ]
    setTasks(defaultTasks)
  }

  const addTask = async (taskData) => {
    try {
      const newTask = await goalsApi.createGoal(taskData)
      setTasks((prev) => [newTask, ...prev])
    } catch (error) {
      console.error("Error adding task:", error)
      setError("Failed to add task. Please try again.")
    }
  }

  const toggleTask = async (id) => {
    try {
      const updatedTask = await goalsApi.toggleGoal(id)
      setTasks((prev) => prev.map((task) => (task._id === id ? updatedTask : task)))
    } catch (error) {
      console.error("Error toggling task:", error)
      setError("Failed to update task. Please try again.")
    }
  }

  const deleteTask = async (id) => {
    try {
      await goalsApi.deleteGoal(id)
      setTasks((prev) => prev.filter((task) => task._id !== id))
    } catch (error) {
      console.error("Error deleting task:", error)
      setError("Failed to delete task. Please try again.")
    }
  }

  const updateTask = async (id, updates) => {
    try {
      const updatedTask = await goalsApi.updateGoal(id, updates)
      setTasks((prev) => prev.map((task) => (task._id === id ? updatedTask : task)))
    } catch (error) {
      console.error("Error updating task:", error)
      setError("Failed to update task. Please try again.")
    }
  }

  const getGreeting = () => {
    const hour = currentTime.getHours()
    if (hour < 12) return "Good Morning"
    if (hour < 17) return "Good Afternoon"
    return "Good Evening"
  }

  const formatDate = (date) => {
    return date.toLocaleDateString("en-US", {
      weekday: "long",
      year: "numeric",
      month: "long",
      day: "numeric",
    })
  }

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500 mx-auto mb-4"></div>
          <p className="text-slate-600">Loading your tasks...</p>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100 p-4">
      <div className="max-w-7xl mx-auto h-full">
        <motion.div initial={{ opacity: 0, y: -20 }} animate={{ opacity: 1, y: 0 }} className="mb-8">
          <div className="bg-white rounded-2xl p-6 shadow-sm border border-slate-200">
            <div className="flex items-center justify-between">
              <div>
                <motion.h1
                  className="text-2xl font-semibold text-slate-800 mb-2"
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ duration: 0.6, delay: 0.2 }}
                >
                  {getGreeting()}, {userName}!<span className="ml-2">🌟✨🎯</span>
                </motion.h1>
                <motion.p
                  className="text-slate-600"
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ duration: 0.6, delay: 0.4 }}
                >
                  {formatDate(currentTime)}
                </motion.p>
              </div>
              <div className="text-right">
                {/* <div className="text-sm text-slate-500">Odama Studio</div>
                <div className="text-sm font-medium text-slate-700">↗ 1354</div> */}
              </div>
            </div>
          </div>
        </motion.div>

        {/* Error Message */}
        {error && (
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            className="mb-6 bg-red-50 border border-red-200 rounded-xl p-4"
          >
            <div className="flex items-center justify-between">
              <p className="text-red-600 text-sm">{error}</p>
              <button
                onClick={() => {
                  setError(null)
                  loadTasks()
                }}
                className="text-red-600 hover:text-red-800 text-sm font-medium"
              >
                Retry
              </button>
            </div>
          </motion.div>
        )}

        <div
          className={`grid gap-6 transition-all duration-300 ${showAI ? "grid-cols-1 lg:grid-cols-3" : "grid-cols-1"}`}
        >
          <div className={`space-y-6 transition-all duration-300 ${showAI ? "lg:col-span-2" : "col-span-1"}`}>
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.2 }}
              className="bg-white rounded-2xl shadow-sm border border-slate-200 flex flex-col h-[calc(100vh-200px)]"
            >
              <div className="flex items-center justify-between p-6 border-b border-slate-200">
                <h2 className="text-xl font-semibold text-slate-800 flex items-center gap-2">
                  <Target className="w-5 h-5 text-blue-500" />
                  Today Tasks
                </h2>
                <div className="flex items-center gap-3">
                  <motion.button
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    onClick={() => setShowAI(!showAI)}
                    className="flex items-center gap-2 bg-slate-800 text-white px-4 py-2 rounded-xl text-sm font-medium hover:bg-slate-700 transition-colors"
                  >
                    <Sparkles className="w-4 h-4" />
                    AI Assist
                  </motion.button>
                </div>
              </div>

              <div className="flex-1 overflow-hidden flex flex-col">
                <div className="flex-1 overflow-y-auto p-6">
                  <TaskList tasks={tasks} onToggle={toggleTask} onDelete={deleteTask} onUpdate={updateTask} />
                </div>

                <div className="border-t border-slate-200 p-6">
                  <AddTaskForm onAdd={addTask} />
                </div>
              </div>
            </motion.div>
          </div>

          <AnimatePresence>
            {showAI && (
              <motion.div
                initial={{ opacity: 0, x: 20, width: 0 }}
                animate={{ opacity: 1, x: 0, width: "auto" }}
                exit={{ opacity: 0, x: 20, width: 0 }}
                transition={{ duration: 0.3, ease: "easeInOut" }}
                className="lg:col-span-1"
              >
                <ErrorBoundary>
                  <AIAssistant tasks={tasks} onClose={() => setShowAI(false)} />
                </ErrorBoundary>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </div>
    </div>
  )
}

export default Goals
