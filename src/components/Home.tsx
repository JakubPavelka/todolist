import Sidebar from "./Sidebar";
import Todo from "./Todo";

import "./Home.css";
const Home = () => {
  return (
    <div className="home-flex">
      <Sidebar />
      <Todo />
    </div>
  );
};

export default Home;
