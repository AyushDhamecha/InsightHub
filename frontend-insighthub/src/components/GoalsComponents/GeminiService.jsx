// GeminiService.jsx
import { GoogleGenAI } from "@google/genai"

class GeminiService {
  constructor(apiKey) {
    this.apiKey = apiKey
    this.ai = new GoogleGenAI({ apiKey: this.apiKey })
    this.model = "gemini-2.5-flash"
  }

  async generateResponse(userInput, tasks = []) {
    try {
      const taskContext =
        tasks.length > 0
          ? `\n\nUser's current tasks:\n${tasks
              .map(
                (task) => `- ${task.title} (${task.priority} priority, ${task.completed ? "completed" : "pending"})`
              )
              .join("\n")}`
          : ""

      const prompt = `You are a helpful AI assistant for a task management application.\n
      User's message: ${userInput}${taskContext}\n
      Please provide a helpful, concise response.`

      console.log("[User Input]:", userInput)
      console.log("[Full Prompt]:", prompt)

      const response = await this.ai.models.generateContent({
        model: this.model,
        contents: prompt,
        config: {
          thinkingConfig: {
            thinkingBudget: 0 // Disables thinking
          }
        }
      })

      console.log("[AI Response]:", response.text)
      return response.text
    } catch (error) {
      console.error("Gemini API Error:", error)
      return "I'm having trouble reaching Gemini right now. Please try again later."
    }
  }
}

export default GeminiService
