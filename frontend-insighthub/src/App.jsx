import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import { AuthProvider } from "./auth/AuthContext";
import PrivateRoute from "./auth/PrivateRoute";
import Login from "./auth/Login";
import './index.css';
import Dashboard from "./dashboard/Dashboard";
import HomeContent from "./dashboard/HomeContent";
import Projects from "./components/Projects";
import Goals from "./components/Goals";

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
          </Route>
        </Routes>
      </AuthProvider>
    </Router>
  );
}

export default App;