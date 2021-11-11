import React, { useState, useEffect } from 'react';
import AppRouter from './Router';
import GlobalStyles from './GlobalStyles';
import Footer from './Footer';
import { authService } from '../fbase';

const App = () => {
  const [init, setInit] = useState(false);
  const [isLoggedIn, setIsLoggedIn] = useState(false);

  useEffect(() => {
    authService.onAuthStateChanged((user) => {
      if (user) {
        setIsLoggedIn(true);
      } else {
        setIsLoggedIn(false);
      }
      setInit(true);
    });
  }, []);

  return (
    <>
      {init ? (
        <>
          <GlobalStyles />
          <AppRouter isLoggedIn={isLoggedIn} />
          <Footer />
        </>
      ) : (
        'Loading...'
      )}
    </>
  );
};

export default App;
