"use client"

import { useState, useEffect } from "react"
import { motion, AnimatePresence } from "framer-motion"
import TaskList from "./TaskList"
import AddTaskForm from "./AddTaskForm"
import AIAssistant from "./AIAssistant"
import { Sparkles, Target } from "lucide-react"

const Goals = () => {
  const [tasks, setTasks] = useState([])
  const [showAI, setShowAI] = useState(false)
  const [userName] = useState("Pristia")
  const [isLoading, setIsLoading] = useState(true)

  // Load tasks from localStorage on component mount
  useEffect(() => {
    try {
      const savedTasks = localStorage.getItem("goals-tasks")
      if (savedTasks && savedTasks !== "undefined") {
        const parsedTasks = JSON.parse(savedTasks)
        if (Array.isArray(parsedTasks)) {
          setTasks(parsedTasks)
        } else {
          // If data is corrupted, load default tasks
          loadDefaultTasks()
        }
      } else {
        // Load default tasks if no saved tasks
        loadDefaultTasks()
      }
    } catch (error) {
      console.error("Error loading tasks from localStorage:", error)
      loadDefaultTasks()
    } finally {
      setIsLoading(false)
    }
  }, [])

  const loadDefaultTasks = () => {
    const defaultTasks = [
      {
        id: 1,
        title: "Create design system",
        priority: "high",
        completed: false,
        createdAt: new Date().toISOString(),
      },
      {
        id: 2,
        title: "Create 3 alternative hero section",
        priority: "medium",
        completed: false,
        createdAt: new Date().toISOString(),
      },
      {
        id: 3,
        title: "Upload dribbble shot",
        priority: "low",
        completed: false,
        createdAt: new Date().toISOString(),
      },
    ]
    setTasks(defaultTasks)
    try {
      localStorage.setItem("goals-tasks", JSON.stringify(defaultTasks))
    } catch (error) {
      console.error("Error saving default tasks to localStorage:", error)
    }
  }

  // Save tasks to localStorage whenever tasks change
  useEffect(() => {
    if (!isLoading && tasks.length >= 0) {
      try {
        localStorage.setItem("goals-tasks", JSON.stringify(tasks))
      } catch (error) {
        console.error("Error saving tasks to localStorage:", error)
      }
    }
  }, [tasks, isLoading])

  const addTask = (taskData) => {
    const newTask = {
      id: Date.now(),
      ...taskData,
      completed: false,
      createdAt: new Date().toISOString(),
    }
    setTasks((prev) => [...prev, newTask])
  }

  const toggleTask = (id) => {
    setTasks((prev) => prev.map((task) => (task.id === id ? { ...task, completed: !task.completed } : task)))
  }

  const deleteTask = (id) => {
    setTasks((prev) => prev.filter((task) => task.id !== id))
  }

  const updateTask = (id, updates) => {
    setTasks((prev) => prev.map((task) => (task.id === id ? { ...task, ...updates } : task)))
  }

  const getGreeting = () => {
    const hour = new Date().getHours()
    if (hour < 12) return "Good Morning"
    if (hour < 17) return "Good Afternoon"
    return "Good Evening"
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
                <h1 className="text-2xl font-semibold text-slate-800 mb-2">
                  {getGreeting()}, {userName}!<span className="ml-2">🌟✨🎯</span>
                </h1>
                <p className="text-slate-600">What do you plan to do today?</p>
              </div>
              <div className="text-right">
                <div className="text-sm text-slate-500">Odama Studio</div>
                <div className="text-sm font-medium text-slate-700">↗ 1354</div>
              </div>
            </div>
          </div>
        </motion.div>

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
                <AIAssistant tasks={tasks} onClose={() => setShowAI(false)} />
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </div>
    </div>
  )
}

export default Goals
