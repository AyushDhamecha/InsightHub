"use client"

import { useState, useRef, useEffect } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { Check, Trash2, Edit3, MoreHorizontal, Save, X } from "lucide-react"

const TaskItem = ({ task, onToggle, onDelete, onUpdate, isCompleted = false }) => {
  const [isEditing, setIsEditing] = useState(false)
  const [editTitle, setEditTitle] = useState(task.title)
  const [editPriority, setEditPriority] = useState(task.priority)
  const [showMenu, setShowMenu] = useState(false)
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false)
  const editInputRef = useRef(null)

  const priorityColors = {
    high: "bg-red-100 text-red-700 border-red-200",
    medium: "bg-blue-100 text-blue-700 border-blue-200",
    low: "bg-green-100 text-green-700 border-green-200",
  }

  const priorityDots = {
    high: "bg-red-400",
    medium: "bg-blue-400",
    low: "bg-green-400",
  }

  const priorityOptions = [
    { value: "high", label: "High", color: "bg-red-100 text-red-700 border-red-200" },
    { value: "medium", label: "Medium", color: "bg-blue-100 text-blue-700 border-blue-200" },
    { value: "low", label: "Low", color: "bg-green-100 text-green-700 border-green-200" },
  ]

  useEffect(() => {
    if (isEditing && editInputRef.current) {
      editInputRef.current.focus()
      editInputRef.current.select()
    }
  }, [isEditing])

  const handleSave = () => {
    if (editTitle.trim()) {
      onUpdate(task.id, {
        title: editTitle.trim(),
        priority: editPriority,
        updatedAt: new Date().toISOString(),
      })
      setIsEditing(false)
      setShowMenu(false)
    }
  }

  const handleCancel = () => {
    setEditTitle(task.title)
    setEditPriority(task.priority)
    setIsEditing(false)
    setShowMenu(false)
  }

  const handleDelete = () => {
    onDelete(task.id)
    setShowDeleteConfirm(false)
    setShowMenu(false)
  }

  const handleKeyPress = (e) => {
    if (e.key === "Enter") {
      handleSave()
    } else if (e.key === "Escape") {
      handleCancel()
    }
  }

  // Close menu when clicking outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (showMenu && !event.target.closest(".task-menu")) {
        setShowMenu(false)
      }
    }
    document.addEventListener("mousedown", handleClickOutside)
    return () => document.removeEventListener("mousedown", handleClickOutside)
  }, [showMenu])

  return (
    <motion.div
      layout
      className={`group relative bg-white border rounded-xl p-4 hover:shadow-md transition-all duration-200 ${
        isCompleted ? "opacity-60" : ""
      } ${isEditing ? "ring-2 ring-blue-500 ring-opacity-50" : ""}`}
      whileHover={{ scale: 1.01 }}
    >
      {isEditing ? (
        // Edit Mode
        <div className="space-y-3">
          <div className="flex items-center gap-3">
            <motion.button
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.9 }}
              onClick={() => onToggle(task.id)}
              className={`w-5 h-5 rounded-full border-2 flex items-center justify-center transition-colors ${
                task.completed ? "bg-green-500 border-green-500 text-white" : "border-slate-300 hover:border-green-400"
              }`}
            >
              {task.completed && <Check className="w-3 h-3" />}
            </motion.button>

            <input
              ref={editInputRef}
              type="text"
              value={editTitle}
              onChange={(e) => setEditTitle(e.target.value)}
              onKeyDown={handleKeyPress}
              className="flex-1 bg-transparent border-b-2 border-blue-500 outline-none text-slate-800 font-medium py-1"
              placeholder="Enter task title..."
            />
          </div>

          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <span className="text-sm text-slate-600">Priority:</span>
              <div className="flex gap-1">
                {priorityOptions.map((option) => (
                  <button
                    key={option.value}
                    onClick={() => setEditPriority(option.value)}
                    className={`px-2 py-1 rounded-lg text-xs font-medium border transition-all ${
                      editPriority === option.value
                        ? option.color
                        : "bg-white border-slate-300 text-slate-600 hover:bg-slate-50"
                    }`}
                  >
                    {option.label}
                  </button>
                ))}
              </div>
            </div>

            <div className="flex items-center gap-2">
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={handleSave}
                className="flex items-center gap-1 bg-green-500 text-white px-3 py-1 rounded-lg text-sm font-medium hover:bg-green-600 transition-colors"
              >
                <Save className="w-3 h-3" />
                Save
              </motion.button>
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={handleCancel}
                className="flex items-center gap-1 bg-slate-500 text-white px-3 py-1 rounded-lg text-sm font-medium hover:bg-slate-600 transition-colors"
              >
                <X className="w-3 h-3" />
                Cancel
              </motion.button>
            </div>
          </div>
        </div>
      ) : (
        // View Mode
        <div className="flex items-center gap-3">
          <motion.button
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.9 }}
            onClick={() => onToggle(task.id)}
            className={`w-5 h-5 rounded-full border-2 flex items-center justify-center transition-colors ${
              task.completed ? "bg-green-500 border-green-500 text-white" : "border-slate-300 hover:border-green-400"
            }`}
          >
            {task.completed && <Check className="w-3 h-3" />}
          </motion.button>

          <div className={`w-2 h-2 rounded-full ${priorityDots[task.priority]}`} />

          <div className="flex-1">
            <span className={`text-slate-800 font-medium ${task.completed ? "line-through" : ""}`}>{task.title}</span>
            {task.updatedAt && (
              <p className="text-xs text-slate-500 mt-1">Updated: {new Date(task.updatedAt).toLocaleDateString()}</p>
            )}
          </div>

          <span className={`px-2 py-1 rounded-lg text-xs font-medium border ${priorityColors[task.priority]}`}>
            {task.priority.charAt(0).toUpperCase() + task.priority.slice(1)}
          </span>

          <div className="relative task-menu">
            <motion.button
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.9 }}
              onClick={() => setShowMenu(!showMenu)}
              className="p-1 rounded-lg hover:bg-slate-100 opacity-0 group-hover:opacity-100 transition-opacity"
            >
              <MoreHorizontal className="w-4 h-4 text-slate-500" />
            </motion.button>

            <AnimatePresence>
              {showMenu && (
                <motion.div
                  initial={{ opacity: 0, scale: 0.95, y: -10 }}
                  animate={{ opacity: 1, scale: 1, y: 0 }}
                  exit={{ opacity: 0, scale: 0.95, y: -10 }}
                  className="absolute right-0 top-8 bg-white border border-slate-200 rounded-lg shadow-lg py-1 z-20 min-w-[120px]"
                >
                  <button
                    onClick={() => {
                      setIsEditing(true)
                      setShowMenu(false)
                    }}
                    className="flex items-center gap-2 px-3 py-2 text-sm text-slate-700 hover:bg-slate-50 w-full text-left transition-colors"
                  >
                    <Edit3 className="w-3 h-3" />
                    Edit
                  </button>
                  <button
                    onClick={() => setShowDeleteConfirm(true)}
                    className="flex items-center gap-2 px-3 py-2 text-sm text-red-600 hover:bg-red-50 w-full text-left transition-colors"
                  >
                    <Trash2 className="w-3 h-3" />
                    Delete
                  </button>
                </motion.div>
              )}
            </AnimatePresence>

            {/* Delete Confirmation Modal */}
            <AnimatePresence>
              {showDeleteConfirm && (
                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50"
                  onClick={() => setShowDeleteConfirm(false)}
                >
                  <motion.div
                    initial={{ scale: 0.95, opacity: 0 }}
                    animate={{ scale: 1, opacity: 1 }}
                    exit={{ scale: 0.95, opacity: 0 }}
                    onClick={(e) => e.stopPropagation()}
                    className="bg-white rounded-xl p-6 max-w-sm mx-4 shadow-xl"
                  >
                    <h3 className="text-lg font-semibold text-slate-800 mb-2">Delete Task</h3>
                    <p className="text-slate-600 mb-4">
                      Are you sure you want to delete "{task.title}"? This action cannot be undone.
                    </p>
                    <div className="flex gap-3">
                      <button
                        onClick={handleDelete}
                        className="flex-1 bg-red-500 text-white py-2 px-4 rounded-lg font-medium hover:bg-red-600 transition-colors"
                      >
                        Delete
                      </button>
                      <button
                        onClick={() => setShowDeleteConfirm(false)}
                        className="flex-1 bg-slate-200 text-slate-800 py-2 px-4 rounded-lg font-medium hover:bg-slate-300 transition-colors"
                      >
                        Cancel
                      </button>
                    </div>
                  </motion.div>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        </div>
      )}
    </motion.div>
  )
}

export default TaskItem
