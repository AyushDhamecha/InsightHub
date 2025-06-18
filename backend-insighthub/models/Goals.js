const mongoose = require("mongoose")

const goalSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: true,
      trim: true,
    },
    priority: {
      type: String,
      enum: ["high", "medium", "low"],
      default: "medium",
    },
    completed: {
      type: Boolean,
      default: false,
    },
    createdAt: {
      type: Date,
      default: Date.now,
    },
    updatedAt: {
      type: Date,
      default: Date.now,
    },
  },
  {
    timestamps: true, // This will automatically manage createdAt and updatedAt
  },
)

// Update the updatedAt field before saving
goalSchema.pre("save", function (next) {
  this.updatedAt = Date.now()
  next()
})

// Update the updatedAt field before updating
goalSchema.pre("findOneAndUpdate", function (next) {
  this.set({ updatedAt: Date.now() })
  next()
})

module.exports = mongoose.model("Goal", goalSchema)
