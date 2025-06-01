"use client"

import { ProjectProvider } from "../../src/components/ProjectComponents/ProjectContext"
import ProjectList from "../../src/components/ProjectComponents/ProjectList"

export default function ProjectsPage() {
  return (
    <ProjectProvider>
      <div className="min-h-screen bg-gradient-to-br from-gray-50 via-blue-50 to-indigo-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <ProjectList />
        </div>
      </div>
    </ProjectProvider>
  )
}
