const express = require("express")
const mongoose = require("mongoose")
const cors = require("cors")
const dotenv = require("dotenv")
const projectRoutes = require("./routes/Projects")
const goalRoutes = require("./routes/Goals")

dotenv.config() // Load environment variables

const app = express()
app.use(express.json())

app.use(
  cors({
    origin: ["http://localhost:5173", "https://insighthub.onrender.com"],
    credentials: true,
  })
)


// Use MongoDB Atlas URI from .env
mongoose
  .connect(process.env.MONGODB_URI, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  })
  .then(() => console.log("MongoDB Atlas connected!"))
  .catch((err) => console.log("Mongo error: ", err))

app.use("/projects", projectRoutes)
app.use("/goals", goalRoutes)

app.get("/", (req, res) => {
  res.send("API running...")
})

const PORT = process.env.PORT
app.listen(PORT, () => console.log(`Server running on http://localhost:${PORT}`))
