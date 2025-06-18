const express = require("express")
const mongoose = require("mongoose")
const cors = require("cors")
const projectRoutes = require("./routes/Projects")
const goalRoutes = require("./routes/Goals") // Add this line

const app = express()
app.use(cors())
app.use(express.json())

app.use(
  cors({
    origin: "http://localhost:5173", // your frontend
    credentials: true,
  }),
)

mongoose
  .connect("mongodb://127.0.0.1:27017/insighthub")
  .then(() => console.log("MongoDB connected!"))
  .catch((err) => console.log("Mongo error: ", err))

app.use("/projects", projectRoutes) // Mount route
app.use("/goals", goalRoutes) // Add this line for goals routes

app.get("/", (req, res) => {
  res.send("API running...")
})

const PORT = 5000
app.listen(PORT, () => console.log(`Server running on http://localhost:${PORT}`))
