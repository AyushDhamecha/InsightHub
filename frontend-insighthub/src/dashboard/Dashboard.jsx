"use client"

import { useState } from "react"
import { motion } from "framer-motion"
import Sidebar from "./Sidebar"
import Header from "./Header"
import { Outlet } from "react-router-dom"

const Dashboard = () => {
  const [sidebarOpen, setSidebarOpen] = useState(false)

  const toggleSidebar = () => {
    setSidebarOpen(!sidebarOpen)
  }

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        duration: 0.5,
        staggerChildren: 0.1,
      },
    },
  }

  return (
    <motion.div
      variants={containerVariants}
      initial="hidden"
      animate="visible"
      className="flex h-screen bg-gray-50 overflow-hidden"
    >
      {/* Fixed Sidebar */}
      <Sidebar />

      {/* Main Content */}
      <div className="flex-1 flex flex-col overflow-hidden ml-72">
        {/* Header */}
        <Header toggleSidebar={toggleSidebar} />

        {/* Content Area */}
        <div className="flex-1 overflow-auto bg-[#f4f4ec]">
          <Outlet />
        </div>
      </div>
    </motion.div>
  )
}

export default Dashboard