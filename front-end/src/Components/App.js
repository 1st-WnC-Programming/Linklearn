import React, { useState, useEffect } from 'react';
import AppRouter from './Router';
import GlobalStyles from './GlobalStyles';
import Footer from './Footer';
import unknown from '../Images/Unknown_person.jpeg';
import { authService } from '../fbase';
import getData from '../getData';
const App = () => {
  const [init, setInit] = useState(false);
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [avataURL, setAvataURL] = useState(unknown);

  const [info, setInfo] = useState([]);
  const [dataFile, setDataFile] = useState([]);

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
  useEffect(() => {
    setInterval(async () => {
      let result = await getData('dataFile', 1);
      setDataFile(result);
      result = await getData('info', 1001);
      setInfo(result);
    }, 200);
  }, []);
  return (
    <>
      {init ? (
        <>
          <GlobalStyles />
          <AppRouter
            isLoggedIn={isLoggedIn}
            avataURL={avataURL}
            info={info}
            setInfo={setInfo}
            dataFile={dataFile}
            setDataFile={setDataFile}
          />
          <Footer />
        </>
      ) : (
        //TODO: 추후 로딩 애니메이션 넣어야함
        'Loading...'
      )}
    </>
  );
};

export default App;
