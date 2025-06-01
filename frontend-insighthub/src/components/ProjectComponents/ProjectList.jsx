"use client"

import { motion } from "framer-motion"
import { useState, useMemo } from "react"
import { useProjects } from "./ProjectContext"
import ProjectCard from "./ProjectCard"
import CreateProjectForm from "./CreateProjectForm"
import ProjectDetailModal from "./ProjectDetailModal"

const ProjectList = () => {
    const { projects, deleteProject, sampleUsers } = useProjects()
    const [searchTerm, setSearchTerm] = useState("")
    const [statusFilter, setStatusFilter] = useState("all")
    const [assigneeFilter, setAssigneeFilter] = useState("all")
    const [sortBy, setSortBy] = useState("name")
    const [viewMode, setViewMode] = useState("grid")
    const [selectedProject, setSelectedProject] = useState(null)
    const [showCreateForm, setShowCreateForm] = useState(false)
    const [showDetailModal, setShowDetailModal] = useState(false)

    // Filter and sort projects
    const filteredProjects = useMemo(() => {
        const filtered = projects.filter((project) => {
            const matchesSearch =
                project.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                project.description?.toLowerCase().includes(searchTerm.toLowerCase())

            const matchesStatus = statusFilter === "all" || project.status === statusFilter

            const matchesAssignee =
                assigneeFilter === "all" || project.assignedUsers?.some((user) => user.id.toString() === assigneeFilter)

            return matchesSearch && matchesStatus && matchesAssignee
        })

        filtered.sort((a, b) => {
            switch (sortBy) {
                case "name":
                    return a.name.localeCompare(b.name)
                case "dueDate":
                    return new Date(a.dueDate) - new Date(b.dueDate)
                case "completion":
                    return b.completion - a.completion
                case "created":
                    return new Date(b.createdAt) - new Date(a.createdAt)
                default:
                    return 0
            }
        })

        return filtered
    }, [projects, searchTerm, statusFilter, assigneeFilter, sortBy])

    const handleEditProject = (project) => {
        setSelectedProject(project)
        setShowDetailModal(true)
    }

    const handleDeleteProject = (projectId) => {
        if (window.confirm("Are you sure you want to delete this project?")) {
            deleteProject(projectId)
        }
    }

    const handleCreateSuccess = () => {
        // Optionally show a success message
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

    const headerVariants = {
        hidden: { opacity: 0, y: -20 },
        visible: { opacity: 1, y: 0 },
    }

    return (
        <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100">
            <motion.div variants={containerVariants} initial="hidden" animate="visible" className="space-y-8">
                {/* Header */}
                <motion.div
                    variants={headerVariants}
                    className="flex flex-col lg:flex-row lg:items-center lg:justify-between space-y-4 lg:space-y-0"
                >
                    <div>
                        <motion.h1
                            className="text-3xl lg:text-4xl font-bold text-gray-900 mb-2"
                            initial={{ opacity: 0, x: -20 }}
                            animate={{ opacity: 1, x: 0 }}
                            transition={{ duration: 0.6 }}
                        >
                            Projects
                        </motion.h1>
                        <motion.p
                            className="text-gray-600 text-lg"
                            initial={{ opacity: 0, x: -20 }}
                            animate={{ opacity: 1, x: 0 }}
                            transition={{ duration: 0.6, delay: 0.1 }}
                        >
                            Manage and track your projects ({filteredProjects.length} of {projects.length})
                        </motion.p>
                    </div>

                    <motion.button
                        whileHover={{ scale: 1.05, y: -2 }}
                        whileTap={{ scale: 0.95 }}
                        onClick={() => setShowCreateForm(true)}
                        className="flex items-center space-x-2 bg-white text-gray-800 px-5 py-2.5 rounded-lg border border-gray-200 hover:bg-gray-50 transition-all duration-200 shadow-sm hover:shadow-md"
                        initial={{ opacity: 0, scale: 0.8 }}
                        animate={{ opacity: 1, scale: 1 }}
                        transition={{ duration: 0.5, delay: 0.2 }}
                    >
                        <motion.svg
                            className="w-5 h-5 text-blue-600"
                            fill="none"
                            stroke="currentColor"
                            viewBox="0 0 24 24"
                            whileHover={{ rotate: 90 }}
                            transition={{ duration: 0.2 }}
                        >
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
                        </motion.svg>
                        <span className="font-medium">New Project</span>
                    </motion.button>
                </motion.div>

                {/* Filters and Search */}
                <motion.div
                    variants={headerVariants}
                    className="bg-white/70 backdrop-blur-sm rounded-2xl border border-white/20 p-6 shadow-xl"
                >
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4">
                        {/* Search */}
                        <div className="lg:col-span-2">
                            <label className="block text-sm font-semibold text-gray-700 mb-3">Search Projects</label>
                            <motion.div whileFocus={{ scale: 1.02 }} className="relative">
                                <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                                    <svg className="h-5 w-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path
                                            strokeLinecap="round"
                                            strokeLinejoin="round"
                                            strokeWidth={2}
                                            d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
                                        />
                                    </svg>
                                </div>
                                <input
                                    type="text"
                                    value={searchTerm}
                                    onChange={(e) => setSearchTerm(e.target.value)}
                                    className="block w-full pl-12 pr-4 py-3 border border-gray-200 rounded-xl leading-5 bg-white/50 placeholder-gray-500 focus:outline-none focus:placeholder-gray-400 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all duration-200 backdrop-blur-sm"
                                    placeholder="Search projects..."
                                />
                            </motion.div>
                        </div>

                        {/* Status Filter */}
                        <div>
                            <label className="block text-sm font-semibold text-gray-700 mb-3">Status</label>
                            <motion.select
                                whileFocus={{ scale: 1.02 }}
                                value={statusFilter}
                                onChange={(e) => setStatusFilter(e.target.value)}
                                className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all duration-200 bg-white/50 backdrop-blur-sm"
                            >
                                <option value="all">All Status</option>
                                <option value="created-now">Created Now</option>
                                <option value="in-progress">In Progress</option>
                                <option value="completed">Completed</option>
                            </motion.select>
                        </div>

                        {/* Assignee Filter */}
                        <div>
                            <label className="block text-sm font-semibold text-gray-700 mb-3">Assignee</label>
                            <motion.select
                                whileFocus={{ scale: 1.02 }}
                                value={assigneeFilter}
                                onChange={(e) => setAssigneeFilter(e.target.value)}
                                className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all duration-200 bg-white/50 backdrop-blur-sm"
                            >
                                <option value="all">All Assignees</option>
                                {sampleUsers.map((user) => (
                                    <option key={user.id} value={user.id.toString()}>
                                        {user.name}
                                    </option>
                                ))}
                            </motion.select>
                        </div>

                        {/* Sort By */}
                        <div>
                            <label className="block text-sm font-semibold text-gray-700 mb-3">Sort By</label>
                            <motion.select
                                whileFocus={{ scale: 1.02 }}
                                value={sortBy}
                                onChange={(e) => setSortBy(e.target.value)}
                                className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all duration-200 bg-white/50 backdrop-blur-sm"
                            >
                                <option value="name">Name</option>
                                <option value="dueDate">Due Date</option>
                                <option value="completion">Completion</option>
                                <option value="created">Created Date</option>
                            </motion.select>
                        </div>
                    </div>

                    {/* View Mode Toggle and Stats */}
                    <div className="flex items-center justify-between mt-6 pt-6 border-t border-gray-200">
                        <div className="flex items-center space-x-4">
                            <span className="text-sm font-semibold text-gray-700">View:</span>
                            <div className="flex items-center space-x-1 bg-gray-100 rounded-xl p-1">
                                <motion.button
                                    whileHover={{ scale: 1.05 }}
                                    whileTap={{ scale: 0.95 }}
                                    onClick={() => setViewMode("grid")}
                                    className={`p-2 rounded-lg transition-all duration-200 ${viewMode === "grid" ? "bg-white text-blue-600 shadow-sm" : "text-gray-600 hover:text-gray-900"
                                        }`}
                                >
                                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path
                                            strokeLinecap="round"
                                            strokeLinejoin="round"
                                            strokeWidth={2}
                                            d="M4 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2V6zM14 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2V6zM4 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2v-2zM14 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2v-2z"
                                        />
                                    </svg>
                                </motion.button>
                                <motion.button
                                    whileHover={{ scale: 1.05 }}
                                    whileTap={{ scale: 0.95 }}
                                    onClick={() => setViewMode("list")}
                                    className={`p-2 rounded-lg transition-all duration-200 ${viewMode === "list" ? "bg-white text-blue-600 shadow-sm" : "text-gray-600 hover:text-gray-900"
                                        }`}
                                >
                                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path
                                            strokeLinecap="round"
                                            strokeLinejoin="round"
                                            strokeWidth={2}
                                            d="M4 6h16M4 10h16M4 14h16M4 18h16"
                                        />
                                    </svg>
                                </motion.button>
                            </div>
                        </div>

                        <motion.div
                            className="text-sm font-semibold text-gray-600 bg-white/50 px-4 py-2 rounded-xl"
                            initial={{ opacity: 0, scale: 0.8 }}
                            animate={{ opacity: 1, scale: 1 }}
                        >
                            {filteredProjects.length} project{filteredProjects.length !== 1 ? "s" : ""} found
                        </motion.div>
                    </div>
                </motion.div>

                {/* Projects Grid/List */}
                <motion.div
                    variants={containerVariants}
                    className={
                        viewMode === "grid" ? "grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6" : "space-y-4"
                    }
                >
                    {filteredProjects.length > 0 ? (
                        filteredProjects.map((project, index) => (
                            <ProjectCard
                                key={project.id}
                                project={project}
                                onEdit={handleEditProject}
                                onDelete={handleDeleteProject}
                                index={index}
                            />
                        ))
                    ) : (
                        <motion.div
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            className="col-span-full flex flex-col items-center justify-center py-16 text-center"
                        >
                            <motion.div
                                className="w-24 h-24 bg-gradient-to-br from-blue-100 to-blue-200 rounded-full flex items-center justify-center mb-6"
                                initial={{ scale: 0 }}
                                animate={{ scale: 1 }}
                                transition={{ type: "spring", stiffness: 200 }}
                            >
                                <svg className="w-12 h-12 text-blue-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path
                                        strokeLinecap="round"
                                        strokeLinejoin="round"
                                        strokeWidth={2}
                                        d="M9 5H7a2 2 0 00-2 2v10a2 2 0 002 2h8a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2"
                                    />
                                </svg>
                            </motion.div>
                            <h3 className="text-xl font-bold text-gray-900 mb-2">No projects found</h3>
                            <p className="text-gray-600 mb-6 max-w-md">
                                {searchTerm || statusFilter !== "all" || assigneeFilter !== "all"
                                    ? "Try adjusting your filters to see more projects."
                                    : "Get started by creating your first project."}
                            </p>
                            <motion.button
                                whileHover={{ scale: 1.05, y: -2 }}
                                whileTap={{ scale: 0.95 }}
                                onClick={() => setShowCreateForm(true)}
                                className="flex items-center space-x-2 bg-gradient-to-r from-blue-600 to-blue-700 text-white px-6 py-3 rounded-xl hover:from-blue-700 hover:to-blue-800 transition-all duration-200 shadow-lg hover:shadow-xl"
                            >
                                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
                                </svg>
                                <span className="font-semibold">Create Project</span>
                            </motion.button>
                        </motion.div>
                    )}
                </motion.div>

                {/* Modals */}
                <CreateProjectForm
                    isOpen={showCreateForm}
                    onClose={() => setShowCreateForm(false)}
                    onSuccess={handleCreateSuccess}
                />

                <ProjectDetailModal
                    project={selectedProject}
                    isOpen={showDetailModal}
                    onClose={() => {
                        setShowDetailModal(false)
                        setSelectedProject(null)
                    }}
                    onSave={() => {
                        setShowDetailModal(false)
                        setSelectedProject(null)
                    }}
                />
            </motion.div>
        </div>
    )
}

export default ProjectList
