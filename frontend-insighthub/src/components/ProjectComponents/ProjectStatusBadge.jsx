"use client"

import { motion } from "framer-motion"

const ProjectStatusBadge = ({ status, size = "sm" }) => {
  const getStatusConfig = (status) => {
    switch (status) {
      case "created-now":
        return {
          label: "Created",
          bgColor: "bg-blue-100/80",
          textColor: "text-blue-800",
          dotColor: "bg-blue-500",
        }
      case "in-progress":
        return {
          label: "In Progress",
          bgColor: "bg-orange-100/80",
          textColor: "text-orange-800",
          dotColor: "bg-orange-500",
        }
      case "completed":
        return {
          label: "Completed",
          bgColor: "bg-green-100/80",
          textColor: "text-green-800",
          dotColor: "bg-green-500",
        }
      default:
        return {
          label: "Unknown",
          bgColor: "bg-gray-100/80",
          textColor: "text-gray-800",
          dotColor: "bg-gray-500",
        }
    }
  }

  const config = getStatusConfig(status)
  const sizeClasses = size === "lg" ? "px-4 py-2 text-sm" : "px-3 py-1.5 text-xs"

  return (
    <motion.div
      initial={{ scale: 0, opacity: 0 }}
      animate={{ scale: 1, opacity: 1 }}
      whileHover={{ scale: 1.05 }}
      className={`inline-flex items-center space-x-2 rounded-full font-semibold backdrop-blur-sm border border-white/20 ${config.bgColor} ${config.textColor} ${sizeClasses} shadow-sm`}
    >
      <motion.div
        className={`w-2 h-2 rounded-full ${config.dotColor}`}
        animate={{
          scale: [1, 1.2, 1],
          opacity: [1, 0.7, 1],
        }}
        transition={{
          duration: 2,
          repeat: status === "in-progress" ? Number.POSITIVE_INFINITY : 0,
          ease: "easeInOut",
        }}
      />
      <span>{config.label}</span>
    </motion.div>
  )
}

export default ProjectStatusBadge
