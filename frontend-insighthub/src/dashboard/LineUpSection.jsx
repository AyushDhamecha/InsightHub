"use client"

import { motion } from "framer-motion"
import { useState, useEffect } from "react"

const LineUpSection = () => {
  const [lineupItems, setLineupItems] = useState([
    {
      id: 1,
      title: "Banking app shot",
      platform: "Dribbble",
      progress: 43,
      timeLeft: 23 * 3600 + 57, // in seconds
      avatars: [{ id: 1, name: "John", color: "bg-blue-500" }],
      bgColor: "bg-white",
      textColor: "text-gray-900",
    },
    {
      id: 2,
      title: "Geological website case",
      platform: "Behance",
      progress: 67,
      timeLeft: 16 * 3600 + 20 * 60 + 32,
      avatars: [
        { id: 1, name: "Sarah", color: "bg-pink-500" },
        { id: 2, name: "Mike", color: "bg-green-500" },
        { id: 3, name: "Alex", color: "bg-purple-500" },
      ],
      bgColor: "bg-[#c0c954]",
      textColor: "text-white",
    },
    {
      id: 3,
      title: "Banking app shot",
      platform: "Dribbble",
      progress: 43,
      timeLeft: 23 * 3600 + 57, // in seconds
      avatars: [{ id: 1, name: "John", color: "bg-blue-500" }],
      bgColor: "bg-white",
      textColor: "text-gray-900",
    },
    
  ])

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
    const hours = Math.floor(seconds / 3600)
    const minutes = Math.floor((seconds % 3600) / 60)
    const secs = seconds % 60
    return `${hours.toString().padStart(2, "0")}:${minutes.toString().padStart(2, "0")}:${secs.toString().padStart(2, "0")}`
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
        className="grid grid-cols-1 lg:grid-cols-3 gap-4"
      >
        {lineupItems.map((item, index) => (
          <motion.div
            key={item.id}
            variants={cardVariants}
            whileHover={{
              scale: 1.02,
              transition: { duration: 0.2 },
            }}
            whileTap={{ scale: 0.98 }}
            className={`${item.bgColor} ${item.textColor} rounded-lg p-4 lg:p-6 cursor-pointer shadow-lg hover:shadow-xl transition-shadow duration-300`}
          >
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3 + index * 0.1 }}
              className="mb-4"
            >
              <p className="text-xs lg:text-sm opacity-80 mb-1">{item.platform}</p>
              <h3 className="font-semibold text-base lg:text-lg">{item.title}</h3>
            </motion.div>

            <div className="flex items-center justify-between mb-4">
              <motion.div
                className="text-2xl lg:text-3xl font-bold"
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                transition={{ delay: 0.5 + index * 0.1, type: "spring", stiffness: 200 }}
              >
                {item.progress}%
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
                {item.avatars.map((avatar, avatarIndex) => (
                  <motion.div
                    key={avatar.id}
                    initial={{ scale: 0, x: -20 }}
                    animate={{ scale: 1, x: 0 }}
                    transition={{ delay: 0.9 + index * 0.1 + avatarIndex * 0.05 }}
                    whileHover={{ scale: 1.2, zIndex: 10 }}
                    className={`w-6 h-6 lg:w-7 lg:h-7 ${avatar.color} rounded-full border-2 border-white flex items-center justify-center text-white text-xs font-semibold cursor-pointer`}
                    title={avatar.name}
                  >
                    {avatar.name.charAt(0)}
                  </motion.div>
                ))}
              </div>

              <motion.button
                whileHover={{ scale: 1.1, rotate: 90 }}
                whileTap={{ scale: 0.9 }}
                className="p-2 bg-white bg-opacity-20 rounded-lg hover:bg-opacity-30 transition-all duration-200"
              >
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
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
                animate={{ width: `${item.progress}%` }}
                transition={{ delay: 1.2 + index * 0.1, duration: 1, ease: "easeOut" }}
                className="h-full bg-white rounded-full"
              />
            </motion.div>
          </motion.div>
        ))}
      </motion.div>
    </div>
  )
}

export default LineUpSection
