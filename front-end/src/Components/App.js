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
  const [userObj, setUserObj] = useState(null);
  const [avataURL, setAvataURL] = useState('');

  const [info, setInfo] = useState([]);
  const [dataFile, setDataFile] = useState([]);
  const [reload, setReload] = useState(1);

  useEffect(() => {
    authService.onAuthStateChanged((user) => {
      if (user) {
        setIsLoggedIn(true);
        setUserObj(user);
        setAvataURL(user.photoURL);
      } else {
        setIsLoggedIn(false);
      }
      setInit(true);
    });
    awaitGetData();
  }, []);

  useEffect(() => {
    awaitGetData();
  }, [reload]);
  const awaitGetData = async () => {
    let result = await getData('dataFile', 1);
    setDataFile(result);
    result = await getData('info', 1001);
    setInfo(result);
  };

  return (
    <>
      {init ? (
        <>
          <GlobalStyles />
          <AppRouter
            userObj={userObj}
            isLoggedIn={isLoggedIn}
            avataURL={avataURL}
            info={info}
            dataFile={dataFile}
            setReload={setReload}
          />
          {/* <Footer /> */}
        </>
      ) : (
        //TODO: 추후 로딩 애니메이션 넣어야함
        'Loading...'
      )}
    </>
  );
};

export default App;
