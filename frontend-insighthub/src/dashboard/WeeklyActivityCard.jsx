"use client"

import { motion } from "framer-motion"
import { useState, useEffect } from "react"

const WeeklyActivityCard = () => {
    const [animatedValues, setAnimatedValues] = useState({
        totalProjects: 0,
        onTrack: 0,
        atRisk: 0,
    })

    const projectData = {
        totalProjects: { value: 4, progress: 75, color: "text-green-500", bgColor: "bg-green-500" },
        onTrack: { value: 3, progress: 60, color: "text-yellow-500", bgColor: "bg-yellow-300" },
        atRisk: { value: 1, progress: 25, color: "text-red-500", bgColor: "bg-red-600" },
    }

    useEffect(() => {
        const timer = setTimeout(() => {
            setAnimatedValues({
                totalProjects: projectData.totalProjects.progress,
                onTrack: projectData.onTrack.progress,
                atRisk: projectData.atRisk.progress,
            })
        }, 500)

        return () => clearTimeout(timer)
    }, [])

    const CircularProgress = ({ progress, color, bgColor, size = 60 }) => {
        const circumference = 2 * Math.PI * 18 // radius = 18
        const strokeDasharray = circumference
        const strokeDashoffset = circumference - (progress / 100) * circumference

        return (
            <div className="relative" style={{ width: size, height: size }}>
                <svg className="w-full h-full transform -rotate-90" viewBox="0 0 40 40">
                    {/* Background circle */}
                    <circle cx="20" cy="20" r="18" stroke="currentColor" strokeWidth="5" fill="none" className="text-gray-200" />
                    {/* Progress circle */}
                    <motion.circle
                        cx="20"
                        cy="20"
                        r="18"
                        stroke="currentColor"
                        strokeWidth="4"
                        fill="none"
                        strokeLinecap="round"
                        className={color}
                        strokeDasharray={strokeDasharray}
                        initial={{ strokeDashoffset: circumference }}
                        animate={{ strokeDashoffset: strokeDashoffset }}
                        transition={{
                            duration: 2,
                            ease: "easeInOut",
                            delay: 0.5,
                        }}
                    />
                </svg>
            </div>
        )
    }

    const cardVariants = {
        hidden: { opacity: 0, scale: 0.9, y: 20 },
        visible: {
            opacity: 1,
            scale: 1,
            y: 0,
            transition: {
                duration: 0.6,
                ease: "easeOut",
            },
        },
    }

    const itemVariants = {
        hidden: { opacity: 0, y: 10 },
        visible: { opacity: 1, y: 0 },
    }

    const atRiskProjects = ["SkyForge", "AeroTask", "NovaBuild"] // example project names


    return (
        <motion.div
            variants={cardVariants}
            initial="hidden"
            animate="visible"
            whileHover={{ scale: 1.02, y: -5 }}
            className="bg-white rounded-xl border border-gray-200 p-4 lg:p-6 shadow-lg hover:shadow-xl transition-shadow duration-300"
        >
            {/* Header */}
            <div className="flex items-center justify-between mb-6">
                <motion.h3
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: 0.2 }}
                    className="text-lg font-semibold text-gray-900"
                >
                    Projects
                </motion.h3>
            </div>

            {/* Progress Indicators */}
            <motion.div
                variants={{
                    hidden: { opacity: 0 },
                    visible: {
                        opacity: 1,
                        transition: {
                            staggerChildren: 0.2,
                            delayChildren: 0.5,
                        },
                    },
                }}
                initial="hidden"
                animate="visible"
                className="grid grid-cols-3 gap-4 mb-6"
            >
                {/* Total Projects */}
                <motion.div variants={itemVariants} className="text-center">
                    <div className="flex flex-col items-center space-y-2">
                        <CircularProgress
                            progress={animatedValues.totalProjects}
                            color="text-green-500"
                            bgColor="bg-green-500"
                            size={50}
                        />
                        <div>
                            <motion.div
                                className="text-xl font-bold text-gray-900"
                                initial={{ scale: 0 }}
                                animate={{ scale: 1 }}
                                transition={{ delay: 1, type: "spring", stiffness: 200 }}
                            >
                                {projectData.totalProjects.value.toString().padStart(2, "0")}
                            </motion.div>
                            <div className="text-xs text-gray-600">Total</div>
                        </div>
                    </div>
                </motion.div>

                {/* On Track */}
                <motion.div variants={itemVariants} className="text-center">
                    <div className="flex flex-col items-center space-y-2">
                        <CircularProgress
                            progress={animatedValues.onTrack}
                            color="text-yellow-500"
                            bgColor="bg-yellow-500"
                            size={50}
                        />
                        <div>
                            <motion.div
                                className="text-xl font-bold text-gray-900"
                                initial={{ scale: 0 }}
                                animate={{ scale: 1 }}
                                transition={{ delay: 1.2, type: "spring", stiffness: 200 }}
                            >
                                {projectData.onTrack.value.toString().padStart(2, "0")}
                            </motion.div>
                            <div className="text-xs text-gray-600">On Track</div>
                        </div>
                    </div>
                </motion.div>

                {/* At Risk */}
                <motion.div variants={itemVariants} className="text-center">
                    <div className="flex flex-col items-center space-y-2">
                        <CircularProgress progress={animatedValues.atRisk} color="text-red-500" bgColor="bg-red-500" size={50} />
                        <div>
                            <motion.div
                                className="text-xl font-bold text-gray-900"
                                initial={{ scale: 0 }}
                                animate={{ scale: 1 }}
                                transition={{ delay: 1.4, type: "spring", stiffness: 200 }}
                            >
                                {projectData.atRisk.value.toString().padStart(2, "0")}
                            </motion.div>
                            <div className="text-xs text-gray-600">At Risk</div>
                        </div>
                    </div>
                </motion.div>
            </motion.div>

            {/* Needs Attention */}
            <motion.div
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 1.6 }}
                className="mb-1"
            >
                {/* Outer container - stacked vertically */}
                <div className="flex flex-col w-full">
                    {/* Label + Dot in a row */}
                    <div className="flex items-center space-x-2 mb-2">
                        <span className="text-sm text-gray-600 whitespace-nowrap">Needs Attention</span>
                        <motion.div
                            className="w-2 h-2 bg-red-500 rounded-full"
                            animate={{
                                scale: [1, 1.2, 1],
                                opacity: [1, 0.7, 1],
                            }}
                            transition={{
                                duration: 2,
                                repeat: Number.POSITIVE_INFINITY,
                                ease: "easeInOut",
                            }}
                        />
                    </div>

                    {/* Project tags - horizontal and wrapping */}
                    <div className="flex flex-wrap gap-2">
                        {atRiskProjects.map((project, index) => (
                            <motion.span
                                key={index}
                                whileHover={{ scale: 1.08 }}
                                whileTap={{ scale: 0.95 }}
                                initial={{ opacity: 0, y: 10 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{
                                    delay: 0.2 + index * 0.1,
                                    type: "spring",
                                    stiffness: 100,
                                }}
                                className="inline-block text-sm border border-red-300 rounded-full px-2 py-1 hover:bg-red-100 transition-all duration-300 cursor-pointer"
                            >
                                {project}
                            </motion.span>
                        ))}
                    </div>
                </div>
            </motion.div>



        </motion.div>
    )
}

export default WeeklyActivityCard
