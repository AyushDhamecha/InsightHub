// src/Home.jsx
import { auth } from "./firebase";

const Home = () => {
  return (
    <div>
      <h1>Welcome to InsightHub 👋</h1>
      <button onClick={() => auth.signOut()}>Logout</button>
    </div>
  );
};

export default Home;
