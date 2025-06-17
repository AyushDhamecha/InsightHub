"use client"
import { motion, AnimatePresence } from "framer-motion"
import TaskItem from "./TaskItem"

const TaskList = ({ tasks, onToggle, onDelete, onUpdate }) => {
  const activeTasks = tasks.filter((task) => !task.completed)
  const completedTasks = tasks.filter((task) => task.completed)

  return (
    <div className="h-full flex flex-col">
      {/* Active Tasks */}
      <div className="flex-1 min-h-0">
        {activeTasks.length > 0 ? (
          <div className="space-y-3 h-full overflow-y-auto pr-2">
            <AnimatePresence>
              {activeTasks.map((task, index) => (
                <motion.div
                  key={task.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -20 }}
                  transition={{ delay: index * 0.05 }}
                >
                  <TaskItem task={task} onToggle={onToggle} onDelete={onDelete} onUpdate={onUpdate} />
                </motion.div>
              ))}
            </AnimatePresence>
          </div>
        ) : (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="flex items-center justify-center h-full"
          >
            <div className="text-center py-8">
              <div className="text-6xl mb-4">🎯</div>
              <p className="text-slate-500 text-lg font-medium">No active tasks</p>
              <p className="text-slate-400 text-sm">Add a new task to get started!</p>
            </div>
          </motion.div>
        )}
      </div>

      {/* Completed Tasks */}
      {completedTasks.length > 0 && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="mt-6 pt-4 border-t border-slate-200 flex-shrink-0"
        >
          <div className="flex items-center justify-between mb-3">
            <h3 className="text-sm font-medium text-slate-500">Completed ({completedTasks.length})</h3>
            <div className="text-xs text-slate-400">
              {Math.round((completedTasks.length / tasks.length) * 100)}% Complete
            </div>
          </div>
          <div className="space-y-2 max-h-40 overflow-y-auto pr-2">
            <AnimatePresence>
              {completedTasks.map((task) => (
                <motion.div
                  key={task.id}
                  initial={{ opacity: 0, scale: 0.95 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.95 }}
                >
                  <TaskItem task={task} onToggle={onToggle} onDelete={onDelete} onUpdate={onUpdate} isCompleted />
                </motion.div>
              ))}
            </AnimatePresence>
          </div>
        </motion.div>
      )}
    </div>
  )
}

export default TaskList
