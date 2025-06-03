"use client"

import { motion } from "framer-motion"
import { useState, useEffect } from "react"
import { ArrowUpRight } from "lucide-react"
import { getAuth, onAuthStateChanged } from "firebase/auth"
import { useNavigate } from "react-router-dom"
import { useProjects } from "../components/ProjectComponents/ProjectContext"

const GreetingSection = () => {
  const [currentTime, setCurrentTime] = useState(new Date())
  const [userName, setUserName] = useState("")
  const navigate = useNavigate()
  const { projects } = useProjects()

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

  const formatDate = (date) => {
    return date.toLocaleDateString("en-US", {
      weekday: "long",
      year: "numeric",
      month: "long",
      day: "numeric",
    })
  }

  const getGreeting = () => {
    const hour = currentTime.getHours()
    if (hour < 12) return "Good Morning"
    if (hour < 18) return "Good Afternoon"
    return "Good Evening"
  }

  const handleNavigation = (path) => {
    navigate(path)
  }

  // Calculate total tasks from all projects
  const getTotalTasks = () => {
    return projects.reduce((total, project) => {
      return total + (project.tasks ? project.tasks.length : 0)
    }, 0)
  }

  const containerVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: {
      opacity: 1,
      y: 0,
      transition: { duration: 0.6, staggerChildren: 0.2 },
    },
  }

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0 },
  }

  const statsData = [
    {
      label: "Projects",
      value: projects.length,
      change: "+3%",
      isPositive: true,
      path: "/projects",
    },
    {
      label: "Tasks",
      value: getTotalTasks(),
      change: "+7%",
      isPositive: true,
      path: "/goals", // You can change this to a tasks page when you create one
    },
  ]

  return (
    <motion.div variants={containerVariants} initial="hidden" animate="visible" className="mb-6 lg:mb-8">
      <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between space-y-4 lg:space-y-0">
        <motion.div variants={itemVariants}>
          <motion.h1
            className="text-2xl lg:text-3xl font-bold text-gray-900 mb-2"
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
          >
            {getGreeting()}, {userName}!
          </motion.h1>
          <motion.p
            className="text-gray-600 text-sm lg:text-base"
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.6, delay: 0.4 }}
          >
            {formatDate(currentTime)}
          </motion.p>
        </motion.div>

        <motion.div variants={itemVariants} className="flex items-center space-x-6 lg:space-x-8">
          {statsData.map((stat, index) => (
            <motion.div
              key={stat.label}
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.5, delay: 0.6 + index * 0.1 }}
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              className="text-center cursor-pointer group"
              onClick={() => handleNavigation(stat.path)}
            >
              <div className="flex flex-col items-center space-y-2">
                <div
                  className={`rounded-full p-2 bg-gray-100 group-hover:bg-blue-100 transition-colors duration-200 ${stat.isPositive ? "text-green-600 group-hover:text-blue-600" : "text-red-600"}`}
                >
                  <ArrowUpRight className="w-5 h-5" />
                </div>
                <p className="text-sm lg:text-base text-gray-900 font-medium group-hover:text-blue-600 transition-colors duration-200">
                  {stat.label}
                  <sup className="text-xs font-semibold text-gray-700 group-hover:text-blue-500 ml-1 transition-colors duration-200">
                    ({stat.value})
                  </sup>
                </p>
              </div>
            </motion.div>
          ))}
        </motion.div>
      </div>
    </motion.div>
  )
}

export default GreetingSection
