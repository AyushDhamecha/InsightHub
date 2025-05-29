"use client"

import { useState } from "react"
import { motion, AnimatePresence } from "framer-motion"

const MyWorkSection = () => {
  const [activeTab, setActiveTab] = useState("todo")

  const tabs = [
    { id: "todo", label: "To do", count: 8 },
    { id: "comments", label: "Comments", count: 2 },
    { id: "done", label: "Done", count: 15 },
    { id: "delegate", label: "Delegate", count: 4 },
  ]

  const sampleTasks = {
    todo: [
      { id: 1, title: "Design homepage mockup", priority: "high", assignee: "You" },
      { id: 2, title: "Review user feedback", priority: "medium", assignee: "You" },
      { id: 3, title: "Update project documentation", priority: "low", assignee: "You" },
    ],
    comments: [
      { id: 1, title: "Banking app feedback", author: "Sarah Johnson", time: "2h ago" },
      { id: 2, title: "Logo design review", author: "Mike Chen", time: "4h ago" },
    ],
    done: [
      { id: 1, title: "Mobile app wireframes", completedBy: "You", time: "Yesterday" },
      { id: 2, title: "Brand guidelines", completedBy: "Team", time: "2 days ago" },
    ],
    delegate: [
      { id: 1, title: "Content writing", assignee: "Emma Wilson", dueDate: "Tomorrow" },
      { id: 2, title: "Image optimization", assignee: "Alex Brown", dueDate: "Next week" },
    ],
  }

  const tabVariants = {
    inactive: { scale: 1, backgroundColor: "transparent" },
    active: { scale: 1.05, backgroundColor: "#111827" },
  }

  const contentVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: {
      opacity: 1,
      y: 0,
      transition: {
        duration: 0.3,
        staggerChildren: 0.1,
      },
    },
    exit: { opacity: 0, y: -20, transition: { duration: 0.2 } },
  }

  const itemVariants = {
    hidden: { opacity: 0, x: -20 },
    visible: { opacity: 1, x: 0 },
  }

  const getPriorityColor = (priority) => {
    switch (priority) {
      case "high":
        return "bg-red-500"
      case "medium":
        return "bg-yellow-500"
      case "low":
        return "bg-green-500"
      default:
        return "bg-gray-500"
    }
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 30 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6 }}
      className="bg-white rounded-xl border border-gray-200 p-4 lg:p-6 shadow-lg"
    >
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between mb-6 space-y-4 sm:space-y-0">
        <motion.h2
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.5 }}
          className="text-lg lg:text-xl font-semibold text-gray-900"
        >
          My Work <span className="text-gray-500">(3)</span>
        </motion.h2>

        <div className="flex items-center space-x-2">
          <motion.button
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.9 }}
            className="p-2 text-gray-400 hover:text-gray-600 rounded-lg hover:bg-gray-100 transition-colors duration-200"
          >
            <svg className="w-4 h-4 lg:w-5 lg:h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 10h16M4 14h16M4 18h16" />
            </svg>
          </motion.button>
          <motion.button
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.9 }}
            className="p-2 text-gray-400 hover:text-gray-600 rounded-lg hover:bg-gray-100 transition-colors duration-200"
          >
            <svg className="w-4 h-4 lg:w-5 lg:h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M4 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2V6zM14 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2V6zM4 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2v-2zM14 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2v-2z"
              />
            </svg>
          </motion.button>
        </div>
      </div>

      {/* Tabs */}
      <div className="flex flex-wrap gap-1 mb-6 overflow-x-auto">
        {tabs.map((tab, index) => (
          <motion.button
            key={tab.id}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.1 }}
            variants={tabVariants}
            // animate={activeTab === tab.id ? "active" : "inactive"}
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            onClick={() => setActiveTab(tab.id)}
            className={`px-3 lg:px-4 py-2 rounded-lg text-xs lg:text-sm font-medium transition-all duration-200 whitespace-nowrap ${
              activeTab === tab.id ? "bg-gray-900 text-white" : "text-gray-600 hover:text-gray-900 hover:bg-gray-100"
            }`}
          >
            {tab.label}
            <motion.span
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              transition={{ delay: 0.2 + index * 0.1 }}
              className={`ml-2 px-1.5 lg:px-2 py-0.5 text-xs rounded-full ${
                activeTab === tab.id ? "bg-white text-gray-900" : "bg-gray-200 text-gray-600"
              }`}
            >
              {tab.count}
            </motion.span>
          </motion.button>
        ))}
      </div>

      {/* Content */}
      <AnimatePresence mode="wait">
        <motion.div
          key={activeTab}
          variants={contentVariants}
          initial="hidden"
          animate="visible"
          exit="exit"
          className="space-y-3"
        >
          {sampleTasks[activeTab]?.length > 0 ? (
            sampleTasks[activeTab].map((item, index) => (
              <motion.div
                key={item.id}
                variants={itemVariants}
                whileHover={{ scale: 1.02, x: 5 }}
                className="p-3 lg:p-4 bg-gray-50 rounded-lg border border-gray-100 hover:border-gray-200 transition-all duration-200 cursor-pointer"
              >
                {activeTab === "todo" && (
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-3">
                      <div className={`w-2 h-2 rounded-full ${getPriorityColor(item.priority)}`} />
                      <span className="font-medium text-gray-900 text-sm lg:text-base">{item.title}</span>
                    </div>
                    <span className="text-xs text-gray-500">{item.assignee}</span>
                  </div>
                )}

                {activeTab === "comments" && (
                  <div>
                    <div className="flex items-center justify-between mb-1">
                      <span className="font-medium text-gray-900 text-sm lg:text-base">{item.title}</span>
                      <span className="text-xs text-gray-500">{item.time}</span>
                    </div>
                    <span className="text-xs text-gray-600">by {item.author}</span>
                  </div>
                )}

                {activeTab === "done" && (
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-3">
                      <div className="w-2 h-2 rounded-full bg-green-500" />
                      <span className="font-medium text-gray-900 text-sm lg:text-base">{item.title}</span>
                    </div>
                    <div className="text-right">
                      <div className="text-xs text-gray-600">{item.completedBy}</div>
                      <div className="text-xs text-gray-500">{item.time}</div>
                    </div>
                  </div>
                )}

                {activeTab === "delegate" && (
                  <div className="flex items-center justify-between">
                    <span className="font-medium text-gray-900 text-sm lg:text-base">{item.title}</span>
                    <div className="text-right">
                      <div className="text-xs text-gray-600">{item.assignee}</div>
                      <div className="text-xs text-gray-500">Due: {item.dueDate}</div>
                    </div>
                  </div>
                )}
              </motion.div>
            ))
          ) : (
            <motion.div variants={itemVariants} className="text-center py-8 text-gray-500">
              <motion.svg
                className="w-12 h-12 mx-auto mb-4 text-gray-300"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                transition={{ type: "spring", stiffness: 200 }}
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M9 5H7a2 2 0 00-2 2v10a2 2 0 002 2h8a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2"
                />
              </motion.svg>
              <p className="text-sm lg:text-base">
                No items in {tabs.find((t) => t.id === activeTab)?.label.toLowerCase()}
              </p>
            </motion.div>
          )}
        </motion.div>
      </AnimatePresence>
    </motion.div>
  )
}

export default MyWorkSection
