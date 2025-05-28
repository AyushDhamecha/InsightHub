"use client"

import { motion } from "framer-motion"
import { useState, useEffect } from "react"

const TotalProgressCard = () => {
  const [animatedProgress, setAnimatedProgress] = useState(0)
  const targetProgress = 55

  useEffect(() => {
    const timer = setTimeout(() => {
      setAnimatedProgress(targetProgress)
    }, 800)

    return () => clearTimeout(timer)
  }, [targetProgress])

  const circumference = 2 * Math.PI * 45 // radius = 45
  const strokeDasharray = circumference
  const strokeDashoffset = circumference - (animatedProgress / 100) * circumference

  const cardVariants = {
    hidden: { opacity: 0, scale: 0.9, y: 20 },
    visible: {
      opacity: 1,
      scale: 1,
      y: 0,
      transition: {
        duration: 0.6,
        ease: "easeOut",
        delay: 0.2,
      },
    },
  }

  return (
    <motion.div
      variants={cardVariants}
      initial="hidden"
      animate="visible"
      whileHover={{ scale: 1.02, y: -5 }}
      className="bg-gradient-to-br from-pink-300 to-pink-400 rounded-xl p-4 lg:p-6 text-white mb-4 shadow-lg hover:shadow-xl transition-shadow duration-300 cursor-pointer"
    >
      <div className="flex items-center justify-between mb-4">
        <motion.h3
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.4 }}
          className="text-base lg:text-lg font-semibold"
        >
          Total progress
        </motion.h3>
        <motion.div
          initial={{ opacity: 0, scale: 0 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 0.6, type: "spring", stiffness: 200 }}
          className="flex items-center text-sm bg-white bg-opacity-20 px-2 py-1 rounded-full"
        >
          <motion.svg
            className="w-3 h-3 mr-1"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
            animate={{ y: [-2, 2, -2] }}
            transition={{ duration: 2, repeat: Number.POSITIVE_INFINITY, ease: "easeInOut" }}
          >
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 17l9.2-9.2M17 17V7H7" />
          </motion.svg>
          <span className="text-pink-100">+7%</span>
        </motion.div>
      </div>

      <motion.div
        initial={{ opacity: 0, x: -10 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ delay: 0.8 }}
        className="text-xs lg:text-sm text-pink-100 mb-2"
      >
        this week
      </motion.div>

      <div className="flex items-center justify-between">
        <motion.div
          className="text-2xl lg:text-3xl font-bold"
          initial={{ scale: 0 }}
          animate={{ scale: 1 }}
          transition={{ delay: 1, type: "spring", stiffness: 200 }}
        >
          <motion.span initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 1.2 }}>
            {animatedProgress}%
          </motion.span>
        </motion.div>

        {/* Animated Circular Progress */}
        <motion.div
          className="relative w-12 h-12 lg:w-16 lg:h-16"
          initial={{ scale: 0, rotate: -90 }}
          animate={{ scale: 1, rotate: 0 }}
          transition={{ delay: 1.4, duration: 0.8, type: "spring", stiffness: 200 }}
        >
          <svg className="w-full h-full transform -rotate-90" viewBox="0 0 100 100">
            {/* Background circle */}
            <circle cx="50" cy="50" r="45" stroke="rgba(255,255,255,0.3)" strokeWidth="6" fill="none" />
            {/* Animated progress circle */}
            <motion.circle
              cx="50"
              cy="50"
              r="45"
              stroke="white"
              strokeWidth="6"
              fill="none"
              strokeLinecap="round"
              strokeDasharray={strokeDasharray}
              initial={{ strokeDashoffset: circumference }}
              animate={{ strokeDashoffset: strokeDashoffset }}
              transition={{
                delay: 1.6,
                duration: 2,
                ease: "easeInOut",
              }}
              filter="drop-shadow(0 0 6px rgba(255,255,255,0.5))"
            />
          </svg>

          {/* Animated center dot */}
          <motion.div
            className="absolute inset-0 flex items-center justify-center"
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            transition={{ delay: 2.5, type: "spring", stiffness: 300 }}
          >
            <motion.div
              className="w-2 h-2 bg-white rounded-full"
              animate={{
                scale: [1, 1.2, 1],
                opacity: [1, 0.8, 1],
              }}
              transition={{
                duration: 2,
                repeat: Number.POSITIVE_INFINITY,
                ease: "easeInOut",
              }}
            />
          </motion.div>

          {/* Floating particles effect */}
          {[...Array(3)].map((_, i) => (
            <motion.div
              key={i}
              className="absolute w-1 h-1 bg-white rounded-full opacity-60"
              style={{
                top: `${20 + i * 20}%`,
                left: `${30 + i * 15}%`,
              }}
              animate={{
                y: [-5, 5, -5],
                x: [-2, 2, -2],
                opacity: [0.6, 1, 0.6],
              }}
              transition={{
                duration: 3 + i,
                repeat: Number.POSITIVE_INFINITY,
                ease: "easeInOut",
                delay: i * 0.5,
              }}
            />
          ))}
        </motion.div>
      </div>
    </motion.div>
  )
}

export default TotalProgressCard
