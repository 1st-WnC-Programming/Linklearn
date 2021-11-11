import React, { useState, useEffect } from 'react';
import AppRouter from './Router';
import GlobalStyles from './GlobalStyles';
import Footer from './Footer';
import unknown from '../Images/Unknown_person.jpeg';
import { authService } from '../fbase';

const App = () => {
  const [init, setInit] = useState(false);
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [avataURL, setAvataURL] = useState(unknown);

  useEffect(() => {
    authService.onAuthStateChanged((user) => {
      if (user) {
        setIsLoggedIn(true);
        if (user.photoURL !== null) {
          setAvataURL(user.photoURL);
        }
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
          <AppRouter isLoggedIn={isLoggedIn} avataURL={avataURL} />
          <Footer />
        </>
      ) : (
        'Loading...'
      )}
    </>
  );
};

export default App;
