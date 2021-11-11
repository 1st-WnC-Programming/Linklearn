import { HashRouter as Router, Route, Routes } from 'react-router-dom';
import Board from '../routes/Board';
import Home from '../routes/Home';
import Auth from '../routes/Auth';
import TeacherList from '../routes/TeacherList';
import Header from './Header';
const AppRouter = ({ isLoggedIn }) => {
  return (
    <Router>
      <Header isLoggedIn={isLoggedIn} />
      <main>
        <Routes>
          <Route path='/' element={<Home />} />
          <Route path='/Board' element={<Board />} />
          <Route path='/Auth' element={<Auth />} />
          <Route path='/TeacherList' element={<TeacherList />} />
        </Routes>
      </main>
    </Router>
  );
};

export default AppRouter;
