// src/Home.jsx
import { auth } from "./firebase";

const Home = () => {
  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-gray-50 px-4">
      <div className="bg-white p-8 rounded-2xl shadow-md max-w-md w-full text-center">
        <h1 className="text-3xl font-bold text-gray-800 mb-6">
          Welcome to InsightHub 👋
        </h1>
        <button
          onClick={() => auth.signOut()}
          className="bg-red-500 text-white px-6 py-2 rounded-lg hover:bg-red-600 transition duration-300"
        >
          Logout
        </button>
      </div>
    </div>
  );
};

export default Home;
