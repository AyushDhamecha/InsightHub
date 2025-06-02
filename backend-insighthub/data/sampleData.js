const mongoose = require("mongoose");
const Project = require("../models/Projects"); // Adjust path if needed

mongoose.connect("mongodb://127.0.0.1:27017/insighthub", {
  useNewUrlParser: true,
  useUnifiedTopology: true,
}).then(async () => {
  console.log("Connected to MongoDB");

  await Project.deleteMany({}); // clear previous data

  const sampleProjects = [
    {
      title: "Website Redesign",
      description: "Revamp the landing page and improve UX.",
      people: ["Alice", "Bob"],
      completedPercentage: 30,
      dueDate: new Date("2025-06-20"),
      status: "in progress",
      priority: "high",
      tags: ["design", "frontend"],
      taskDetails: {
        todo: [
          {
            title: "Audit current UI",
            description: "Review existing site for usability flaws",
            status: "todo",
            priority: "medium"
          }
        ],
        inProgress: [
          {
            title: "Redesign Hero Section",
            description: "Modernize the banner and CTA",
            status: "inProgress",
            priority: "high"
          }
        ],
        done: []
      }
    },
    {
      title: "Mobile App Launch",
      description: "Prepare MVP version of our mobile app",
      people: ["Charlie", "Dana"],
      completedPercentage: 60,
      dueDate: new Date("2025-07-15"),
      status: "in progress",
      priority: "high",
      tags: ["mobile", "launch"],
      taskDetails: {
        todo: [],
        inProgress: [
          {
            title: "Integrate Firebase Auth",
            description: "User login/signup",
            status: "inProgress",
            priority: "high"
          }
        ],
        done: [
          {
            title: "Create UI mockups",
            description: "Figma designs completed",
            status: "done",
            priority: "medium"
          }
        ]
      }
    },
    {
      title: "Database Optimization",
      description: "Improve query speed and indexing",
      people: ["Eva", "Frank"],
      completedPercentage: 10,
      dueDate: new Date("2025-08-01"),
      status: "created",
      priority: "medium",
      tags: ["backend", "mongo"],
      taskDetails: {
        todo: [
          {
            title: "Analyze slow queries",
            description: "Use MongoDB profiler",
            status: "todo",
            priority: "high"
          }
        ],
        inProgress: [],
        done: []
      }
    },
    {
      title: "Marketing Strategy Q3",
      description: "Plan social media and email campaigns",
      people: ["Grace", "Henry"],
      completedPercentage: 40,
      dueDate: new Date("2025-06-30"),
      status: "in progress",
      priority: "low",
      tags: ["marketing", "q3"],
      taskDetails: {
        todo: [],
        inProgress: [],
        done: [
          {
            title: "Research competitors",
            description: "Completed market analysis",
            status: "done",
            priority: "medium"
          }
        ]
      }
    },
    {
      title: "AI Assistant Development",
      description: "Build GenAI-powered assistant",
      people: ["Ivy", "Jake"],
      completedPercentage: 75,
      dueDate: new Date("2025-07-10"),
      status: "in progress",
      priority: "high",
      tags: ["AI", "assistant"],
      taskDetails: {
        todo: [],
        inProgress: [],
        done: [
          {
            title: "Setup OpenAI API",
            description: "Connected to GPT endpoint",
            status: "done",
            priority: "high"
          },
          {
            title: "Initial chat UI",
            description: "Built chat frontend",
            status: "done",
            priority: "medium"
          }
        ]
      }
    },
    {
      title: "Server Migration",
      description: "Move from shared hosting to cloud",
      people: ["Leo", "Nina"],
      completedPercentage: 90,
      dueDate: new Date("2025-05-30"),
      status: "completed",
      priority: "medium",
      tags: ["devops", "migration"],
      taskDetails: {
        todo: [],
        inProgress: [],
        done: [
          {
            title: "Setup AWS EC2",
            description: "Created production server",
            status: "done",
            priority: "high"
          },
          {
            title: "Migrate MongoDB",
            description: "Data ported and tested",
            status: "done",
            priority: "medium"
          }
        ]
      }
    },
    {
      title: "Content Calendar July",
      description: "Prepare daily post schedule for July",
      people: ["Oscar", "Pam"],
      completedPercentage: 50,
      dueDate: new Date("2025-06-25"),
      status: "in progress",
      priority: "low",
      tags: ["content", "calendar"],
      taskDetails: {
        todo: [
          {
            title: "Draft captions",
            description: "Write 30 short-form captions",
            status: "todo",
            priority: "low"
          }
        ],
        inProgress: [
          {
            title: "Design graphics",
            description: "Using Canva and Figma",
            status: "inProgress",
            priority: "medium"
          }
        ],
        done: []
      }
    }
  ];

  await Project.insertMany(sampleProjects);
  console.log("Sample projects inserted");
  process.exit();
}).catch(err => console.error(err));
