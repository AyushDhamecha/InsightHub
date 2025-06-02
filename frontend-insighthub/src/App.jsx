import { BrowserRouter as Router, Routes, Route , useParams} from "react-router-dom";
import { AuthProvider } from "./auth/AuthContext";
import PrivateRoute from "./auth/PrivateRoute";
import Login from "./auth/Login";
import './index.css';
import Dashboard from "./dashboard/Dashboard";
import HomeContent from "./dashboard/HomeContent";
import Projects from "./components/Projects";
import Goals from "./components/Goals";
import ProjectDetails from "./components/ProjectComponents/ProjectDetails";

function App() {
  return (
    <Router>
      <AuthProvider>
        <Routes>
          <Route path="/login" element={<Login />} />
          <Route
            path="/"
            element={
              <PrivateRoute>
                <Dashboard />
              </PrivateRoute>
            }
          >
            <Route index element={<HomeContent />} />

            <Route path="projects" element={<Projects />} />

            <Route path="goals" element={<Goals />} />

            <Route path="/projects/:id" element={<ProjectDetailsWrapper />} />

          </Route>
        </Routes>
      </AuthProvider>
    </Router>
  );
}

function ProjectDetailsWrapper() {
  const { id } = useParams()
  return <ProjectDetails projectId={id} />
}

export default App;