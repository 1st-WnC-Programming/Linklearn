import React from 'react';
import { Link } from 'react-router-dom';

const Navigation = () => {
  return (
    <nav>
      <ul>
        <li>
          <Link to='/'>Home</Link>
        </li>
        <li>
          <Link to='/Board'>Board</Link>
        </li>
        <li>
          <Link to='/Auth'>Auth</Link>
        </li>
        <li>
          <Link to='/TeacherList'>TeacherList</Link>
        </li>
      </ul>
    </nav>
  );
};

export default Navigation;
