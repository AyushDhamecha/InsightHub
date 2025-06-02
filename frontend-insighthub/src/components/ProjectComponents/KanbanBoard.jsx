"use client"

import { motion, AnimatePresence } from "framer-motion"
import { useState } from "react"
import TaskCard from "./TaskCard"
import CreateTaskModal from "./CreateTaskModal"

const KanbanBoard = ({ project, onTaskUpdate, onTaskCreate, onTaskDelete }) => {
  const [showCreateModal, setShowCreateModal] = useState(false)
  const [createModalColumn, setCreateModalColumn] = useState("todo")

  const columns = [
    {
      id: "todo",
      title: "To Do",
      color: "bg-red-100",
      borderColor: "border-red-200",
      headerColor: "bg-red-500",
      icon: "📋",
    },
    {
      id: "in-progress",
      title: "In Progress",
      color: "bg-yellow-100",
      borderColor: "border-yellow-200",
      headerColor: "bg-yellow-500",
      icon: "⏳",
    },
    {
      id: "done",
      title: "Done",
      color: "bg-green-100",
      borderColor: "border-green-200",
      headerColor: "bg-green-500",
      icon: "✅",
    },
  ]

  const getTasksByStatus = (status) => {
    return project.tasks?.filter((task) => task.status === status) || []
  }

  const handleCreateTask = (column) => {
    setCreateModalColumn(column)
    setShowCreateModal(true)
  }

  const handleDragStart = (e, taskId) => {
    e.dataTransfer.setData("taskId", taskId.toString())
  }

  const handleDragOver = (e) => {
    e.preventDefault()
  }

  const handleDrop = (e, newStatus) => {
    e.preventDefault()
    const taskId = Number.parseInt(e.dataTransfer.getData("taskId"))
    onTaskUpdate(taskId, { status: newStatus })
  }

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1,
      },
    },
  }

  const columnVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0 },
  }

  return (
    <div className="h-full">
      <motion.div
        variants={containerVariants}
        initial="hidden"
        animate="visible"
        className="grid grid-cols-3 gap-6 h-full"
      >
        {columns.map((column) => {
          const tasks = getTasksByStatus(column.id)
          return (
            <motion.div
              key={column.id}
              variants={columnVariants}
              className={`${column.color} ${column.borderColor} border-2 rounded-2xl p-4 min-h-[600px] flex flex-col`}
              onDragOver={handleDragOver}
              onDrop={(e) => handleDrop(e, column.id)}
            >
              {/* Column Header */}
              <div className={`${column.headerColor} text-white rounded-xl p-4 mb-4 flex items-center justify-between`}>
                <div className="flex items-center space-x-3">
                  <span className="text-2xl">{column.icon}</span>
                  <div>
                    <h3 className="font-bold text-lg">{column.title}</h3>
                    <p className="text-white/80 text-sm">{tasks.length} tasks</p>
                  </div>
                </div>
                <motion.button
                  whileHover={{ scale: 1.1, rotate: 90 }}
                  whileTap={{ scale: 0.9 }}
                  onClick={() => handleCreateTask(column.id)}
                  className="w-8 h-8 bg-white/20 rounded-lg flex items-center justify-center hover:bg-white/30 transition-colors"
                >
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
                  </svg>
                </motion.button>
              </div>

              {/* Tasks */}
              <div className="flex-1 space-y-3 overflow-y-auto">
                <AnimatePresence>
                  {tasks.map((task, index) => (
                    <TaskCard
                      key={task.id}
                      task={task}
                      index={index}
                      onUpdate={onTaskUpdate}
                      onDelete={onTaskDelete}
                      onDragStart={handleDragStart}
                    />
                  ))}
                </AnimatePresence>

                {tasks.length === 0 && (
                  <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    className="flex flex-col items-center justify-center py-8 text-gray-500"
                  >
                    <motion.div
                      animate={{
                        y: [-5, 5, -5],
                      }}
                      transition={{
                        duration: 2,
                        repeat: Number.POSITIVE_INFINITY,
                        ease: "easeInOut",
                      }}
                      className="text-4xl mb-2"
                    >
                      {column.icon}
                    </motion.div>
                    <p className="text-sm text-center">No tasks yet</p>
                    <motion.button
                      whileHover={{ scale: 1.05 }}
                      whileTap={{ scale: 0.95 }}
                      onClick={() => handleCreateTask(column.id)}
                      className="mt-2 text-xs text-blue-600 hover:text-blue-800 font-medium"
                    >
                      Add first task
                    </motion.button>
                  </motion.div>
                )}
              </div>
            </motion.div>
          )
        })}
      </motion.div>

      <CreateTaskModal
        isOpen={showCreateModal}
        onClose={() => setShowCreateModal(false)}
        onCreateTask={onTaskCreate}
        defaultStatus={createModalColumn}
        assignedUsers={project.assignedUsers || []}
      />
    </div>
  )
}

export default KanbanBoard
