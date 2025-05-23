import { useState, useEffect } from "react";
import { auth, googleProvider } from "../firebase";
import {
  signInWithPopup,
  signInWithEmailAndPassword,
  createUserWithEmailAndPassword,
} from "firebase/auth";
import { useNavigate } from "react-router-dom";
import { useAuth } from "./AuthContext";

const Login = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const navigate = useNavigate();
  const { user } = useAuth();

  // 🔁 Redirect if already logged in
  useEffect(() => {
    if (user) {
      navigate("/");
    }
  }, [user, navigate]);

  const loginWithEmail = () =>
    signInWithEmailAndPassword(auth, email, password).catch(console.error);

  const signupWithEmail = () =>
    createUserWithEmailAndPassword(auth, email, password).catch(console.error);

  const loginWithGoogle = () =>
    signInWithPopup(auth, googleProvider).catch(console.error);

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gray-100">
  <div className="bg-white p-8 rounded shadow-md w-full max-w-sm">
    <h2 className="text-2xl font-bold mb-4">Login / Signup</h2>
    <input
      type="email"
      placeholder="Email"
      value={email}
      onChange={(e) => setEmail(e.target.value)}
      className="w-full px-3 py-2 mb-3 border rounded"
    />
    <input
      type="password"
      placeholder="Password"
      value={password}
      onChange={(e) => setPassword(e.target.value)}
      className="w-full px-3 py-2 mb-3 border rounded"
    />
    <button
      onClick={loginWithEmail}
      className="w-full bg-blue-500 text-white py-2 rounded hover:bg-blue-600 mb-2"
    >
      Login with Email
    </button>
    <button
      onClick={signupWithEmail}
      className="w-full bg-green-500 text-white py-2 rounded hover:bg-green-600 mb-2"
    >
      Signup with Email
    </button>
    <button
      onClick={loginWithGoogle}
      className="w-full bg-red-500 text-white py-2 rounded hover:bg-red-600"
    >
      Continue with Google
    </button>
  </div>
</div>

  );
};

export default Login;
