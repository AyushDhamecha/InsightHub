const API_BASE_URL = "http://localhost:5000/goals"

// API service for goals
export const goalsApi = {
  // Get all goals
  getAllGoals: async () => {
    try {
      const response = await fetch(API_BASE_URL)
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`)
      }
      return await response.json()
    } catch (error) {
      console.error("Error fetching goals:", error)
      throw error
    }
  },

  // Get a single goal
  getGoal: async (id) => {
    try {
      const response = await fetch(`${API_BASE_URL}/${id}`)
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`)
      }
      return await response.json()
    } catch (error) {
      console.error("Error fetching goal:", error)
      throw error
    }
  },

  // Create a new goal
  createGoal: async (goalData) => {
    try {
      const response = await fetch(API_BASE_URL, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(goalData),
      })
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`)
      }
      return await response.json()
    } catch (error) {
      console.error("Error creating goal:", error)
      throw error
    }
  },

  // Update a goal
  updateGoal: async (id, updateData) => {
    try {
      const response = await fetch(`${API_BASE_URL}/${id}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(updateData),
      })
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`)
      }
      return await response.json()
    } catch (error) {
      console.error("Error updating goal:", error)
      throw error
    }
  },

  // Toggle goal completion
  toggleGoal: async (id) => {
    try {
      const response = await fetch(`${API_BASE_URL}/${id}/toggle`, {
        method: "PATCH",
      })
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`)
      }
      return await response.json()
    } catch (error) {
      console.error("Error toggling goal:", error)
      throw error
    }
  },

  // Delete a goal
  deleteGoal: async (id) => {
    try {
      const response = await fetch(`${API_BASE_URL}/${id}`, {
        method: "DELETE",
      })
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`)
      }
      return await response.json()
    } catch (error) {
      console.error("Error deleting goal:", error)
      throw error
    }
  },

  // Delete all completed goals
  deleteCompletedGoals: async () => {
    try {
      const response = await fetch(`${API_BASE_URL}/completed/all`, {
        method: "DELETE",
      })
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`)
      }
      return await response.json()
    } catch (error) {
      console.error("Error deleting completed goals:", error)
      throw error
    }
  },
}
