"use client"

import { motion } from "framer-motion"
import { useEffect, useState } from "react"

const ProjectProgressBar = ({ completion, showPercentage = true, height = "h-2", animated = true }) => {
  const [animatedProgress, setAnimatedProgress] = useState(0)

  useEffect(() => {
    if (animated) {
      const timer = setTimeout(() => {
        setAnimatedProgress(completion)
      }, 300)
      return () => clearTimeout(timer)
    } else {
      setAnimatedProgress(completion)
    }
  }, [completion, animated])

  const getProgressColor = (progress) => {
    if (progress >= 80) return "bg-green-500"
    if (progress >= 50) return "bg-yellow-500"
    if (progress >= 25) return "bg-orange-500"
    return "bg-red-500"
  }

  return (
    <div className="w-full">
      <div className={`w-full bg-gray-200 rounded-full overflow-hidden ${height}`}>
        <motion.div
          className={`${height} rounded-full ${getProgressColor(animatedProgress)} relative overflow-hidden`}
          initial={{ width: 0 }}
          animate={{ width: `${animatedProgress}%` }}
          transition={{
            duration: animated ? 1.5 : 0,
            ease: "easeOut",
            delay: animated ? 0.2 : 0,
          }}
        >
          {/* Shimmer effect for active progress */}
          {animatedProgress > 0 && animatedProgress < 100 && (
            <motion.div
              className="absolute inset-0 bg-gradient-to-r from-transparent via-white to-transparent opacity-30"
              animate={{
                x: ["-100%", "100%"],
              }}
              transition={{
                duration: 2,
                repeat: Infinity,
                ease: "linear",
              }}
            />
          )}
        </motion.div>
      </div>

      {showPercentage && (
        <motion.div
          className="flex items-center justify-between mt-1 text-xs text-gray-600"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: animated ? 0.5 : 0 }}
        >
          <span>Progress</span>
          <motion.span
            className="font-medium"
            key={animatedProgress}
            initial={{ scale: 1.2, color: "#059669" }}
            animate={{ scale: 1, color: "#6B7280" }}
            transition={{ duration: 0.3 }}
          >
            {Math.round(animatedProgress)}%
          </motion.span>
        </motion.div>
      )}
    </div>
  )
}

export default ProjectProgressBar
