"use client"

import { useState } from "react"
import { motion } from "framer-motion"
import Sidebar from "./Sidebar"
import Header from "./Header"
import GreetingSection from "./GreetingSection"
import LineUpSection from "./LineUpSection"
import TrendingSection from "./TrendingSection"
import MyWorkSection from "./MyWorkSection"
import WeeklyActivityCard from "./WeeklyActivityCard"
import TotalProgressCard from "./TotalProgressCard"
import WorkingActivityChart from "./WorkingActivityChart"

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

  const contentVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0 },
  }

  return (
    <motion.div
      variants={containerVariants}
      initial="hidden"
      animate="visible"
      className="flex h-screen bg-gray-50 overflow-hidden"
    >
      {/* Sidebar */}
      <Sidebar isOpen={sidebarOpen} setIsOpen={setSidebarOpen} />

      {/* Main Content */}
      <div className="flex-1 flex flex-col overflow-hidden lg:ml-0 ">
        {/* Header */}
        <Header toggleSidebar={toggleSidebar} />

        {/* Dashboard Content */}
        <motion.div variants={contentVariants} className="flex-1 overflow-auto bg-[#f4f4ec]">
          <div className="flex flex-col lg:flex-row">
            {/* Left Content */}
            <motion.div variants={contentVariants} className="flex-1 p-4 lg:p-6 space-y-6">
              <GreetingSection />
              <LineUpSection />
              <MyWorkSection />
            </motion.div>

            {/* Right Sidebar */}
            <motion.div
              variants={contentVariants}
              className="w-full lg:w-80 p-4 lg:p-6 space-y-4 lg:border-l lg:border-gray-200 bg-white"
            >
              <WeeklyActivityCard />
              <TotalProgressCard />
              <WorkingActivityChart />
            </motion.div>
          </div>
        </motion.div>
      </div>
    </motion.div>
  )
}

export default Dashboard
