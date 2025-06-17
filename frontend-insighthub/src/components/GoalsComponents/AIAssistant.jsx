"use client"

import { useState, useRef, useEffect } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { X, Send, Sparkles, ChevronDown, MessageCircle, Copy, Check } from "lucide-react"
import GeminiService from "./GeminiService"
import MarkdownRenderer from "./MarkdownRenderer"

const AIAssistant = ({ tasks, onClose }) => {
  const [messages, setMessages] = useState([])
  const [inputValue, setInputValue] = useState("")
  const [isLoading, setIsLoading] = useState(false)
  const [showTaskDropdown, setShowTaskDropdown] = useState(false)
  const [selectedTask, setSelectedTask] = useState(null)
  const [geminiService, setGeminiService] = useState(null)
  const [apiKeyError, setApiKeyError] = useState(false)
  const [copiedMessageId, setCopiedMessageId] = useState(null)
  const messagesEndRef = useRef(null)

  // Initialize Gemini service
  useEffect(() => {
    const apiKey = import.meta.env.VITE_GEMINI_API_KEY
    if (apiKey) {
      setGeminiService(new GeminiService(apiKey))
      setApiKeyError(false)
    } else {
      setApiKeyError(true)
      console.error("Gemini API key not found. Please set REACT_APP_GEMINI_API_KEY or NEXT_PUBLIC_GEMINI_API_KEY")
    }
  }, [])

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" })
  }

  useEffect(() => {
    scrollToBottom()
  }, [messages])

  const handleTaskSelect = (task) => {
    setSelectedTask(task)
    setInputValue(`Help me with: "${task.title}"`)
    setShowTaskDropdown(false)
  }

  const handleSendMessage = async () => {
    if (!inputValue.trim()) return

    const userMessage = {
      id: Date.now(),
      type: "user",
      content: inputValue,
      timestamp: new Date(),
    }

    console.log("[User Query]:", inputValue)
    setMessages((prev) => [...prev, userMessage])
    setInputValue("")
    setIsLoading(true)

    try {
      if (!geminiService) {
        throw new Error("Gemini service not initialized")
      }

      const response = await geminiService.generateResponse(inputValue, tasks)
      console.log("[AI Response]:", response)

      const aiMessage = {
        id: Date.now() + 1,
        type: "ai",
        content: response,
        timestamp: new Date(),
      }

      setMessages((prev) => [...prev, aiMessage])
    } catch (error) {
      console.error("Error generating AI response:", error)
      const errorMessage = {
        id: Date.now() + 1,
        type: "ai",
        content: "I'm having trouble processing your request right now. Please try again later.",
        timestamp: new Date(),
      }
      setMessages((prev) => [...prev, errorMessage])
    } finally {
      setIsLoading(false)
    }
  }

  const handleKeyPress = (e) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault()
      handleSendMessage()
    }
  }

  const copyToClipboard = async (text, messageId) => {
    try {
      await navigator.clipboard.writeText(text)
      setCopiedMessageId(messageId)
      setTimeout(() => setCopiedMessageId(null), 2000)
    } catch (error) {
      console.error("Failed to copy text:", error)
    }
  }

  return (
    <motion.div
      initial={{ opacity: 0, x: 20 }}
      animate={{ opacity: 1, x: 0 }}
      exit={{ opacity: 0, x: 20 }}
      className="bg-white rounded-2xl shadow-lg border border-slate-200 h-[calc(100vh-200px)] flex flex-col"
    >
      {/* Header */}
      <div className="flex items-center justify-between p-4 border-b border-slate-200">
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 bg-gradient-to-r from-purple-500 to-pink-500 rounded-full flex items-center justify-center">
            <Sparkles className="w-4 h-4 text-white" />
          </div>
          <div>
            <h3 className="font-semibold text-slate-800">AI Assistant</h3>
            <p className="text-xs text-slate-500">Powered by Gemini</p>
          </div>
        </div>
        <button onClick={onClose} className="p-1 hover:bg-slate-100 rounded-lg transition-colors">
          <X className="w-4 h-4 text-slate-500" />
        </button>
      </div>

      {/* Messages */}
      <div className="flex-1 overflow-y-auto p-4 space-y-4">
        {/* API Key Error Message */}
        {apiKeyError && (
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            className="bg-red-50 border border-red-200 rounded-xl p-4"
          >
            <div className="flex items-center gap-2 text-red-700 mb-2">
              <Sparkles className="w-4 h-4" />
              <span className="font-medium">API Key Required</span>
            </div>
            <p className="text-sm text-red-600">
              Please set your Gemini API key in environment variables (REACT_APP_GEMINI_API_KEY or
              NEXT_PUBLIC_GEMINI_API_KEY) to use the AI assistant.
            </p>
          </motion.div>
        )}

        {/* Welcome Message */}
        {messages.length === 0 && !apiKeyError && (
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            className="bg-gradient-to-r from-blue-50 to-purple-50 rounded-xl p-4 border border-blue-200"
          >
            <div className="flex items-center gap-2 text-blue-700 mb-2">
              <Sparkles className="w-4 h-4" />
              <span className="font-medium">AI Assistant Ready</span>
            </div>
            <p className="text-sm text-blue-600">
              I'm here to help you with your tasks! Ask me anything about productivity, task management, or get specific
              help with your current tasks.
            </p>
          </motion.div>
        )}

        {/* Chat Messages */}
        <AnimatePresence>
          {messages.map((message) => (
            <motion.div
              key={message.id}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              className={`flex ${message.type === "user" ? "justify-end" : "justify-start"}`}
            >
              <div
                className={`max-w-[85%] rounded-2xl ${
                  message.type === "user" ? "bg-blue-500 text-white p-3" : "bg-slate-50 border border-slate-200 p-4"
                }`}
              >
                {message.type === "user" ? (
                  // User message - keep as plain text
                  <>
                    <p className="text-sm whitespace-pre-wrap leading-relaxed">{message.content}</p>
                    <p className="text-xs mt-1 opacity-70 text-blue-100">
                      {message.timestamp.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })}
                    </p>
                  </>
                ) : (
                  // AI message - use MarkdownRenderer
                  <div className="space-y-2">
                    <MarkdownRenderer content={message.content} />

                    {/* Copy button and timestamp for AI messages */}
                    <div className="flex items-center justify-between mt-3 pt-2 border-t border-slate-200">
                      <span className="text-xs text-slate-500">
                        {message.timestamp.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })}
                      </span>
                      <button
                        onClick={() => copyToClipboard(message.content, message.id)}
                        className="flex items-center gap-1 text-xs text-slate-500 hover:text-slate-700 transition-colors"
                      >
                        {copiedMessageId === message.id ? (
                          <>
                            <Check className="w-3 h-3" />
                            Copied
                          </>
                        ) : (
                          <>
                            <Copy className="w-3 h-3" />
                            Copy
                          </>
                        )}
                      </button>
                    </div>
                  </div>
                )}
              </div>
            </motion.div>
          ))}
        </AnimatePresence>

        {/* Loading Indicator */}
        {isLoading && (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="flex justify-start">
            <div className="bg-slate-100 border border-slate-200 p-3 rounded-2xl">
              <div className="flex space-x-1 items-center">
                <div className="w-2 h-2 bg-slate-400 rounded-full animate-bounce" />
                <div className="w-2 h-2 bg-slate-400 rounded-full animate-bounce" style={{ animationDelay: "0.1s" }} />
                <div className="w-2 h-2 bg-slate-400 rounded-full animate-bounce" style={{ animationDelay: "0.2s" }} />
                <span className="text-xs text-slate-500 ml-2">AI is thinking...</span>
              </div>
            </div>
          </motion.div>
        )}

        <div ref={messagesEndRef} />
      </div>

      {/* Input Area */}
      <div className="p-4 border-t border-slate-200">
        {/* Task Selection Dropdown */}
        {tasks.filter((task) => !task.completed).length > 0 && (
          <div className="relative mb-3">
            <button
              onClick={() => setShowTaskDropdown(!showTaskDropdown)}
              className="flex items-center gap-2 text-sm text-slate-600 hover:text-slate-800 transition-colors"
            >
              <MessageCircle className="w-4 h-4" />
              Select a task for assistance
              <ChevronDown className={`w-3 h-3 transition-transform ${showTaskDropdown ? "rotate-180" : ""}`} />
            </button>

            <AnimatePresence>
              {showTaskDropdown && (
                <motion.div
                  initial={{ opacity: 0, y: -10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -10 }}
                  className="absolute bottom-full mb-2 w-full bg-white border border-slate-200 rounded-xl shadow-lg z-10 max-h-40 overflow-y-auto"
                >
                  {tasks
                    .filter((task) => !task.completed)
                    .map((task) => (
                      <button
                        key={task.id}
                        onClick={() => handleTaskSelect(task)}
                        className="w-full text-left p-3 hover:bg-slate-50 transition-colors border-b border-slate-100 last:border-b-0 first:rounded-t-xl last:rounded-b-xl"
                      >
                        <div className="flex items-center gap-2">
                          <div
                            className={`w-2 h-2 rounded-full ${
                              task.priority === "high"
                                ? "bg-red-400"
                                : task.priority === "medium"
                                  ? "bg-blue-400"
                                  : "bg-green-400"
                            }`}
                          />
                          <span className="text-sm text-slate-800 truncate">{task.title}</span>
                          <span
                            className={`text-xs px-2 py-1 rounded-full ${
                              task.priority === "high"
                                ? "bg-red-100 text-red-700"
                                : task.priority === "medium"
                                  ? "bg-blue-100 text-blue-700"
                                  : "bg-green-100 text-green-700"
                            }`}
                          >
                            {task.priority}
                          </span>
                        </div>
                      </button>
                    ))}
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        )}

        {/* Input Field */}
        <div className="flex gap-2">
          <input
            type="text"
            value={inputValue}
            onChange={(e) => setInputValue(e.target.value)}
            onKeyPress={handleKeyPress}
            placeholder={apiKeyError ? "API key required..." : "Ask me anything about your tasks..."}
            className="flex-1 px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent text-sm disabled:opacity-50"
            disabled={isLoading || apiKeyError}
          />
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={handleSendMessage}
            disabled={!inputValue.trim() || isLoading || apiKeyError}
            className="p-2 bg-blue-500 text-white rounded-xl hover:bg-blue-600 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
          >
            <Send className="w-4 h-4" />
          </motion.button>
        </div>

        {/* Status Indicator */}
        <div className="flex items-center justify-between mt-2 text-xs text-slate-500">
          <span>{apiKeyError ? "API key required" : geminiService ? "Connected to Gemini" : "Initializing..."}</span>
          {tasks.length > 0 && <span>{tasks.filter((task) => !task.completed).length} active tasks</span>}
        </div>
      </div>
    </motion.div>
  )
}

export default AIAssistant
