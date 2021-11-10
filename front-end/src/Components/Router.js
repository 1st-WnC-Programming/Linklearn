import { HashRouter as Router, Route, Routes } from "react-router-dom";
import Board from "../routes/Board";
import Home from "../routes/Home";
import Login from "../routes/Auth";
import Navigation from "./Nav";
import TeacherList from "../routes/TeacherList";

const AppRouter = () => {
  return (
    <Router>
      <Navigation />
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/Board" element={<Board />} />
        <Route path="/Login" element={<Login />} />
        <Route path="/TeacherList" element={<TeacherList />} />
      </Routes>
    </Router>
  );
};

export default AppRouter;
