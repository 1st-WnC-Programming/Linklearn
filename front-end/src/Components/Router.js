import { HashRouter as Router, Route, Routes } from 'react-router-dom';
import Board from '../routes/Board';
import Home from '../routes/Home';
import Auth from '../routes/Auth';
import Register from '../routes/Register';
import TeacherList from '../routes/TeacherList';
import Header from './Header';
import PostList from '../routes/PostList';
import News from '../routes/News';
import Profile from '../routes/Profile';
const AppRouter = ({ isLoggedIn, avataURL, info, dataFile, setReload }) => {
  return (
    <Router>
      <Header isLoggedIn={isLoggedIn} avataURL={avataURL} />
      <main>
        <Routes>
          <Route path='/' element={<Home />} />
          <Route path='/Board' element={<Board info={info} dataFile={dataFile} setReload={setReload} />} />
          <Route path='/Auth' element={<Auth />} />
          <Route path='/TeacherList' element={<TeacherList />} />
          <Route path='/Register' element={<Register />} />
          <Route
            path='/Board/PostList'
            element={<PostList info={info} dataFile={dataFile} setReload={setReload} />}
          />
          <Route
            path='/Board/:id'
            element={<News info={info} dataFile={dataFile} setReload={setReload} />}
            exact
          />
          <Route path='/Profile' element={<Profile avataURL={avataURL} />} />
        </Routes>
      </main>
    </Router>
  );
};

export default AppRouter;
