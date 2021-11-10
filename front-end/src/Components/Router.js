import { HashRouter as Router, Route, Routes } from 'react-router-dom';
import Board from '../routes/Board';
import Home from '../routes/Home';
import Auth from '../routes/Auth';
import Navigation from './Nav';
import TeacherList from '../routes/TeacherList';

const AppRouter = () => {
  return (
    <Router>
      <Navigation />
      <Routes>
        <Route path='/' element={<Home />} />
        <Route path='/Board' element={<Board />} />
        <Route path='/Auth' element={<Auth />} />
        <Route path='/TeacherList' element={<TeacherList />} />
      </Routes>
    </Router>
  );
};

export default AppRouter;
