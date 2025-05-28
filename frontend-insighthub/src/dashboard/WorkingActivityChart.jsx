"use client"

import { motion } from "framer-motion"
import { useState, useEffect } from "react"

const WorkingActivityChart = () => {
  const [currentTime, setCurrentTime] = useState(new Date())

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentTime(new Date())
    }, 1000)

    return () => clearInterval(timer)
  }, [])

  const formatWorkingTime = (date) => {
    const hours = date.getHours()
    const minutes = date.getMinutes()
    const seconds = date.getSeconds()
    return `${hours.toString().padStart(2, "0")}:${minutes.toString().padStart(2, "0")}:${seconds.toString().padStart(2, "0")}`
  }

  const days = [
    {
      date: "24",
      day: "Wed",
      activities: [
        { time: "9:00", duration: 2, color: "bg-orange-400", type: "Design" },
        { time: "11:00", duration: 1, color: "bg-green-400", type: "Meeting" },
        { time: "14:00", duration: 3, color: "bg-orange-500", type: "Development" },
      ],
    },
    {
      date: "25",
      day: "Thu",
      activities: [
        { time: "10:00", duration: 4, color: "bg-orange-500", type: "Development" },
        { time: "15:00", duration: 2, color: "bg-green-400", type: "Review" },
      ],
    },
    {
      date: "26",
      day: "Fri",
      activities: [
        { time: "9:00", duration: 1, color: "bg-yellow-400", type: "Planning" },
        { time: "11:00", duration: 2, color: "bg-orange-400", type: "Design" },
        { time: "14:00", duration: 1, color: "bg-green-400", type: "Meeting" },
        { time: "16:00", duration: 2, color: "bg-purple-400", type: "Research" },
      ],
    },
    {
      date: "27",
      day: "Sat",
      activities: [
        { time: "10:00", duration: 3, color: "bg-green-500", type: "Personal Project" },
        { time: "14:00", duration: 2, color: "bg-purple-400", type: "Learning" },
      ],
    },
    {
      date: "28",
      day: "Sun",
      activities: [
        { time: "11:00", duration: 2, color: "bg-pink-400", type: "Creative" },
        { time: "15:00", duration: 3, color: "bg-purple-400", type: "Research" },
      ],
    },
  ]

  const containerVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: {
      opacity: 1,
      y: 0,
      transition: {
        duration: 0.6,
        staggerChildren: 0.1,
      },
    },
  }

  const dayVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0 },
  }

  const activityVariants = {
    hidden: { scaleY: 0, opacity: 0 },
    visible: {
      scaleY: 1,
      opacity: 1,
      transition: {
        duration: 0.5,
        ease: "easeOut",
      },
    },
  }

  return (
    <motion.div
      variants={containerVariants}
      initial="hidden"
      animate="visible"
      className="bg-white rounded-xl border border-gray-200 p-4 lg:p-6 shadow-lg"
    >
      <div className="flex items-center justify-between mb-6">
        <motion.h3
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.5 }}
          className="text-base lg:text-lg font-semibold text-gray-900"
        >
          Working activity
        </motion.h3>
        <div className="flex items-center space-x-2">
          <motion.button
            whileHover={{ scale: 1.1, x: -2 }}
            whileTap={{ scale: 0.9 }}
            className="p-1 text-gray-400 hover:text-gray-600 rounded transition-colors duration-200"
          >
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
            </svg>
          </motion.button>
          <motion.span
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.3 }}
            className="text-sm text-gray-600 font-medium"
          >
            Jul 24 — 28
          </motion.span>
          <motion.button
            whileHover={{ scale: 1.1, x: 2 }}
            whileTap={{ scale: 0.9 }}
            className="p-1 text-gray-400 hover:text-gray-600 rounded transition-colors duration-200"
          >
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
            </svg>
          </motion.button>
        </div>
      </div>

      {/* Days Header */}
      <motion.div variants={containerVariants} className="grid grid-cols-5 gap-2 lg:gap-4 border border-t-2 rounded-t-xl p-2 border-stone-400 border-b-white">
        {days.map((day, index) => (
          <motion.div
            key={index}
            variants={dayVariants}
            whileHover={{ scale: 1.05 }}
            className="text-center cursor-pointer"
          >
            <div className="text-xs lg:text-sm text-gray-500 mb-1">{day.day}</div>
            <motion.div
              className={`text-base lg:text-lg font-semibold text-gray-900 ${
                day.date === "26" ? "bg-blue-100 text-blue-600 rounded-lg px-1 py-0" : ""
              }`}
              whileHover={{ scale: 1.1 }}
            >
              {day.date}
            </motion.div>
          </motion.div>
        ))}
      </motion.div>

      {/* Activity Bars */}
      <motion.div variants={containerVariants} className="grid grid-cols-5 gap-2 lg:gap-4 h-32 lg:h-48 mb-4 border border-stone-400 rounded-b-2xl border-t-white bg-[#f4f5f0] p-2">
        {days.map((day, dayIndex) => (
          <motion.div key={dayIndex} variants={dayVariants} className="relative">
            <div className="h-full flex flex-col justify-end space-y-1">
              {day.activities.map((activity, activityIndex) => (
                <motion.div
                  key={activityIndex}
                  variants={activityVariants}
                  whileHover={{
                    scale: 1.1,
                    zIndex: 10,
                    transition: { duration: 0.2 },
                  }}
                  className={`${activity.color} rounded-md cursor-pointer relative group origin-bottom`}
                  style={{ height: `${activity.duration * 15}px` }}
                  title={`${activity.time} - ${activity.duration}h - ${activity.type}`}
                >
                  {/* Tooltip */}
                  <div className="absolute bottom-full left-1/2 transform -translate-x-1/2 mb-2 px-2 py-1 bg-gray-800 text-white text-xs rounded opacity-0 group-hover:opacity-100 transition-opacity duration-200 whitespace-nowrap z-20">
                    {activity.type}
                    <br />
                    {activity.time} ({activity.duration}h)
                  </div>
                </motion.div>
              ))}
            </div>
          </motion.div>
        ))}
      </motion.div>

      {/* Current Time Indicator
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 1 }}
        className="flex items-center justify-center"
      >
        <motion.div
          whileHover={{ scale: 1.05 }}
          className="bg-gray-800 text-white px-3 lg:px-4 py-2 lg:py-3 rounded-lg text-sm font-medium shadow-lg"
        >
          <motion.div
            key={formatWorkingTime(currentTime)}
            initial={{ opacity: 0, y: 5 }}
            animate={{ opacity: 1, y: 0 }}
            className="font-mono text-base lg:text-lg"
          >
            {formatWorkingTime(currentTime)}
          </motion.div>
          <div className="text-xs text-gray-300 mt-1">Working time today</div>
        </motion.div>
      </motion.div> */}

      {/* Activity Legend */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 1.2 }}
        className="mt-4 flex flex-wrap gap-2 justify-center"
      >
        {[
          { color: "bg-orange-400", label: "Design" },
          { color: "bg-green-400", label: "Meetings" },
          { color: "bg-purple-400", label: "Research" },
          { color: "bg-yellow-400", label: "Planning" },
          { color: "bg-pink-400", label: "Creative" },
        ].map((item, index) => (
          <motion.div
            key={item.label}
            initial={{ opacity: 0, scale: 0 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 1.4 + index * 0.1 }}
            className="flex items-center space-x-1 text-xs text-gray-600"
          >
            <div className={`w-2 h-2 ${item.color} rounded-full`} />
            <span>{item.label}</span>
          </motion.div>
        ))}
      </motion.div>
    </motion.div>
  )
}

export default WorkingActivityChart
