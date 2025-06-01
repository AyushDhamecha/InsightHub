export const sampleUsers = [
    {
      id: 1,
      name: "Rafael Davis",
      email: "rafael.davis@company.com",
      role: "Project Manager",
      avatar: "RD",
      color: "bg-blue-500",
      isCurrentUser: true,
    },
    {
      id: 2,
      name: "Sarah Johnson",
      email: "sarah.johnson@company.com",
      role: "UI/UX Designer",
      avatar: "SJ",
      color: "bg-pink-500",
    },
    {
      id: 3,
      name: "Mike Chen",
      email: "mike.chen@company.com",
      role: "Frontend Developer",
      avatar: "MC",
      color: "bg-green-500",
    },
    {
      id: 4,
      name: "Emma Wilson",
      email: "emma.wilson@company.com",
      role: "Backend Developer",
      avatar: "EW",
      color: "bg-purple-500",
    },
    {
      id: 5,
      name: "Alex Brown",
      email: "alex.brown@company.com",
      role: "DevOps Engineer",
      avatar: "AB",
      color: "bg-orange-500",
    },
    {
      id: 6,
      name: "Lisa Garcia",
      email: "lisa.garcia@company.com",
      role: "QA Engineer",
      avatar: "LG",
      color: "bg-yellow-500",
    },
    {
      id: 7,
      name: "Tom Anderson",
      email: "tom.anderson@company.com",
      role: "Data Analyst",
      avatar: "TA",
      color: "bg-indigo-500",
    },
    {
      id: 8,
      name: "Jessica Lee",
      email: "jessica.lee@company.com",
      role: "Product Owner",
      avatar: "JL",
      color: "bg-red-500",
    },
  ]
  
  export const getRandomUsers = (count = 3) => {
    const shuffled = [...sampleUsers].sort(() => 0.5 - Math.random())
    return shuffled.slice(0, count)
  }
  
  export const getUserById = (id) => {
    return sampleUsers.find((user) => user.id === id)
  }
  
  export const getCurrentUser = () => {
    return sampleUsers.find((user) => user.isCurrentUser)
  }
  